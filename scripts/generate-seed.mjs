// Gera supabase/seed.sql e as artes SVG (capa, banner e galeria) em supabase/seed-assets.
// Uso: npm run db:seed:generate
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GAMES, GAME_ICONS, GENRES, PLATFORMS, REVIEWERS, REVIEW_TEXTS } from "./games-data.mjs";
import { art as drawArt, hash, rng } from "./art.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = join(root, "supabase", "seed-assets");
rmSync(assetsDir, { recursive: true, force: true });
mkdirSync(assetsDir, { recursive: true });

// ---------- utilidades ----------
const slugify = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

// ---------- dados derivados ----------
const games = GAMES.map(([title, genre, studio, publisher, price, discount, release, age, tags, platforms, pitch], i) => ({
  title, genre, studio, publisher, price, discount, release, age, tags, platforms, pitch,
  slug: slugify(title),
  icon: GAME_ICONS[title],
  featured: ["Lâmina do Eclipse", "Ilhas de Aurora", "Crônicas de Valdoran", "Gravitron GP", "Fúria de Neon", "Operação Cinzas"].includes(title),
  sales: 40 + Math.floor(rng(title)() * 2800),
  idx: i,
}));

const FEATURES = {
  acao: "Combate fluido, chefes memoráveis e um sistema de evolução que premia a precisão. Inclui modo desafio e suporte a controle.",
  aventura: "Mundo para explorar no seu ritmo, personagens carismáticos e quebra-cabeças que pedem curiosidade, não pressa.",
  rpg: "Dezenas de horas de campanha, árvore de habilidades profunda, companheiros com histórias próprias e finais múltiplos.",
  corrida: "Dezenas de carros e pistas, física afinada, modo carreira, corridas rápidas e ranking semanal.",
  esportes: "Campeonatos por temporada, modo treino, partidas locais para amigos e uma presença forte de jogadas espetaculares.",
  estrategia: "Campanha com missões variadas, escaramuças contra a IA e um editor de mapas para criar seus próprios desafios.",
  terror: "Atmosfera densa, áudio 3D que pede fones de ouvido e sustos construídos com paciência, nunca de graça.",
  indie: "Feito por uma equipe pequena e apaixonada: curto, inventivo e cheio de personalidade.",
  simulacao: "Sistemas profundos e relaxantes, progresso constante e liberdade para jogar do seu jeito.",
  multiplayer: "Partidas rápidas, matchmaking por habilidade e atualizações periódicas com novos mapas e modos.",
};

const reqs = (g) => {
  const light = ["indie", "esportes", "corrida"].includes(g.genre) && g.price < 100;
  const heavy = g.price >= 119.9 && !light;
  const t = light
    ? [{ os: "Windows 10", cpu: "Dual core 2.4 GHz", ram: "4 GB", gpu: "Integrada com DirectX 11", storage: "2 GB" }, { os: "Windows 10/11", cpu: "Quad core 3.0 GHz", ram: "8 GB", gpu: "GTX 750 / RX 560", storage: "2 GB" }]
    : heavy
    ? [{ os: "Windows 10 64 bits", cpu: "Core i5-8400 / Ryzen 5 2600", ram: "12 GB", gpu: "GTX 1060 6GB / RX 580", storage: "60 GB SSD" }, { os: "Windows 11 64 bits", cpu: "Core i7-10700 / Ryzen 7 3700X", ram: "16 GB", gpu: "RTX 3060 / RX 6600 XT", storage: "60 GB SSD" }]
    : [{ os: "Windows 10 64 bits", cpu: "Core i3-8100 / Ryzen 3 2200G", ram: "8 GB", gpu: "GTX 960 / RX 470", storage: "20 GB" }, { os: "Windows 10/11 64 bits", cpu: "Core i5-9400F / Ryzen 5 3500", ram: "16 GB", gpu: "GTX 1660 / RX 5500 XT", storage: "20 GB" }];
  return { minimum: t[0], recommended: t[1] };
};

const tagCatalog = new Map();
for (const g of games) for (const t of g.tags) tagCatalog.set(slugify(t), t);

// ---------- gera SVGs ----------
for (const g of games) {
  writeFileSync(join(assetsDir, `${g.slug}-cover.svg`), drawArt(g, "cover", 0, GENRES[g.genre]));
  writeFileSync(join(assetsDir, `${g.slug}-banner.svg`), drawArt(g, "banner"));
  for (let i = 0; i < 3; i++) writeFileSync(join(assetsDir, `${g.slug}-shot-${i + 1}.svg`), drawArt(g, "shot", i));
}

