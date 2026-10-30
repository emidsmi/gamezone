import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database, Tables } from "@/types/database";
import { toError } from "@/lib/errors";
import { isStaticMode } from "@/lib/static-mode";
import { staticCategories, staticGameBySlug, staticHome, staticPlatforms, staticRelated, staticReviews, staticSearch, staticTags } from "@/data/static";

export type CatalogGame = Database["public"]["Views"]["catalog_games"]["Row"];
export type Review = Tables<"reviews">;

export const PAGE_SIZE = 24;

export const SORT_OPTIONS = [
  { value: "relevancia", label: "Mais vendidos" },
  { value: "lancamento", label: "Lançamentos" },
  { value: "nota", label: "Melhor avaliados" },
  { value: "preco-asc", label: "Menor preço" },
  { value: "preco-desc", label: "Maior preço" },
  { value: "az", label: "A–Z" },
] as const;

export type CatalogFilters = {
  q?: string;
  category?: string;
  platform?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  maxAge?: number;
  promo?: boolean;
  free?: boolean;
  sort?: string;
  page?: number;
};

/** Remove caracteres que têm significado especial nos filtros do PostgREST. */
const sanitizeSearch = (q: string) => q.replace(/[,()%*\\:"']/g, " ").trim().slice(0, 80);

export async function searchCatalog(f: CatalogFilters) {
  if (isStaticMode()) return staticSearch(f, PAGE_SIZE);
  const supabase = await createClient();
  const page = Math.max(1, f.page ?? 1);
  let query = supabase.from("catalog_games").select("*", { count: "exact" });

  const q = f.q ? sanitizeSearch(f.q) : "";
  if (q) query = query.or(`title.ilike.%${q}%,studio.ilike.%${q}%,publisher.ilike.%${q}%`);
  if (f.category) query = query.eq("category_slug", f.category);
  if (f.platform) query = query.contains("platform_slugs", [f.platform]);
  if (f.tag) query = query.contains("tag_slugs", [f.tag]);
  if (f.minPrice !== undefined) query = query.gte("final_price_cents", Math.round(f.minPrice * 100));
  if (f.maxPrice !== undefined) query = query.lte("final_price_cents", Math.round(f.maxPrice * 100));
  if (f.maxAge !== undefined) query = query.lte("age_rating", f.maxAge);
  if (f.promo) query = query.gt("discount_percent", 0);
  if (f.free) query = query.eq("final_price_cents", 0);

  switch (f.sort) {
    case "lancamento": query = query.order("release_date", { ascending: false }); break;
    case "nota": query = query.order("avg_rating", { ascending: false }).order("review_count", { ascending: false }); break;
    case "preco-asc": query = query.order("final_price_cents", { ascending: true }); break;
    case "preco-desc": query = query.order("final_price_cents", { ascending: false }); break;
    case "az": query = query.order("title", { ascending: true }); break;
    default: query = query.order("sales_count", { ascending: false });
  }

  const from = (page - 1) * PAGE_SIZE;
  const { data, count, error } = await query.range(from, from + PAGE_SIZE - 1);
  if (error) throw toError(error);
  return { games: data ?? [], total: count ?? 0, page, pages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)) };
}

export const getCategories = cache(async () => {
  if (isStaticMode()) return staticCategories();
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data ?? [];
});

export const getPlatforms = cache(async () => {
  if (isStaticMode()) return staticPlatforms();
  const supabase = await createClient();
  const { data } = await supabase.from("platforms").select("*").order("name");
  return data ?? [];
});

export const getTags = cache(async () => {
  if (isStaticMode()) return staticTags();
  const supabase = await createClient();
  const { data } = await supabase.from("tags").select("*").order("name");
  return data ?? [];
});

export async function getGameBySlug(slug: string) {
  if (isStaticMode()) return staticGameBySlug(slug);
  const supabase = await createClient();
  const { data } = await supabase.from("catalog_games").select("*").eq("slug", slug).maybeSingle();
  return data;
}

export async function getGameReviews(gameId: string) {
  if (isStaticMode()) return staticReviews(gameId);
  const supabase = await createClient();
  const { data } = await supabase.from("reviews").select("*").eq("game_id", gameId).order("created_at", { ascending: false }).limit(50);
  return data ?? [];
}

export async function getRelatedGames(game: CatalogGame, limit = 8) {
  if (isStaticMode()) return staticRelated(game, limit);
  const supabase = await createClient();
  const { data } = await supabase
    .from("catalog_games")
    .select("*")
    .eq("category_slug", game.category_slug)
    .neq("id", game.id)
    .order("sales_count", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export type HomeData = {
  featured: CatalogGame[];
  trending: CatalogGame[];
  newReleases: CatalogGame[];
  promotions: CatalogGame[];
  free: CatalogGame[];
  because: { title: string; games: CatalogGame[] } | null;
  /** Primeiro erro de consulta (conexão, migrations, RLS...), para a página mostrar um estado de erro. */
  error: unknown | null;
};

export async function getHomeData(userId?: string): Promise<HomeData> {
  if (isStaticMode()) return staticHome();
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);
  const [featured, trending, newReleases, promotions, free] = await Promise.all([
    supabase.from("catalog_games").select("*").eq("is_featured", true).order("sales_count", { ascending: false }).limit(5),
    supabase.from("catalog_games").select("*").order("sales_count", { ascending: false }).limit(14),
    supabase.from("catalog_games").select("*").lte("release_date", today).order("release_date", { ascending: false }).limit(14),
    supabase.from("catalog_games").select("*").gt("discount_percent", 0).order("discount_percent", { ascending: false }).limit(14),
    supabase.from("catalog_games").select("*").eq("final_price_cents", 0).order("sales_count", { ascending: false }).limit(14),
  ]);

  let because: HomeData["because"] = null;
  if (userId) {
    const { data: last } = await supabase
      .from("library_items")
      .select("game_id, games(title, category_id, slug)")
      .eq("user_id", userId)
      .order("acquired_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    const base = last?.games as { title: string; category_id: string; slug: string } | null | undefined;
    if (last && base) {
      const { data: owned } = await supabase.from("library_items").select("game_id").eq("user_id", userId);
      const ownedIds = (owned ?? []).map((o) => o.game_id);
      const { data: cat } = await supabase.from("categories").select("slug").eq("id", base.category_id).maybeSingle();
      if (cat) {
        const { data: games } = await supabase
          .from("catalog_games")
          .select("*")
          .eq("category_slug", cat.slug)
          .not("id", "in", `(${ownedIds.join(",")})`)
          .order("avg_rating", { ascending: false })
          .limit(14);
        if (games?.length) because = { title: base.title, games };
      }
    }
  }

  return {
    featured: featured.data ?? [],
    trending: trending.data ?? [],
    newReleases: newReleases.data ?? [],
    promotions: promotions.data ?? [],
    free: free.data ?? [],
    because,
    error: [featured, trending, newReleases, promotions, free].find((r) => r.error)?.error ?? null,
  };
}
