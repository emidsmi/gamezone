"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { formatDate, formatDateTime, formatMoney, formatPrice, METHOD_LABEL, ORDER_STATUS_LABEL } from "@/lib/format";
import { addToLocalCart, ownedIds, payLocalCart, removeFromLocalCart, settleLocalOrder, toggleLocalWishlist, useLocalStore, type LiteGame } from "@/lib/local-store";
import { mediaUrl } from "@/lib/media";
import { KeyReveal } from "@/components/KeyReveal";
import { PriceTag } from "@/components/PriceTag";

/* ---------- botões ---------- */

/** COMPRAR (modo local): põe no carrinho e vai para o carrinho; se já é dono, leva à biblioteca. */
export function LocalBuyButton({ game, className = "btn btn-primary", label, goTo = "/carrinho" }: { game: LiteGame; className?: string; label?: string; goTo?: string }) {
  const router = useRouter();
  const store = useLocalStore();
  const owned = ownedIds(store).has(game.id);
  const text = label ?? (game.final_price_cents === 0 ? "OBTER GRÁTIS" : "COMPRAR");
  if (owned) return <Link href="/biblioteca" className={className}>Na sua biblioteca</Link>;
  return (
    <button type="button" className={className} onClick={() => { addToLocalCart(game.id); router.push(goTo); }}>
      {text}
    </button>
  );
}

export function LocalCartButton({ game, className = "btn btn-ghost w-full" }: { game: LiteGame; className?: string }) {
  const store = useLocalStore();
  if (ownedIds(store).has(game.id)) return null;
  const inCart = store.cart.includes(game.id);
  return inCart ? (
    <Link href="/carrinho" className={className}>Ver carrinho</Link>
  ) : (
    <button type="button" className={className} onClick={() => addToLocalCart(game.id)}>Adicionar ao carrinho</button>
  );
}

export function LocalWishButton({ gameId, className = "btn btn-ghost w-full", compact = false }: { gameId: string; className?: string; compact?: boolean }) {
  const store = useLocalStore();
  const wished = store.wishlist.includes(gameId);
  return (
    <button type="button" className={className} aria-pressed={wished} aria-label={compact ? (wished ? "Remover dos desejos" : "Adicionar aos desejos") : undefined} onClick={() => toggleLocalWishlist(gameId)}>
      {compact ? <span aria-hidden="true">{wished ? "♥" : "♡"}</span> : wished ? "♥ Na lista de desejos" : "♡ Adicionar à lista de desejos"}
    </button>
  );
}

/** Ícones de desejos e carrinho do cabeçalho, com contador. */
export function LocalHeaderCounts() {
  const store = useLocalStore();
  const cart = store.cart.length;
  const wish = store.wishlist.length;
  return (
    <>
      <Link href="/desejos" className="relative rounded-lg px-2.5 py-2 hover:bg-panel2" aria-label={`Lista de desejos${wish ? `, ${wish} itens` : ""}`}>
        <span aria-hidden="true">♡</span>
      </Link>
      <Link href="/carrinho" className="relative rounded-lg px-2.5 py-2 hover:bg-panel2" aria-label={`Carrinho${cart ? `, ${cart} itens` : ", vazio"}`}>
        <span aria-hidden="true">🛒</span>
        {cart > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-xs font-extrabold text-black" aria-hidden="true">{cart}</span>}
      </Link>
      <details className="relative">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold hover:bg-panel2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-brand text-sm font-black text-black" aria-hidden="true">J</span>
          <span className="hidden sm:inline">Jogador</span>
        </summary>
        <div className="card absolute right-0 z-50 mt-2 w-52 p-2 shadow-2xl">
          <Link className="block rounded-lg px-3 py-2 text-sm hover:bg-panel2" href="/biblioteca">Minha biblioteca</Link>
          <Link className="block rounded-lg px-3 py-2 text-sm hover:bg-panel2" href="/pedidos">Meus pedidos</Link>
          <Link className="block rounded-lg px-3 py-2 text-sm hover:bg-panel2" href="/desejos">Lista de desejos</Link>
        </div>
      </details>
    </>
  );
}

const Empty = ({ title, hint, cta = "Ver catálogo", href = "/catalogo" }: { title: string; hint: string; cta?: string; href?: string }) => (
  <div className="card mt-6 p-10 text-center">
    <p className="text-lg font-bold">{title}</p>
    <p className="mt-1 text-muted">{hint}</p>
    <Link href={href} className="btn btn-primary mt-4">{cta}</Link>
  </div>
);

const useCartGames = (all: LiteGame[]) => {
  const store = useLocalStore();
  return useMemo(() => store.cart.map((id) => all.find((g) => g.id === id)).filter(Boolean) as LiteGame[], [store.cart, all]);
};
const totalsOf = (games: LiteGame[]) => {
  const subtotal = games.reduce((a, g) => a + g.price_cents, 0);
  const total = games.reduce((a, g) => a + g.final_price_cents, 0);
  return { subtotal, total, savings: subtotal - total, count: games.length };
};

/* ---------- carrinho ---------- */
export function LocalCart({ all }: { all: LiteGame[] }) {
  const games = useCartGames(all);
  const t = totalsOf(games);
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Carrinho</h1>
      {games.length === 0 ? (
        <Empty title="Seu carrinho está vazio" hint="Explore o catálogo e encontre seu próximo jogo." />
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
                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeFromLocalCart(g.id)} aria-label={`Remover ${g.title} do carrinho`}>Remover</button>
              </li>
            ))}
          </ul>
          <aside className="card h-fit space-y-3 p-4" aria-label="Resumo do pedido">
            <h2 className="text-lg font-extrabold">Resumo</h2>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-muted">Subtotal ({t.count})</dt><dd>{formatMoney(t.subtotal)}</dd></div>
              {t.savings > 0 && <div className="flex justify-between text-ok"><dt>Descontos</dt><dd>-{formatMoney(t.savings)}</dd></div>}
              <div className="flex justify-between border-t border-line pt-2 text-lg font-extrabold"><dt>Total</dt><dd>{formatPrice(t.total)}</dd></div>
            </dl>
            <Link href="/checkout" className="btn btn-primary w-full">Ir para o pagamento</Link>
          </aside>
        </div>
      )}
    </div>
  );
}