// ---------- gera seed.sql ----------
let sql = `-- GERADO por scripts/generate-seed.mjs. Nao edite manualmente.
-- Usuarios de teste: ver README.
--
-- Este seed pode ser executado novamente (SQL Editor, psql ou supabase db reset): ele primeiro APAGA o
-- catalogo (jogos, categorias, tags, plataformas e tudo que depende deles) e os usuarios @pixelporto.test.
delete from public.library_items where user_id in (select id from auth.users where email like '%@pixelporto.test');
delete from public.orders where user_id in (select id from auth.users where email like '%@pixelporto.test');
delete from auth.users where email like '%@pixelporto.test';
truncate table public.games, public.categories, public.tags, public.platforms cascade;

`;

sql += "insert into public.categories (slug, name) values\n" + Object.entries(GENRES).map(([s, n]) => `  (${q(s)}, ${q(n)})`).join(",\n") + ";\n\n";
sql += "insert into public.platforms (slug, name) values\n" + Object.entries(PLATFORMS).map(([s, n]) => `  (${q(s)}, ${q(n)})`).join(",\n") + ";\n\n";
sql += "insert into public.tags (slug, name) values\n" + [...tagCatalog].map(([s, n]) => `  (${q(s)}, ${q(n)})`).join(",\n") + ";\n\n";

for (const g of games) {
  const gallery = [1, 2, 3].map((n) => `shots/${g.slug}-shot-${n}.svg`);
  const desc = `${g.pitch}\n\n${FEATURES[g.genre]}\n\nDesenvolvido por ${g.studio} e publicado por ${g.publisher}. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.`;
  sql += `insert into public.games (slug, title, short_description, description, category_id, studio, publisher, price_cents, release_date, age_rating, cover_path, banner_path, gallery_paths, system_requirements, avg_rating, review_count, sales_count, is_featured)
select ${q(g.slug)}, ${q(g.title)}, ${q(g.pitch)}, ${q(desc)}, c.id, ${q(g.studio)}, ${q(g.publisher)}, ${Math.round(g.price * 100)}, ${q(g.release)}, ${g.age}, ${q(`covers/${g.slug}-cover.svg`)}, ${q(`banners/${g.slug}-banner.svg`)}, ARRAY[${gallery.map(q).join(", ")}]::text[], ${q(JSON.stringify(reqs(g)))}::jsonb, 0, 0, ${g.sales}, ${g.featured}
from public.categories c where c.slug = ${q(g.genre)};\n`;
}
sql += "\n";

sql += "insert into public.game_tags (game_id, tag_id)\nselect g.id, t.id from (values\n" +
  games.flatMap((g) => g.tags.map((t) => `  (${q(g.slug)}, ${q(slugify(t))})`)).join(",\n") +
  "\n) v(gs, ts) join public.games g on g.slug = v.gs join public.tags t on t.slug = v.ts;\n\n";
sql += "insert into public.game_platforms (game_id, platform_id)\nselect g.id, p.id from (values\n" +
  games.flatMap((g) => g.platforms.map((p) => `  (${q(g.slug)}, ${q(p)})`)).join(",\n") +
  "\n) v(gs, ps) join public.games g on g.slug = v.gs join public.platforms p on p.slug = v.ps;\n\n";

const promoted = games.filter((g) => g.discount > 0);
sql += "insert into public.promotions (game_id, discount_percent, starts_at, ends_at)\nselect g.id, v.d, now() - interval '2 days', now() + interval '30 days' from (values\n" +
  promoted.map((g) => `  (${q(g.slug)}, ${g.discount})`).join(",\n") + "\n) v(gs, d) join public.games g on g.slug = v.gs;\n\n";

// Usuarios (Supabase Auth). Senhas documentadas no README.
const users = [
  ["00000000-0000-4000-8000-0000000000a1", "admin@pixelporto.test", "Admin GameZone", "Admin@123456", true],
  ["00000000-0000-4000-8000-0000000000c1", "ana@pixelporto.test", "Ana Souza", "Cliente@123456"],
  ["00000000-0000-4000-8000-0000000000c2", "bruno@pixelporto.test", "Bruno Lima", "Cliente@123456"],
  ["00000000-0000-4000-8000-0000000000c3", "carla@pixelporto.test", "Carla Mendes", "Cliente@123456"],
  ["00000000-0000-4000-8000-0000000000e1", "demo@pixelporto.test", "Jogador Demo", "Demo@123456"],
  ...REVIEWERS.map((name, i) => [`00000000-0000-4000-8000-0000000000d${i.toString(16)}`, `avaliador${i + 1}@pixelporto.test`, name, "Avaliador@123456"]),
];
sql += "insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change) values\n" +
  users.map(([id, email, name, pw]) => `  ('00000000-0000-0000-0000-000000000000', ${q(id)}, 'authenticated', 'authenticated', ${q(email)}, crypt(${q(pw)}, gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}'::jsonb, ${q(JSON.stringify({ display_name: name }))}::jsonb, now(), now(), '', '', '', '')`).join(",\n") + ";\n\n";
