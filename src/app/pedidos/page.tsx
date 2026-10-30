import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/data/auth";
import { getOrders } from "@/data/user-data";
import { formatDateTime, formatPrice, METHOD_LABEL } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export const metadata: Metadata = { title: "Meus pedidos" };

export default async function OrdersPage() {
  await requireUser("/pedidos");
  const orders = await getOrders();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Meus pedidos</h1>
      {orders.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="font-bold">Você ainda não fez nenhum pedido.</p>
          <Link href="/catalogo" className="btn btn-primary mt-4">Explorar jogos</Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => {
            const pay = o.payments?.[0];
            return (
              <li key={o.id}>
                <Link href={`/pedidos/${o.id}`} className="card block p-4 transition hover:border-brand">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold">Pedido #{o.id.slice(0, 8).toUpperCase()}</p>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-1 truncate text-sm text-muted">{o.order_items.map((i) => i.game_title).join(", ")}</p>
                  <p className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
                    <span className="text-muted">{formatDateTime(o.created_at)}{pay ? ` · ${METHOD_LABEL[pay.method]}` : ""}</span>
                    <span className="font-extrabold">{formatPrice(o.total_cents)}</span>
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
