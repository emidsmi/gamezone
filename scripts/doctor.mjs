// Diagnostico da configuracao: variaveis, conexao, migrations, seed, RLS de leitura publica, Storage e usuarios demo.
// Uso: npm run doctor   (le .env.local)
import { createClient } from "@supabase/supabase-js";

const results = [];
const check = (ok, name, detail = "", fix = "") => {
  results.push(ok);
  console.log(`${ok ? "  OK " : "FALHA"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok && fix) console.log(`        -> ${fix}`);
  return ok;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("\n1) Variaveis de ambiente (.env.local)");
check(Boolean(url) && /^https?:\/\//.test(url), "NEXT_PUBLIC_SUPABASE_URL", url ?? "ausente", "Copie .env.example para .env.local e preencha a URL do projeto.");
check(Boolean(anon), "NEXT_PUBLIC_SUPABASE_ANON_KEY", anon ? "definida" : "ausente", "Project Settings > API > anon public key.");
check(Boolean(service), "SUPABASE_SERVICE_ROLE_KEY", service ? "definida" : "ausente", "Project Settings > API > service_role key (nunca com prefixo NEXT_PUBLIC_).");
check(process.env.DEMO_MODE === "true", "DEMO_MODE=true", process.env.DEMO_MODE ?? "ausente", "Defina DEMO_MODE=true para o site abrir sem login.");
if (!url || !anon) { console.log("\nConfigure as variaveis e rode de novo."); process.exit(1); }

const opts = { auth: { persistSession: false, autoRefreshToken: false } };
const pub = createClient(url, anon, opts);

console.log("\n2) Conexao e leitura publica (como visitante, com a anon key)");
const counts = {};
for (const [table, min] of [["games", 40], ["categories", 10], ["tags", 1], ["platforms", 4], ["promotions", 1], ["reviews", 100], ["game_tags", 1], ["game_platforms", 1]]) {
  const { count, error } = await pub.from(table).select("*", { count: "exact", head: true });
  counts[table] = count ?? 0;
  const fix = error
    ? /fetch failed|ECONN|ENOTFOUND/i.test(JSON.stringify(error)) ? "Projeto inacessivel: confira a URL e se o projeto nao esta pausado."
      : /Invalid API key|JWT/i.test(JSON.stringify(error)) ? "Chave invalida: copie de novo em Project Settings > API."
      : /PGRST205|42P01|does not exist|schema cache/i.test(JSON.stringify(error)) ? "Migrations nao aplicadas: npx supabase link --project-ref SEU_REF && npx supabase db push --include-seed"
      : "Verifique as politicas RLS de leitura publica (migration *_rls.sql)."
    : `Seed incompleto: esperado >= ${min}. Rode o seed (README: "Rodar o seed de novo").`;
  check(!error && (count ?? 0) >= min, `${table}`, error ? (error.message || error.code) : `${count} registro(s)`, fix);
}
const { data: view, error: viewErr } = await pub.from("catalog_games").select("id, slug, cover_path, banner_path, gallery_paths, final_price_cents, discount_percent").limit(1000);
check(!viewErr && (view?.length ?? 0) >= 40, "view catalog_games", viewErr ? viewErr.message : `${view.length} jogos ativos`, "Reaplique as migrations.");
check((view ?? []).some((g) => g.discount_percent > 0), "promocoes vigentes aplicadas no preco", `${(view ?? []).filter((g) => g.discount_percent > 0).length} jogo(s) com desconto`, "Reaplique o seed (as promocoes duram 30 dias).");
check((view ?? []).some((g) => g.final_price_cents === 0), "jogos gratuitos", "", "Reaplique o seed.");

console.log("\n3) Storage (bucket publico game-media)");
const sample = view?.[0];
if (sample) {
  const paths = [sample.cover_path, sample.banner_path, sample.gallery_paths?.[0]].filter(Boolean);
  for (const p of paths) {
    const res = await fetch(`${url}/storage/v1/object/public/game-media/${p}`, { method: "HEAD" }).catch(() => null);
    check(Boolean(res?.ok), `abre: ${p}`, res ? `HTTP ${res.status}` : "sem resposta", "Rode npm run db:covers (envia os 205 SVGs) e confirme que o bucket game-media e publico.");
  }
  // amostra maior: 1 capa a cada 5 jogos
  let bad = 0, tested = 0;
  for (const g of (view ?? []).filter((_, i) => i % 5 === 0)) {
    tested++;
    const r = await fetch(`${url}/storage/v1/object/public/game-media/${g.cover_path}`, { method: "HEAD" }).catch(() => null);
    if (!r?.ok) bad++;
  }
  check(bad === 0, "amostra de capas", `${tested - bad}/${tested} abrem`, "Rode npm run db:covers.");
}

console.log("\n4) Usuarios de demonstracao (login real no Supabase Auth)");
for (const [email, password, role] of [["demo@pixelporto.test", "Demo@123456", "customer"], ["admin@pixelporto.test", "Admin@123456", "admin"]]) {
  const client = createClient(url, anon, opts);
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (!check(!error, `login ${email}`, error?.message ?? "ok", "Seed nao aplicado (usuarios criados pelo seed). Veja README.")) continue;
  const { data: profile } = await client.from("profiles").select("role, display_name").eq("id", data.user.id).maybeSingle();
  check(profile?.role === role, `perfil ${email}`, profile ? `${profile.display_name} (${profile.role})` : "sem perfil", "O trigger on_auth_user_created nao rodou: reaplique as migrations e o seed.");
  if (role === "customer") {
    const { count: lib } = await client.from("library_items").select("*", { count: "exact", head: true });
    const { count: keys } = await client.from("activation_keys").select("*", { count: "exact", head: true });
    check((lib ?? 0) >= 3 && keys === lib, "biblioteca do usuario demo", `${lib} jogos, ${keys} chaves`, "Reaplique o seed.");
  }
}

console.log("\n5) Service role (somente servidor)");
if (service) {
  const admin = createClient(url, service, opts);
  const { error } = await admin.rpc("confirm_payment", { p_payment_id: "00000000-0000-0000-0000-000000000000", p_status: "approved" });
  check(Boolean(error?.message?.includes("payment_not_found")), "RPC confirm_payment acessivel ao service role", error?.message ?? "sem erro", "Reaplique as migrations (functions).");
  const { error: anonErr } = await pub.rpc("confirm_payment", { p_payment_id: "00000000-0000-0000-0000-000000000000", p_status: "approved" });
  check(Boolean(anonErr), "RPC confirm_payment BLOQUEADA para visitantes", anonErr?.message ?? "visitante conseguiu chamar!", "Reaplique a migration de funcoes (REVOKE/GRANT).");
}

const failed = results.filter((r) => !r).length;
console.log(`\n${failed ? `${failed} verificacao(oes) falharam.` : "Tudo certo! Rode: npm run dev"}`);
process.exit(failed ? 1 : 0);
