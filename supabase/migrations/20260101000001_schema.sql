-- PixelPorto: schema principal
create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum ('pending', 'paid', 'failed', 'cancelled');
create type public.payment_status as enum ('pending', 'approved', 'declined', 'cancelled');
create type public.payment_method as enum ('card', 'pix', 'boleto', 'free');

-- Perfis (1:1 com auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 60),
  role public.user_role not null default 'customer',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null unique
);

create table public.platforms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null unique
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 120),
  short_description text not null,
  description text not null,
  category_id uuid not null references public.categories (id),
  studio text not null,
  publisher text not null,
  price_cents integer not null check (price_cents >= 0),
  release_date date not null,
  age_rating smallint not null default 0 check (age_rating in (0, 10, 12, 14, 16, 18)),
  cover_path text,
  banner_path text,
  gallery_paths text[] not null default '{}',
  system_requirements jsonb not null default '{}'::jsonb,
  avg_rating numeric(3, 2) not null default 0 check (avg_rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  sales_count integer not null default 0 check (sales_count >= 0),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index games_category_idx on public.games (category_id);
create index games_price_idx on public.games (price_cents);
create index games_release_idx on public.games (release_date desc);
create index games_sales_idx on public.games (sales_count desc);
create index games_title_lower_idx on public.games (lower(title));

create table public.game_tags (
  game_id uuid not null references public.games (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (game_id, tag_id)
);
create index game_tags_tag_idx on public.game_tags (tag_id);

create table public.game_platforms (
  game_id uuid not null references public.games (id) on delete cascade,
  platform_id uuid not null references public.platforms (id) on delete cascade,
  primary key (game_id, platform_id)
);
create index game_platforms_platform_idx on public.game_platforms (platform_id);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references public.games (id) on delete cascade,
  discount_percent smallint not null check (discount_percent between 1 and 95),
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index promotions_game_idx on public.promotions (game_id);
create index promotions_window_idx on public.promotions (active, starts_at, ends_at);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  cart_id uuid not null references public.carts (id) on delete cascade,
  game_id uuid not null references public.games (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (cart_id, game_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  status public.order_status not null default 'pending',
  total_cents integer not null check (total_cents >= 0),
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  check ((status = 'paid') = (paid_at is not null))
);
create index orders_user_idx on public.orders (user_id, created_at desc);
create index orders_status_idx on public.orders (status);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  game_id uuid not null references public.games (id),
  game_title text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  discount_percent smallint not null default 0,
  unique (order_id, game_id)
);
create index order_items_game_idx on public.order_items (game_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.payment_status not null default 'pending',
  method public.payment_method not null,
  amount_cents integer not null check (amount_cents >= 0),
  provider text not null default 'mock',
  provider_ref text,
  failure_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_order_idx on public.payments (order_id);
create unique index payments_one_approved_per_order on public.payments (order_id) where status = 'approved';

create table public.library_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  game_id uuid not null references public.games (id),
  order_id uuid not null references public.orders (id),
  acquired_at timestamptz not null default now(),
  unique (user_id, game_id)
);
create index library_items_game_idx on public.library_items (game_id);

create table public.activation_keys (
  id uuid primary key default gen_random_uuid(),
  library_item_id uuid not null unique references public.library_items (id) on delete cascade,
  game_id uuid not null references public.games (id),
  key text not null unique,
  created_at timestamptz not null default now()
);

create table public.wishlists (
  user_id uuid not null references public.profiles (id) on delete cascade,
  game_id uuid not null references public.games (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (user_id, game_id)
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  game_id uuid not null references public.games (id) on delete cascade,
  author_name text not null default '',
  rating smallint not null check (rating between 1 and 5),
  comment text not null default '' check (char_length(comment) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, game_id)
);
create index reviews_game_idx on public.reviews (game_id, created_at desc);

-- Catalogo publico: jogo + categoria + preco final (promocao vigente) + tags/plataformas
create view public.catalog_games with (security_invoker = true) as
select
  g.*,
  c.slug as category_slug,
  c.name as category_name,
  coalesce(p.discount_percent, 0)::int as discount_percent,
  (g.price_cents - (g.price_cents * coalesce(p.discount_percent, 0)) / 100)::int as final_price_cents,
  coalesce((select array_agg(t.slug order by t.slug) from public.game_tags gt join public.tags t on t.id = gt.tag_id where gt.game_id = g.id), '{}'::text[]) as tag_slugs,
  coalesce((select array_agg(t.name order by t.name) from public.game_tags gt join public.tags t on t.id = gt.tag_id where gt.game_id = g.id), '{}'::text[]) as tag_names,
  coalesce((select array_agg(pl.slug order by pl.slug) from public.game_platforms gp join public.platforms pl on pl.id = gp.platform_id where gp.game_id = g.id), '{}'::text[]) as platform_slugs
from public.games g
join public.categories c on c.id = g.category_id
left join lateral (
  select max(pr.discount_percent) as discount_percent
  from public.promotions pr
  where pr.game_id = g.id and pr.active and now() between pr.starts_at and pr.ends_at
) p on true
where g.is_active;
