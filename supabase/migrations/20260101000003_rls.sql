-- Row Level Security: visitante (anon), cliente (authenticated) e admin (is_admin())
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.platforms enable row level security;
alter table public.games enable row level security;
alter table public.game_tags enable row level security;
alter table public.game_platforms enable row level security;
alter table public.promotions enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.library_items enable row level security;
alter table public.activation_keys enable row level security;
alter table public.wishlists enable row level security;
alter table public.reviews enable row level security;

-- profiles
create policy profiles_select_own on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Vitrine: leitura publica, escrita somente admin
create policy categories_read on public.categories for select using (true);
create policy categories_admin on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy tags_read on public.tags for select using (true);
create policy tags_admin on public.tags for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy platforms_read on public.platforms for select using (true);
create policy platforms_admin on public.platforms for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy games_read on public.games for select using (is_active or public.is_admin());
create policy games_admin on public.games for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy game_tags_read on public.game_tags for select using (true);
create policy game_tags_admin on public.game_tags for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy game_platforms_read on public.game_platforms for select using (true);
create policy game_platforms_admin on public.game_platforms for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy promotions_read on public.promotions for select using (true);
create policy promotions_admin on public.promotions for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Carrinho: somente o dono
create policy carts_owner on public.carts for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy cart_items_owner on public.cart_items for all to authenticated
  using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));

-- Pedidos, pagamentos, biblioteca e chaves: leitura pelo dono/admin; escrita apenas via RPC (security definer)
create policy orders_select on public.orders for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy order_items_select on public.order_items for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy payments_select on public.payments for select to authenticated
  using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
create policy library_select on public.library_items for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
create policy keys_select on public.activation_keys for select to authenticated
  using (exists (select 1 from public.library_items li where li.id = library_item_id and (li.user_id = auth.uid() or public.is_admin())));

-- Lista de desejos
create policy wishlists_owner on public.wishlists for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Avaliacoes: publicas; apenas quem comprou pode criar
create policy reviews_read on public.reviews for select using (true);
create policy reviews_insert_buyers on public.reviews for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (select 1 from public.library_items li where li.user_id = auth.uid() and li.game_id = reviews.game_id)
  );
create policy reviews_update_own on public.reviews for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy reviews_delete_own on public.reviews for delete to authenticated
  using (user_id = auth.uid() or public.is_admin());