sql += "insert into auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at) values\n" +
  users.map(([id, email]) => `  (gen_random_uuid(), ${q(id)}, ${q(id)}, ${q(JSON.stringify({ sub: id, email, email_verified: true }))}::jsonb, 'email', now(), now(), now())`).join(",\n") + ";\n\n";
sql += `update public.profiles set role = 'admin' where id = ${q(users[0][0])};\n\n`;

// Avaliacoes ficticias (3 a 5 por jogo)
const reviewRows = [];
const staticReviews = [];
for (const g of games) {
  const r = rng(`reviews:${g.slug}`);
  const base = 3.3 + r() * 1.5;
  const n = 3 + Math.floor(r() * 3);
  const picked = [...REVIEWERS.keys()].sort(() => r() - 0.5).slice(0, n);
  for (const ri of picked) {
    const rating = Math.max(2, Math.min(5, Math.round(base + (r() - 0.5) * 1.8)));
    const pool = REVIEW_TEXTS[rating];
    const text = pool[Math.floor(r() * pool.length)].replace("{t}", g.title);
    const days = Math.floor(r() * 90);
    staticReviews.push({ slug: g.slug, reviewer: REVIEWERS[ri], rating, comment: text, days });
    reviewRows.push(`  (${q(g.slug)}, ${q(`avaliador${ri + 1}@pixelporto.test`)}, ${rating}, ${q(text)}, ${days})`);
  }
}
sql += "insert into public.reviews (user_id, game_id, rating, comment, created_at)\nselect u.id, g.id, v.rating, v.comment, now() - make_interval(days => v.days) from (values\n" +
  reviewRows.join(",\n") + "\n) v(gs, email, rating, comment, days) join public.games g on g.slug = v.gs join auth.users u on u.email = v.email;\n\n";

// Compras de teste (passam pela RPC confirm_payment)
sql += `create or replace function pg_temp.seed_order(p_email text, p_slugs text[], p_method public.payment_method, p_outcome public.payment_status, p_days_ago int)
returns void language plpgsql as $f$
declare v_uid uuid; v_order uuid; v_pay uuid; v_total int; v_at timestamptz := now() - make_interval(days => p_days_ago);
begin
  select id into v_uid from auth.users where email = p_email;
  select coalesce(sum(final_price_cents), 0) into v_total from public.catalog_games where slug = any(p_slugs);
  insert into public.orders (user_id, total_cents) values (v_uid, v_total) returning id into v_order;
  insert into public.order_items (order_id, game_id, game_title, unit_price_cents, discount_percent)
    select v_order, id, title, final_price_cents, discount_percent from public.catalog_games where slug = any(p_slugs);
  insert into public.payments (order_id, method, amount_cents) values (v_order, case when v_total = 0 then 'free'::public.payment_method else p_method end, v_total) returning id into v_pay;
  if p_outcome = 'approved' then
    perform public.confirm_payment(v_pay, 'approved', 'mock-' || substr(v_pay::text, 1, 8));
  elsif p_outcome = 'declined' then
    perform public.confirm_payment(v_pay, 'declined', 'mock-' || substr(v_pay::text, 1, 8), 'Cartão recusado pelo emissor');
  end if;
  update public.orders set created_at = v_at, paid_at = case when status = 'paid' then v_at + interval '1 minute' end where id = v_order;
  update public.payments set created_at = v_at where id = v_pay;
  update public.library_items set acquired_at = v_at + interval '1 minute' where order_id = v_order;
end $f$;

select pg_temp.seed_order('ana@pixelporto.test', array['lamina-do-eclipse','ilhas-de-aurora','cronicas-de-valdoran'], 'card', 'approved', 20);
select pg_temp.seed_order('ana@pixelporto.test', array['asfalto-solar','pixel-pomar'], 'pix', 'approved', 8);
select pg_temp.seed_order('bruno@pixelporto.test', array['operacao-cinzas','esquadrao-vortice'], 'card', 'approved', 15);
select pg_temp.seed_order('bruno@pixelporto.test', array['futsal-arena-pro'], 'card', 'declined', 6);
select pg_temp.seed_order('bruno@pixelporto.test', array['gravitron-gp'], 'card', 'approved', 3);
select pg_temp.seed_order('carla@pixelporto.test', array['fazenda-lua-nova','sopa-de-estrelas'], 'pix', 'approved', 12);
select pg_temp.seed_order('carla@pixelporto.test', array['colonia-kepler'], 'boleto', 'pending', 1);
-- Usuario demo (modo demonstracao): biblioteca com 3 jogos; o mais recente (RPG) alimenta "Porque voce jogou X"
select pg_temp.seed_order('demo@pixelporto.test', array['lamina-do-eclipse','ilhas-de-aurora'], 'card', 'approved', 18);
select pg_temp.seed_order('demo@pixelporto.test', array['cronicas-de-valdoran'], 'pix', 'approved', 5);

insert into public.wishlists (user_id, game_id)
select u.id, g.id from auth.users u join public.games g on g.slug in ('gravitron-gp', 'relicario-de-areia', 'sopa-de-estrelas')
where u.email = 'demo@pixelporto.test';
`;

