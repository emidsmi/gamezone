import { createClient } from "@/lib/supabase/server";
import { toError } from "@/lib/errors";
import { isStaticMode } from "@/lib/static-mode";
import { FEATURED_SLUGS } from "@/config/featured";
import { staticGameBySlug } from "@/data/static";
import type { CatalogGame } from "@/data/games";

/** Os 6 jogos da experiência, na ordem de `FEATURED_SLUGS` (Supabase, ou catálogo estático sem banco). */
export async function getFeaturedGames(): Promise<CatalogGame[]> {
  if (isStaticMode()) return FEATURED_SLUGS.map((s) => staticGameBySlug(s)).filter((g): g is CatalogGame => Boolean(g));

  const supabase = await createClient();
  const { data, error } = await supabase.from("catalog_games").select("*").in("slug", FEATURED_SLUGS);
  if (error) throw toError(error);
  const bySlug = new Map((data ?? []).map((g) => [g.slug, g]));
  return FEATURED_SLUGS.map((s) => bySlug.get(s)).filter((g): g is CatalogGame => Boolean(g));
}
