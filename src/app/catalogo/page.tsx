import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getPlatforms, searchCatalog, SORT_OPTIONS } from "@/data/games";
import { getUserFlags } from "@/data/user-data";
import { GameCard } from "@/components/GameCard";
import { FiltersPanel } from "@/components/FiltersPanel";

export const metadata: Metadata = { title: "Catálogo" };

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const num = (v: string | undefined) => (v !== undefined && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined);

const AGES = [
  { value: "0", label: "Livre" },
  { value: "10", label: "Até 10 anos" },
  { value: "12", label: "Até 12 anos" },
  { value: "14", label: "Até 14 anos" },
  { value: "16", label: "Até 16 anos" },
  { value: "18", label: "Até 18 anos" },
];

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const f = {
    q: one(sp.q)?.slice(0, 80),
    category: one(sp.categoria),
    platform: one(sp.plataforma),
    tag: one(sp.tag),
    minPrice: num(one(sp.min)),
    maxPrice: num(one(sp.max)),
    maxAge: num(one(sp.idade)),
    promo: one(sp.promo) === "1",
    free: one(sp.free) === "1",
    sort: one(sp.sort) ?? "relevancia",
    page: num(one(sp.page)) ?? 1,
  };

  const [{ games, total, page, pages }, categories, platforms, flags] = await Promise.all([searchCatalog(f), getCategories(), getPlatforms(), getUserFlags()]);

  const pageHref = (p: number) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(sp)) { const val = one(v); if (val && k !== "page") qs.set(k, val); }
    qs.set("page", String(p));
    return `/catalogo?${qs.toString()}`;
  };
  const back = "/catalogo";

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Catálogo</h1>
      <p className="mt-1 text-muted" aria-live="polite">{total} {total === 1 ? "jogo encontrado" : "jogos encontrados"}</p>

      <div className="mt-6 grid gap-6 md:grid-cols-[15rem_1fr] lg:grid-cols-[17rem_1fr]">
        <FiltersPanel activeCount={[f.q, f.category, f.platform, f.tag, f.minPrice, f.maxPrice, f.maxAge, f.promo || undefined, f.free || undefined].filter((v) => v !== undefined && v !== "").length}>
        <form method="get" action="/catalogo" className="card h-fit space-y-4 p-4" aria-label="Filtros do catálogo">
          <div>
            <label htmlFor="q" className="mb-1 block text-sm font-semibold">Buscar</label>
            <input id="q" name="q" defaultValue={f.q} type="search" placeholder="Título, estúdio…" className="input" />
          </div>
          <div>
            <label htmlFor="categoria" className="mb-1 block text-sm font-semibold">Gênero</label>
            <select id="categoria" name="categoria" defaultValue={f.category ?? ""} className="input">
              <option value="">Todos</option>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="plataforma" className="mb-1 block text-sm font-semibold">Plataforma</label>
            <select id="plataforma" name="plataforma" defaultValue={f.platform ?? ""} className="input">
              <option value="">Todas</option>
              {platforms.map((p) => <option key={p.id} value={p.slug}>{p.name}</option>)}
            </select>
          </div>
          <fieldset>
            <legend className="mb-1 text-sm font-semibold">Faixa de preço (R$)</legend>
            <div className="flex items-center gap-2">
              <label className="sr-only" htmlFor="min">Preço mínimo</label>
              <input id="min" name="min" type="number" min={0} step={1} defaultValue={f.minPrice} placeholder="De" className="input" />
              <label className="sr-only" htmlFor="max">Preço máximo</label>
              <input id="max" name="max" type="number" min={0} step={1} defaultValue={f.maxPrice} placeholder="Até" className="input" />
            </div>
          </fieldset>
          <div>
            <label htmlFor="idade" className="mb-1 block text-sm font-semibold">Classificação indicativa</label>
            <select id="idade" name="idade" defaultValue={f.maxAge !== undefined ? String(f.maxAge) : ""} className="input">
              <option value="">Qualquer</option>
              {AGES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="promo" value="1" defaultChecked={f.promo} className="h-4 w-4 accent-lime-400" /> Somente em promoção</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="free" value="1" defaultChecked={f.free} className="h-4 w-4 accent-lime-400" /> Somente gratuitos</label>
          <div>
            <label htmlFor="sort" className="mb-1 block text-sm font-semibold">Ordenar por</label>
            <select id="sort" name="sort" defaultValue={f.sort} className="input">
              {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-primary flex-1">Aplicar</button>
            <Link href="/catalogo" className="btn btn-ghost">Limpar</Link>
          </div>
        </form>
        </FiltersPanel>

        <section aria-label="Resultados">
          {games.length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-lg font-bold">Nenhum jogo encontrado</p>
              <p className="mt-1 text-muted">Tente remover alguns filtros ou buscar por outro termo.</p>
              <Link href="/catalogo" className="btn btn-primary mt-4">Ver todos os jogos</Link>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {games.map((g) => (
                <li key={g.id}><GameCard game={g} flags={flags} back={back} fluid /></li>
              ))}
            </ul>
          )}

          {pages > 1 && (
            <nav aria-label="Paginação" className="mt-8 flex items-center justify-center gap-3">
              {page > 1 && <Link className="btn btn-ghost" href={pageHref(page - 1)}>← Anterior</Link>}
              <span className="text-sm text-muted">Página {page} de {pages}</span>
              {page < pages && <Link className="btn btn-ghost" href={pageHref(page + 1)}>Próxima →</Link>}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
