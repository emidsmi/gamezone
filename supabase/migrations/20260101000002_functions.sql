-- Funcoes auxiliares, triggers e RPCs transacionais

create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger games_touch before update on public.games for each row execute function public.touch_updated_at();
create trigger payments_touch before update on public.payments for each row execute function public.touch_updated_at();
create trigger reviews_touch before update on public.reviews for each row execute function public.touch_updated_at();

-- Cria o perfil quando um usuario se cadastra no Supabase Auth
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''), split_part(new.email, '@', 1))
  );
  return new;
end $$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- Impede que um cliente promova a si mesmo a admin
create function public.prevent_role_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    raise exception 'role_change_forbidden' using errcode = '42501';
  end if;
  return new;
end $$;

create trigger profiles_prevent_role_change before update on public.profiles
for each row execute function public.prevent_role_change();

-- Preenche o nome do autor da avaliacao
create function public.set_review_author() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  select display_name into new.author_name from public.profiles where id = new.user_id;
  return new;
end $$;

create trigger reviews_set_author before insert on public.reviews
for each row execute function public.set_review_author();

-- Mantem nota media e contagem de avaliacoes
create function public.refresh_game_rating() returns trigger
language plpgsql security definer set search_path = '' as $$
declare gid uuid := coalesce(new.game_id, old.game_id);
begin
  update public.games g set
    avg_rating = coalesce((select round(avg(rating)::numeric, 2) from public.reviews where game_id = gid), 0),
    review_count = (select count(*) from public.reviews where game_id = gid)
  where g.id = gid;
  return null;
end $$;

create trigger reviews_refresh_rating after insert or update or delete on public.reviews
for each row execute function public.refresh_game_rating();

create function public.generate_activation_key() returns text
language sql volatile set search_path = '' as $$
  select upper(
    substr(h, 1, 5) || '-' || substr(h, 6, 5) || '-' || substr(h, 11, 5) || '-' || substr(h, 16, 5)
  ) from (select replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '') as h) s;
$$;

-- Cria pedido + pagamento pendente a partir do carrinho do usuario logado.
-- Os precos sao sempre recalculados no banco (nunca confiados ao cliente).
create function public.create_order_from_cart(p_method public.payment_method)
returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_cart uuid;
  v_order uuid;
  v_payment uuid;
  v_total integer;
  v_count integer;
  v_method public.payment_method := p_method;
begin
  if v_uid is null then raise exception 'not_authenticated' using errcode = '28000'; end if;

  select id into v_cart from public.carts where user_id = v_uid;
  if v_cart is null then raise exception 'empty_cart'; end if;

  select count(*), coalesce(sum(cg.final_price_cents), 0)
    into v_count, v_total
  from public.cart_items ci join public.catalog_games cg on cg.id = ci.game_id
  where ci.cart_id = v_cart;

  if v_count = 0 then raise exception 'empty_cart'; end if;
  if v_count <> (select count(*) from public.cart_items where cart_id = v_cart) then
    raise exception 'game_unavailable';
  end if;
  if exists (
    select 1 from public.cart_items ci join public.library_items li on li.game_id = ci.game_id and li.user_id = v_uid
    where ci.cart_id = v_cart
  ) then raise exception 'already_owned'; end if;

  if v_total = 0 then v_method := 'free'; end if;
  if v_total > 0 and v_method = 'free' then raise exception 'invalid_method'; end if;

  -- cancela pedidos pendentes anteriores
  update public.payments set status = 'cancelled'
   where status = 'pending' and order_id in (select id from public.orders where user_id = v_uid and status = 'pending');
  update public.orders set status = 'cancelled' where user_id = v_uid and status = 'pending';

  insert into public.orders (user_id, total_cents) values (v_uid, v_total) returning id into v_order;

  insert into public.order_items (order_id, game_id, game_title, unit_price_cents, discount_percent)
  select v_order, cg.id, cg.title, cg.final_price_cents, cg.discount_percent
  from public.cart_items ci join public.catalog_games cg on cg.id = ci.game_id
  where ci.cart_id = v_cart;

  insert into public.payments (order_id, method, amount_cents)
  values (v_order, v_method, v_total) returning id into v_payment;

  return jsonb_build_object('order_id', v_order, 'payment_id', v_payment, 'total_cents', v_total, 'method', v_method);
