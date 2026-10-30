/** Regras de preço. Espelham o cálculo da view catalog_games / RPC no banco (a verdade é sempre o banco). */

export function applyDiscount(priceCents: number, discountPercent: number): number {
  if (priceCents < 0) throw new RangeError("Preço não pode ser negativo");
  if (discountPercent < 0 || discountPercent > 100) throw new RangeError("Desconto deve estar entre 0 e 100");
  return priceCents - Math.floor((priceCents * discountPercent) / 100);
}

export type PricedItem = { price_cents: number; final_price_cents: number };

export function cartTotals(items: PricedItem[]) {
  const subtotal = items.reduce((s, i) => s + i.price_cents, 0);
  const total = items.reduce((s, i) => s + i.final_price_cents, 0);
  return { subtotal, total, savings: subtotal - total, count: items.length };
}

/** Preço de uma promoção em vigor? */
export function isPromotionActive(p: { active: boolean; starts_at: string; ends_at: string }, now = new Date()): boolean {
  return p.active && new Date(p.starts_at) <= now && now <= new Date(p.ends_at);
}

export function averageRating(ratings: number[]): number {
  if (!ratings.length) return 0;
  return Math.round((ratings.reduce((s, r) => s + r, 0) / ratings.length) * 100) / 100;
}
