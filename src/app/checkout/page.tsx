import type { Metadata } from "next";
import { isStaticMode } from "@/lib/static-mode";
import { staticLiteGames } from "@/data/static";
import { LocalCheckout } from "@/components/local/LocalShop";
import { redirect } from "next/navigation";
import { requireUser } from "@/data/auth";
import { getCartGames } from "@/data/user-data";
import { cartTotals } from "@/services/pricing";
import { formatMoney, formatPrice } from "@/lib/format";
import { CheckoutForm } from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Pagamento" };

export default async function CheckoutPage() {
  if (isStaticMode()) return <LocalCheckout all={staticLiteGames()} />;
  await requireUser("/checkout");
  const games = await getCartGames();
  if (!games.length) redirect("/carrinho");
  const totals = cartTotals(games);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Finalizar compra</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_20rem]">
        <CheckoutForm free={totals.total === 0} totalLabel={formatMoney(totals.total)} />
        <aside className="card h-fit space-y-3 p-4" aria-label="Resumo do pedido">
          <h2 className="text-lg font-extrabold">Seu pedido</h2>
          <ul className="space-y-2 text-sm">
            {games.map((g) => (
              <li key={g.id} className="flex justify-between gap-2"><span className="truncate">{g.title}</span><span className="shrink-0">{formatPrice(g.final_price_cents)}</span></li>
            ))}
          </ul>
          {totals.savings > 0 && <p className="text-sm text-ok">Você economiza {formatMoney(totals.savings)}</p>}
          <p className="flex justify-between border-t border-line pt-2 text-lg font-extrabold"><span>Total</span><span>{formatPrice(totals.total)}</span></p>
        </aside>
      </div>
    </div>
  );
}