/* ---------- pagamento ---------- */
const METHODS = [
  { value: "card", label: "Cartão de crédito" },
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
] as const;

export function LocalCheckout({ all }: { all: LiteGame[] }) {
  const router = useRouter();
  const games = useCartGames(all);
  const t = totalsOf(games);
  const free = t.total === 0;
  const [method, setMethod] = useState<"card" | "pix" | "boleto">("card");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (games.length === 0 && !busy) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-black">Finalizar compra</h1>
        <Empty title="Não há itens para pagar" hint="Adicione um jogo ao carrinho primeiro." />
      </div>
    );
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const cardNumber = String(data.get("cardNumber") ?? "");
    if (!free && method === "card" && cardNumber.replace(/\D/g, "").length < 13) {
      setError("Informe um número de cartão válido (ex.: 4242 4242 4242 4242).");
      return;
    }
    setError(null);
    setBusy(true);
    // pequena espera para parecer um gateway de verdade
    setTimeout(() => {
      const res = payLocalCart(games, { method, cardNumber });
      if (res.status === "failed") {
        setBusy(false);
        setError(res.reason ?? "Pagamento recusado.");
        router.push(`/pedidos/${res.orderId}`);
        return;
      }
      router.push(`/pedidos/${res.orderId}`);
    }, 900);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Finalizar compra</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_20rem]">
        <form onSubmit={submit} className="card space-y-4 p-4">
          {free ? (
            <p className="text-sm text-muted">Este pedido é gratuito: nenhum pagamento é necessário. Confirme para adicionar à biblioteca.</p>
          ) : (
            <>
              <fieldset>
                <legend className="mb-2 font-bold">Forma de pagamento</legend>
                <div className="flex flex-wrap gap-2">
                  {METHODS.map((m) => (
                    <label key={m.value} className={`cursor-pointer rounded-lg border px-4 py-2 text-sm font-semibold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-gold ${method === m.value ? "border-brand bg-brand/10" : "border-line"}`}>
                      <input type="radio" name="method" value={m.value} checked={method === m.value} onChange={() => setMethod(m.value)} className="sr-only" />
                      {m.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              {method === "card" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="cardName" className="mb-1 block text-sm font-semibold">Nome no cartão</label>
                    <input id="cardName" name="cardName" required autoComplete="cc-name" className="input" defaultValue="JOGADOR DEMO" />
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="cardNumber" className="mb-1 block text-sm font-semibold">Número do cartão</label>
                    <input id="cardNumber" name="cardNumber" required inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" defaultValue="4242 4242 4242 4242" className="input" />
                    <p className="mt-1 text-xs text-muted">Teste: 4242… aprova · 4000 0000 0000 0002 recusa · 4000 0000 0000 0003 pendente</p>
                  </div>
                  <div>
                    <label htmlFor="cardExpiry" className="mb-1 block text-sm font-semibold">Validade (MM/AA)</label>
                    <input id="cardExpiry" name="cardExpiry" required maxLength={5} placeholder="12/30" defaultValue="12/30" autoComplete="cc-exp" className="input" />
                  </div>
                  <div>
                    <label htmlFor="cardCvv" className="mb-1 block text-sm font-semibold">CVV</label>
                    <input id="cardCvv" name="cardCvv" required inputMode="numeric" maxLength={4} placeholder="123" defaultValue="123" autoComplete="cc-csc" className="input" />
                  </div>
                </div>
              )}
              {method === "pix" && <p className="rounded-lg bg-panel2 p-3 text-sm">Geraremos um código PIX copia e cola. Neste ambiente de demonstração o pagamento é aprovado na hora.</p>}
              {method === "boleto" && <p className="rounded-lg bg-panel2 p-3 text-sm">O boleto fica pendente até a compensação. Na tela do pedido você pode simular a confirmação.</p>}
            </>
          )}
          {error && <p role="alert" className="rounded-lg border border-danger/50 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
          <button type="submit" disabled={busy} aria-busy={busy} className="btn btn-primary w-full py-3">
            {busy ? "Processando pagamento…" : free ? "Adicionar à biblioteca" : `Pagar ${formatMoney(t.total)}`}
          </button>
          <p className="text-center text-xs text-muted">Ambiente de demonstração: pagamento simulado, nenhum valor real é cobrado.</p>
        </form>
        <aside className="card h-fit space-y-3 p-4" aria-label="Resumo do pedido">
          <h2 className="text-lg font-extrabold">Seu pedido</h2>
          <ul className="space-y-2 text-sm">
            {games.map((g) => (
              <li key={g.id} className="flex justify-between gap-2"><span className="truncate">{g.title}</span><span className="shrink-0">{formatPrice(g.final_price_cents)}</span></li>
            ))}
          </ul>
          {t.savings > 0 && <p className="text-sm text-ok">Você economiza {formatMoney(t.savings)}</p>}
          <p className="flex justify-between border-t border-line pt-2 text-lg font-extrabold"><span>Total</span><span>{formatPrice(t.total)}</span></p>
        </aside>
      </div>
    </div>
  );
}

/* ---------- pedidos ---------- */
const STATUS_STYLE: Record<string, string> = { paid: "border-ok/50 bg-ok/10 text-ok", pending: "border-gold/50 bg-gold/10 text-gold", failed: "border-danger/50 bg-danger/10 text-danger" };
const Badge = ({ status }: { status: string }) => <span className={`rounded-full border px-3 py-1 text-xs font-bold ${STATUS_STYLE[status]}`}>{ORDER_STATUS_LABEL[status === "paid" ? "paid" : status === "pending" ? "pending" : "failed"]}</span>;

export function LocalOrders() {
  const { orders } = useLocalStore();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Meus pedidos</h1>
      {orders.length === 0 ? (
        <Empty title="Você ainda não fez nenhum pedido." hint="Quando comprar um jogo, o pedido aparece aqui." cta="Explorar jogos" />
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link href={`/pedidos/${o.id}`} className="card block p-4 transition hover:border-brand">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold">Pedido #{o.id.slice(0, 8).toUpperCase()}</p>
                  <Badge status={o.status} />
                </div>
                <p className="mt-1 truncate text-sm text-muted">{o.items.map((i) => i.title).join(", ")}</p>
                <p className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
                  <span className="text-muted">{formatDateTime(o.createdAt)} · {METHOD_LABEL[o.method]}</span>
                  <span className="font-extrabold">{formatPrice(o.totalCents)}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function LocalOrderDetail({ id }: { id: string }) {
  const { orders } = useLocalStore();
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-black">Pedido não encontrado</h1>
        <Empty title="Não achamos este pedido neste navegador." hint="Os pedidos da demonstração ficam salvos só no navegador em que foram feitos." cta="Meus pedidos" href="/pedidos" />
      </div>
    );
  }
  const msg =
    order.status === "paid" ? { t: "Pagamento aprovado", d: "Seus jogos já estão na biblioteca, com a chave de ativação." }
    : order.status === "pending" ? { t: "Aguardando confirmação do pagamento", d: "Assim que o gateway confirmar, os jogos são liberados." }
    : { t: "Pagamento recusado", d: order.reason ?? "Tente outro cartão." };
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Pedido #{order.id.slice(0, 8).toUpperCase()}</h1>
      <div className={`mt-4 rounded-xl border p-4 ${STATUS_STYLE[order.status]}`} role="status">
        <p className="text-lg font-extrabold">{msg.t}</p>
        <p className="text-sm">{msg.d}</p>
      </div>
      <p className="mt-3 text-sm text-muted">{formatDateTime(order.createdAt)} · {METHOD_LABEL[order.method]}</p>
      <ul className="card mt-4 divide-y divide-line">
        {order.items.map((i) => (
          <li key={i.gameId} className="flex items-center gap-3 p-3">
            <img src={mediaUrl(i.cover_path)} alt="" className="h-16 w-12 rounded object-cover" />
            <Link href={`/jogo/${i.slug}`} className="min-w-0 flex-1 truncate font-bold hover:text-brand">{i.title}</Link>
            <span className="font-semibold">{formatPrice(i.priceCents)}</span>
          </li>
        ))}
        <li className="flex justify-between p-3 text-lg font-extrabold"><span>Total</span><span>{formatPrice(order.totalCents)}</span></li>
      </ul>
      <div className="mt-5 flex flex-wrap gap-2">
        {order.status === "pending" && (
          <>
            <button className="btn btn-primary" onClick={() => settleLocalOrder(order.id, "paid")}>Simular pagamento confirmado</button>
            <button className="btn btn-danger" onClick={() => settleLocalOrder(order.id, "failed")}>Simular pagamento negado</button>
          </>
        )}
        {order.status === "paid" && <Link href="/biblioteca" className="btn btn-primary">Ir para a biblioteca</Link>}
        {order.status === "failed" && <Link href="/checkout" className="btn btn-primary">Tentar de novo</Link>}
        <Link href="/pedidos" className="btn btn-ghost">Todos os pedidos</Link>
      </div>
    </div>
  );
}

/* ---------- biblioteca ---------- */
function downloadFile(title: string, slug: string, key: string) {
  const text = `${title}\nArquivo de instalação simulado (projeto acadêmico GameZone Brasil).\nChave de ativação: ${key}\n`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${slug}-instalador.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function LocalLibrary() {
  const { orders } = useLocalStore();
  const items = orders.filter((o) => o.status === "paid").flatMap((o) => o.items.map((i) => ({ ...i, at: o.createdAt })));
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Minha biblioteca</h1>
      <p className="mt-1 text-muted">{items.length} {items.length === 1 ? "jogo" : "jogos"}</p>
      {items.length === 0 ? (
        <Empty title="Sua biblioteca está vazia." hint="Os jogos aparecem aqui assim que o pagamento é confirmado." cta="Explorar jogos" />
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((it) => (
            <li key={it.gameId} className="card flex flex-col gap-4 p-3 sm:flex-row sm:items-center" data-testid="library-item">
              <img src={mediaUrl(it.cover_path)} alt={`Capa de ${it.title}`} className="h-32 w-24 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1 space-y-2">
                <Link href={`/jogo/${it.slug}`} className="block text-lg font-extrabold hover:text-brand">{it.title}</Link>
                <p className="text-sm text-muted">{it.studio} · adquirido em {formatDate(it.at)}</p>
                {it.key && <KeyReveal value={it.key} />}
              </div>
              {it.key && <button type="button" className="btn btn-primary sm:self-center" onClick={() => downloadFile(it.title, it.slug, it.key!)}>Baixar</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- desejos ---------- */
export function LocalWishlist({ all }: { all: LiteGame[] }) {
  const store = useLocalStore();
  const games = store.wishlist.map((id) => all.find((g) => g.id === id)).filter(Boolean) as LiteGame[];
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black">Lista de desejos</h1>
      {games.length === 0 ? (
        <Empty title="Sua lista está vazia" hint="Toque no coração de um jogo para guardá-lo aqui." />
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {games.map((g) => (
            <li key={g.id} className="card flex items-center gap-4 p-3">
              <img src={mediaUrl(g.cover_path)} alt={`Capa de ${g.title}`} className="h-24 w-[4.5rem] shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <Link href={`/jogo/${g.slug}`} className="block truncate font-bold hover:text-brand">{g.title}</Link>
                <div className="mt-1"><PriceTag game={g} /></div>
                <div className="mt-2 flex gap-2">
                  <LocalBuyButton game={g} className="btn btn-primary btn-sm" />
                  <LocalWishButton gameId={g.id} className="btn btn-ghost btn-sm" compact />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
