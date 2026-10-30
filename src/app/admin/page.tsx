import type { Metadata } from "next";
import { getAdminStats } from "@/data/admin";
import { formatMoney } from "@/lib/format";

export const metadata: Metadata = { title: "Admin · Indicadores" };

export default async function AdminDashboard() {
  const s = await getAdminStats();
  const max = Math.max(1, ...s.last7Days.map((d) => d.revenueCents));
  const cards = [
    { label: "Receita total", value: formatMoney(s.revenueCents) },
    { label: "Pedidos pagos", value: String(s.paidOrders) },
    { label: "Ticket médio", value: formatMoney(s.averageTicketCents) },
    { label: "Pendentes / recusados", value: `${s.pendingOrders} / ${s.failedOrders}` },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black">Indicadores</h1>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card p-4">
            <dt className="text-sm text-muted">{c.label}</dt>
            <dd className="mt-1 text-2xl font-black">{c.value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="top" className="card p-4">
          <h2 id="top" className="mb-3 text-lg font-extrabold">Jogos mais vendidos</h2>
          {s.topGames.length === 0 ? <p className="text-muted">Ainda sem vendas.</p> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-muted"><th className="pb-2 font-semibold">Jogo</th><th className="pb-2 text-right font-semibold">Vendas</th><th className="pb-2 text-right font-semibold">Receita</th></tr></thead>
              <tbody>
                {s.topGames.map((g) => (
                  <tr key={g.gameId} className="border-t border-line"><td className="py-2">{g.title}</td><td className="py-2 text-right">{g.units}</td><td className="py-2 text-right">{formatMoney(g.revenueCents)}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section aria-labelledby="week" className="card p-4">
          <h2 id="week" className="mb-3 text-lg font-extrabold">Receita dos últimos 7 dias</h2>
          <ul className="space-y-2">
            {s.last7Days.map((d) => (
              <li key={d.day} className="grid grid-cols-[4.5rem_1fr_5.5rem] items-center gap-2 text-sm">
                <span className="text-muted">{d.day.slice(8)}/{d.day.slice(5, 7)}</span>
                <span className="h-3 overflow-hidden rounded-full bg-panel2" aria-hidden="true"><span className="block h-full rounded-full bg-brand" style={{ width: `${(d.revenueCents / max) * 100}%` }} /></span>
                <span className="text-right font-semibold">{formatMoney(d.revenueCents)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
