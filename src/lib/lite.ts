import type { LiteGame } from "@/lib/local-store";

/** Reduz um jogo do catálogo aos campos que o carrinho local precisa (evita serializar o jogo inteiro). */
export const toLite = (g: LiteGame): LiteGame => ({
  id: g.id, slug: g.slug, title: g.title, studio: g.studio, category_name: g.category_name, cover_path: g.cover_path,
  price_cents: g.price_cents, final_price_cents: g.final_price_cents, discount_percent: g.discount_percent,
});
