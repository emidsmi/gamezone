import type { Metadata } from "next";
import { isStaticMode } from "@/lib/static-mode";
import { LocalOrderDetail } from "@/components/local/LocalShop";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/data/auth";
import { getOrder } from "@/data/user-data";
import { settlePending } from "@/actions/shop";
import { formatDateTime, formatPrice, METHOD_LABEL } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";

export const metadata: Metadata = { title: "Pedido" };

export default async function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ novo?: string }> }) {
  if (isStaticMode()) return <LocalOrderDetail id={(await params).id} />;
  const { id } = await params;
  const { novo } = await searchParams;
  await requireUser(`/pedidos/${id}`);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const order = await getOrder(id);
  if (!order) notFound();
  const pay = order.payments?.[0];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/pedidos" className="text-sm text-muted hover:text-fg">← Meus pedidos</Link>
      <h1 className="mt-2 text-3xl font-black">Pedido #{order.id.slice(0, 8).toUpperCase()}</h1>

      {novo && order.status === "paid" && (
        <div role="status" className="mt-4 rounded-xl border border-ok/50 bg-ok/10 p-4">
          <p className="font-bold text-ok">Pagamento aprovado! 🎉</p>
          <p className="text-sm">Seus jogos já estão na biblioteca, com a chave de ativação.</p>
          <Link href="/biblioteca" className="btn btn-primary mt-3">Ir para a biblioteca</Link>
        </div>
      )}
      {order.status === "pending" && (
        <div role="status" className="mt-4 space-y-3 rounded-xl border border-gold/50 bg-gold/10 p-4">
          <p className="font-bold text-gold">Aguardando confirmação do pagamento</p>
          <p className="text-sm">O jogo será liberado automaticamente assim que o pagamento for aprovado.</p>
          {pay?.provider_ref && pay.method !== "card" && <p className="break-all rounded bg-black/30 p-2 font-mono text-xs">Código de pagamento: {pay.provider_ref}</p>}
          <form action={settlePending} className="flex flex-wrap gap-2">
            <input type="hidden" name="orderId" value={order.id} />
            <button name="outcome" value="approved" className="btn btn-primary btn-sm">Simular pagamento aprovado</button>
            <button name="outcome" value="declined" className="btn btn-danger btn-sm">Simular pagamento recusado</button>
          </form>
          <p className="text-xs text-muted">Botões de demonstração: simulam o aviso (webhook) que o gateway enviaria.</p>
        </div>
      )}
      {order.status === "failed" && (
        <div role="alert" className="mt-4 rounded-xl border border-danger/50 bg-danger/10 p-4">
          <p className="font-bold text-danger">Pagamento recusado</p>
          <p className="text-sm">{pay?.failure_reason ?? "Não foi possível processar o pagamento."} Nenhum jogo foi liberado e nada foi cobrado.</p>
          <Link href="/carrinho" className="btn btn-ghost mt-3">Tentar novamente</Link>
        </div>
      )}

      <dl className="card mt-6 grid gap-3 p-4 text-sm sm:grid-cols-2">
        <div><dt className="text-muted">Status do pedido</dt><dd className="mt-1"><StatusBadge status={order.status} /></dd></div>
        <div><dt className="text-muted">Status do pagamento</dt><dd className="mt-1">{pay ? <StatusBadge status={pay.status} kind="payment" /> : "—"}</dd></div>
        <div><dt className="text-muted">Forma de pagamento</dt><dd className="mt-1 font-semibold">{pay ? METHOD_LABEL[pay.method] : "—"}</dd></div>
        <div><dt className="text-muted">Criado em</dt><dd className="mt-1 font-semibold">{formatDateTime(order.created_at)}</dd></div>
        {order.paid_at && <div><dt className="text-muted">Pago em</dt><dd className="mt-1 font-semibold">{formatDateTime(order.paid_at)}</dd></div>}
      </dl>

      <h2 className="mb-2 mt-6 text-xl font-extrabold">Itens</h2>
      <ul className="card divide-y divide-line">
        {order.order_items.map((i) => (
          <li key={i.id} className="flex items-center justify-between gap-2 p-3">
            <span>{i.game_title}{i.discount_percent > 0 && <span className="ml-2 text-xs text-ok">-{i.discount_percent}%</span>}</span>
            <span className="font-semibold">{formatPrice(i.unit_price_cents)}</span>
          </li>
        ))}
        <li className="flex justify-between p-3 text-lg font-extrabold"><span>Total</span><span>{formatPrice(order.total_cents)}</span></li>
      </ul>
    </div>
  );
}
