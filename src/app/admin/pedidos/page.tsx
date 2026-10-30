import type { Metadata } from "next";
import { getAdminOrders } from "@/data/admin";
import { formatDateTime, formatPrice, METHOD_LABEL } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export const metadata: Metadata = { title: "Admin · Pedidos" };

export default async function AdminOrders() {
  const orders = await getAdminOrders();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Pedidos <span className="text-lg font-semibold text-muted">(últimos {orders.length})</span></h1>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[44rem] text-sm">
          <thead><tr className="text-left text-muted"><th className="p-3 font-semibold">Pedido</th><th className="p-3 font-semibold">Cliente</th><th className="p-3 font-semibold">Itens</th><th className="p-3 font-semibold">Pagamento</th><th className="p-3 font-semibold">Status</th><th className="p-3 text-right font-semibold">Total</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-line align-top">
                <td className="p-3"><span className="font-mono">#{o.id.slice(0, 8).toUpperCase()}</span><br /><span className="text-xs text-muted">{formatDateTime(o.created_at)}</span></td>
                <td className="p-3">{(o.profiles as { display_name: string } | null)?.display_name}</td>
                <td className="max-w-56 p-3 text-muted">{o.order_items.map((i) => i.game_title).join(", ")}</td>
                <td className="p-3">{o.payments?.[0] ? METHOD_LABEL[o.payments[0].method] : "—"}</td>
                <td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="p-3 text-right font-semibold">{formatPrice(o.total_cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
