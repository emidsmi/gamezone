export type StatsOrder = { id: string; status: string; total_cents: number; created_at: string };
export type StatsItem = { order_id: string; game_id: string; game_title: string; unit_price_cents: number };

export type SalesStats = {
  paidOrders: number;
  revenueCents: number;
  averageTicketCents: number;
  pendingOrders: number;
  failedOrders: number;
  topGames: { gameId: string; title: string; units: number; revenueCents: number }[];
  last7Days: { day: string; revenueCents: number; orders: number }[];
};

/** Indicadores do painel admin. Apenas pedidos pagos contam como venda. */
export function computeStats(orders: StatsOrder[], items: StatsItem[], now = new Date()): SalesStats {
  const paid = orders.filter((o) => o.status === "paid");
  const paidIds = new Set(paid.map((o) => o.id));
  const revenueCents = paid.reduce((s, o) => s + o.total_cents, 0);

  const byGame = new Map<string, { gameId: string; title: string; units: number; revenueCents: number }>();
  for (const it of items) {
    if (!paidIds.has(it.order_id)) continue;
    const cur = byGame.get(it.game_id) ?? { gameId: it.game_id, title: it.game_title, units: 0, revenueCents: 0 };
    cur.units += 1;
    cur.revenueCents += it.unit_price_cents;
    byGame.set(it.game_id, cur);
  }

  const days: SalesStats["last7Days"] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const day = d.toISOString().slice(0, 10);
    const sameDay = paid.filter((o) => o.created_at.slice(0, 10) === day);
    days.push({ day, orders: sameDay.length, revenueCents: sameDay.reduce((s, o) => s + o.total_cents, 0) });
  }

  return {
    paidOrders: paid.length,
    revenueCents,
    averageTicketCents: paid.length ? Math.round(revenueCents / paid.length) : 0,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    failedOrders: orders.filter((o) => o.status === "failed").length,
    topGames: [...byGame.values()].sort((a, b) => b.units - a.units || b.revenueCents - a.revenueCents).slice(0, 8),
    last7Days: days,
  };
}
