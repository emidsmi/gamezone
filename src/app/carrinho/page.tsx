import type { Metadata } from "next";
import Link from "next/link";
import { getCartGames } from "@/data/user-data";
import { removeFromCart } from "@/actions/shop";
import { cartTotals } from "@/services/pricing";
import { formatMoney, formatPrice } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { PriceTag } from "@/components/PriceTag";

export const metadata: Metadata = { title: "Carrinho" };

export default async function CartPage() {
  const games = await getCartGames();
  const totals = cartTotals(games);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Carrinho</h1>
      {games.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="text-lg font-bold">Seu carrinho está vazio</p>
          <p className="mt-1 text-muted">Explore o catálogo e encontre seu próximo jogo.</p>
          <Link href="/catalogo" className="btn btn-primary mt-4">Ver catálogo</Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_20rem]">
          <ul className="space-y-3" aria-label="Itens do carrinho">
            {games.map((g) => (
              <li key={g.id} className="card flex items-center gap-4 p-3">
                <img src={mediaUrl(g.cover_path)} alt={`Capa de ${g.title}`} className="h-24 w-[4.5rem] shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <Link href={`/jogo/${g.slug}`} className="block truncate font-bold hover:text-brand">{g.title}</Link>
                  <p className="text-sm text-muted">{g.category_name} · {g.studio}</p>
                  <div className="mt-1"><PriceTag game={g} /></div>
                </div>
                <form action={removeFromCart}>
                  <input type="hidden" name="gameId" value={g.id} />
                  <input type="hidden" name="back" value="/carrinho" />
                  <button className="btn btn-danger btn-sm" aria-label={`Remover ${g.title} do carrinho`}>Remover</button>
                </form>
              </li>
            ))}
          </ul>

          <aside className="card h-fit space-y-3 p-4" aria-label="Resumo do pedido">
            <h2 className="text-lg font-extrabold">Resumo</h2>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal ({totals.count})</dt><dd>{formatMoney(totals.subtotal)}</dd></div>
              {totals.savings > 0 && <div className="flex justify-between text-ok"><dt>Descontos</dt><dd>-{formatMoney(totals.savings)}</dd></div>}
              <div className="flex justify-between border-t border-line pt-2 text-lg font-extrabold"><dt>Total</dt><dd>{formatPrice(totals.total)}</dd></div>
            </dl>
            <Link href="/checkout" className="btn btn-primary w-full">Ir para o pagamento</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