writeFileSync(join(root, "supabase", "seed.sql"), sql);

// ---------- modo estatico (entrega parcial, sem Supabase) ----------
// Mesmos dados do seed em src/data/static/catalog.json + SVGs em public/media (servidos pelo proprio Next/Vercel).
const uuid = (n) => `00000000-0000-4000-9000-${n.toString(16).padStart(12, "0")}`;
const catIds = Object.fromEntries(Object.keys(GENRES).map((k, i) => [k, uuid(0x100 + i)]));
const now = new Date();
const staticGames = games.map((g, i) => {
  const mine = staticReviews.filter((x) => x.slug === g.slug);
  const avg = mine.length ? Math.round((mine.reduce((a, x) => a + x.rating, 0) / mine.length) * 100) / 100 : 0;
  const priceCents = Math.round(g.price * 100);
  return {
    id: uuid(0x1000 + i), slug: g.slug, title: g.title, short_description: g.pitch,
    description: `${g.pitch}

${FEATURES[g.genre]}

Desenvolvido por ${g.studio} e publicado por ${g.publisher}. Entrega digital: após a confirmação do pagamento o jogo entra na sua biblioteca com a chave de ativação.`,
    category_id: catIds[g.genre], studio: g.studio, publisher: g.publisher, price_cents: priceCents, release_date: g.release, age_rating: g.age,
    cover_path: `covers/${g.slug}-cover.svg`, banner_path: `banners/${g.slug}-banner.svg`,
    gallery_paths: [1, 2, 3].map((n) => `shots/${g.slug}-shot-${n}.svg`),
    system_requirements: reqs(g), avg_rating: avg, review_count: mine.length, sales_count: g.sales, is_featured: g.featured, is_active: true,
    created_at: now.toISOString(), updated_at: now.toISOString(),
    category_slug: g.genre, category_name: GENRES[g.genre], discount_percent: g.discount,
    final_price_cents: priceCents - Math.floor((priceCents * g.discount) / 100),
    tag_slugs: g.tags.map(slugify).sort(), tag_names: [...g.tags].sort((a, b) => a.localeCompare(b)), platform_slugs: [...g.platforms].sort(),
  };
});
const staticReviewRows = staticReviews.map((x, i) => ({
  id: uuid(0x9000 + i), user_id: uuid(0x500 + REVIEWERS.indexOf(x.reviewer)), game_id: staticGames.find((g) => g.slug === x.slug).id,
  author_name: x.reviewer, rating: x.rating, comment: x.comment,
  created_at: new Date(now.getTime() - x.days * 86400000).toISOString(), updated_at: now.toISOString(),
}));
const catalog = {
  games: staticGames,
  reviews: staticReviewRows,
  categories: Object.entries(GENRES).map(([slug, name]) => ({ id: catIds[slug], slug, name, created_at: now.toISOString() })),
  platforms: Object.entries(PLATFORMS).map(([slug, name], i) => ({ id: uuid(0x300 + i), slug, name })),
  tags: [...tagCatalog].map(([slug, name], i) => ({ id: uuid(0x400 + i), slug, name })),
};
mkdirSync(join(root, "src", "data", "static"), { recursive: true });
writeFileSync(join(root, "src", "data", "static", "catalog.json"), JSON.stringify(catalog));
rmSync(join(root, "public", "media"), { recursive: true, force: true });
for (const g of games) {
  const out = (dir, name, svg) => { mkdirSync(join(root, "public", "media", dir), { recursive: true }); writeFileSync(join(root, "public", "media", dir, name), svg); };
  out("covers", `${g.slug}-cover.svg`, drawArt(g, "cover", 0, GENRES[g.genre]));
  out("banners", `${g.slug}-banner.svg`, drawArt(g, "banner"));
  for (let i = 0; i < 3; i++) out("shots", `${g.slug}-shot-${i + 1}.svg`, drawArt(g, "shot", i));
}
console.log(`seed.sql gerado: ${games.length} jogos, ${tagCatalog.size} tags, ${reviewRows.length} avaliacoes, ${games.length * 5} SVGs.`);