end $$;

-- Confirmacao de pagamento: UNICA porta de entrada para liberar jogos.
-- Em uma transacao: atualiza pagamento, marca pedido pago, adiciona a biblioteca e gera chaves.
create function public.confirm_payment(
  p_payment_id uuid,
  p_status public.payment_status,
  p_provider_ref text default null,
  p_reason text default null
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_pay public.payments%rowtype;
  v_order public.orders%rowtype;
  v_item record;
  v_lib uuid;
  v_released integer := 0;
begin
  select * into v_pay from public.payments where id = p_payment_id for update;
  if not found then raise exception 'payment_not_found'; end if;

  select * into v_order from public.orders where id = v_pay.order_id for update;

  if v_pay.status = 'approved' then
    return jsonb_build_object('status', 'approved', 'order_id', v_order.id, 'already_processed', true, 'released', 0);
  end if;
  if v_pay.status in ('declined', 'cancelled') then
    raise exception 'payment_closed';
  end if;

  if p_status = 'pending' then
    update public.payments set provider_ref = coalesce(p_provider_ref, provider_ref) where id = v_pay.id;
    return jsonb_build_object('status', 'pending', 'order_id', v_order.id, 'released', 0);
  end if;

  if p_status in ('declined', 'cancelled') then
    update public.payments set status = p_status, provider_ref = coalesce(p_provider_ref, provider_ref), failure_reason = p_reason
     where id = v_pay.id;
    update public.orders set status = case when p_status = 'declined' then 'failed'::public.order_status else 'cancelled'::public.order_status end
     where id = v_order.id and status = 'pending';
    return jsonb_build_object('status', p_status, 'order_id', v_order.id, 'released', 0);
  end if;

  -- aprovado
  if v_order.status <> 'pending' then raise exception 'order_not_pending'; end if;
  if v_pay.amount_cents <> v_order.total_cents
     or v_order.total_cents <> (select coalesce(sum(unit_price_cents), 0) from public.order_items where order_id = v_order.id) then
    raise exception 'amount_mismatch';
  end if;
  if not exists (select 1 from public.order_items where order_id = v_order.id) then
    raise exception 'empty_order';
  end if;

  update public.payments set status = 'approved', provider_ref = coalesce(p_provider_ref, provider_ref), failure_reason = null
   where id = v_pay.id;
  update public.orders set status = 'paid', paid_at = now() where id = v_order.id;

  for v_item in select game_id from public.order_items where order_id = v_order.id loop
    insert into public.library_items (user_id, game_id, order_id)
    values (v_order.user_id, v_item.game_id, v_order.id)
    on conflict (user_id, game_id) do nothing
    returning id into v_lib;

    if v_lib is not null then
      insert into public.activation_keys (library_item_id, game_id, key)
      values (v_lib, v_item.game_id, public.generate_activation_key());
      update public.games set sales_count = sales_count + 1 where id = v_item.game_id;
      v_released := v_released + 1;
    end if;
    v_lib := null;
  end loop;

  delete from public.cart_items
   where cart_id in (select id from public.carts where user_id = v_order.user_id)
     and game_id in (select game_id from public.order_items where order_id = v_order.id);

  return jsonb_build_object('status', 'approved', 'order_id', v_order.id, 'released', v_released);
end $$;

-- Somente o servidor (service_role) confirma pagamentos; clientes nunca chamam diretamente.
revoke all on function public.confirm_payment(uuid, public.payment_status, text, text) from public, anon, authenticated;
grant execute on function public.confirm_payment(uuid, public.payment_status, text, text) to service_role;

revoke all on function public.create_order_from_cart(public.payment_method) from public, anon;
grant execute on function public.create_order_from_cart(public.payment_method) to authenticated;

revoke all on function public.generate_activation_key() from public, anon, authenticated;
grant execute on function public.generate_activation_key() to service_role;
