import raw from "./catalog.json";
import type { CatalogFilters, CatalogGame, HomeData, Review } from "@/data/games";
import type { Tables } from "@/types/database";

/** Catálogo em memória (modo estático): mesma lógica de filtros/ordenação das consultas ao Supabase. */
const catalog = raw as unknown as {
  games: CatalogGame[];
  reviews: Review[];
  categories: Tables<"categories">[];
  platforms: Tables<"platforms">[];
  tags: Tables<"tags">[];
};

export const staticCategories = () => catalog.categories;
export const staticPlatforms = () => catalog.platforms;
export const staticTags = () => catalog.tags;
export const staticGameBySlug = (slug: string) => catalog.games.find((g) => g.slug === slug) ?? null;
export const staticReviews = (gameId: string) =>
  catalog.reviews.filter((r) => r.game_id === gameId).sort((a, b) => b.created_at.localeCompare(a.created_at));

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function staticSearch(f: CatalogFilters, pageSize: number) {
  let list = catalog.games.filter((g) => {
    if (f.q) {
      const q = norm(f.q);
      if (![g.title, g.studio, g.publisher].some((v) => norm(v).includes(q))) return false;
    }
    if (f.category && g.category_slug !== f.category) return false;
    if (f.platform && !g.platform_slugs.includes(f.platform)) return false;
    if (f.tag && !g.tag_slugs.includes(f.tag)) return false;
    if (f.minPrice !== undefined && g.final_price_cents < Math.round(f.minPrice * 100)) return false;
    if (f.maxPrice !== undefined && g.final_price_cents > Math.round(f.maxPrice * 100)) return false;
    if (f.maxAge !== undefined && g.age_rating > f.maxAge) return false;
    if (f.promo && g.discount_percent <= 0) return false;
    if (f.free && g.final_price_cents !== 0) return false;
    return true;
  });

  const by = (fn: (a: CatalogGame, b: CatalogGame) => number) => (list = [...list].sort(fn));
  switch (f.sort) {
    case "lancamento": by((a, b) => b.release_date.localeCompare(a.release_date)); break;
    case "nota": by((a, b) => Number(b.avg_rating) - Number(a.avg_rating) || b.review_count - a.review_count); break;
    case "preco-asc": by((a, b) => a.final_price_cents - b.final_price_cents); break;
    case "preco-desc": by((a, b) => b.final_price_cents - a.final_price_cents); break;
    case "az": by((a, b) => a.title.localeCompare(b.title, "pt-BR")); break;
    default: by((a, b) => b.sales_count - a.sales_count);
  }

  const page = Math.max(1, f.page ?? 1);
  return { games: list.slice((page - 1) * pageSize, page * pageSize), total: list.length, page, pages: Math.max(1, Math.ceil(list.length / pageSize)) };
}

export function staticRelated(game: CatalogGame, limit: number) {
  return catalog.games.filter((g) => g.category_slug === game.category_slug && g.id !== game.id).sort((a, b) => b.sales_count - a.sales_count).slice(0, limit);
}

export function staticHome(): HomeData {
  const top = (fn: (g: CatalogGame) => boolean, cmp: (a: CatalogGame, b: CatalogGame) => number, n = 14) => catalog.games.filter(fn).sort(cmp).slice(0, n);
  const bySales = (a: CatalogGame, b: CatalogGame) => b.sales_count - a.sales_count;
  const today = new Date().toISOString().slice(0, 10);
  return {
    featured: top((g) => g.is_featured, bySales, 5),
    trending: top(() => true, bySales),
    newReleases: top((g) => g.release_date <= today, (a, b) => b.release_date.localeCompare(a.release_date)),
    promotions: top((g) => g.discount_percent > 0, (a, b) => b.discount_percent - a.discount_percent),
    free: top((g) => g.final_price_cents === 0, bySales),
    // Sem usuário no modo estático: sugestões a partir de um RPG de exemplo, só para mostrar o carrossel.
    because: (() => {
      const base = catalog.games.find((g) => g.slug === "cronicas-de-valdoran");
      if (!base) return null;
      return { title: base.title, games: staticRelated(base, 14) };
    })(),
    error: null,
  };
}
