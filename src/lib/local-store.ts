"use client";

import { useSyncExternalStore } from "react";

/**
 * Loja local (modo estático): carrinho, desejos, pedidos e biblioteca guardados no localStorage do navegador.
 * Simula o fluxo completo (carrinho -> pagamento -> biblioteca com chave) sem banco de dados.
 * Com Supabase configurado, nada disto é usado: valem as Server Actions e as RPCs do banco.
 */

export type LiteGame = {
  id: string;
  slug: string;
  title: string;
  studio: string;
  category_name: string;
  cover_path: string | null;
  price_cents: number;
  final_price_cents: number;
  discount_percent: number;
};

export type LocalOrderItem = { gameId: string; slug: string; title: string; cover_path: string | null; studio: string; priceCents: number; key: string | null };
export type LocalOrder = {
  id: string;
  createdAt: string;
  method: "card" | "pix" | "boleto" | "free";
  status: "paid" | "pending" | "failed";
  reason?: string;
  totalCents: number;
  items: LocalOrderItem[];
};
type Store = { cart: string[]; wishlist: string[]; orders: LocalOrder[] };

const KEY = "gamezone:local-store:v1";
const EMPTY: Store = { cart: [], wishlist: [], orders: [] };
let cache: { raw: string | null; value: Store } = { raw: null, value: EMPTY };

function read(): Store {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cache.raw) return cache.value;
    const parsed = raw ? ({ ...EMPTY, ...JSON.parse(raw) } as Store) : EMPTY;
    cache = { raw, value: parsed };
    return parsed;
  } catch {
    return cache.value;
  }
}

function write(next: Store) {
  try {
    const raw = JSON.stringify(next);
    window.localStorage.setItem(KEY, raw);
    cache = { raw, value: next };
  } catch {
    cache = { raw: null, value: next };
  }
  window.dispatchEvent(new Event("gamezone:store"));
}

function subscribe(cb: () => void) {
  window.addEventListener("gamezone:store", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("gamezone:store", cb);
    window.removeEventListener("storage", cb);
  };
}

/** Lê a loja local (e re-renderiza quando muda). No servidor devolve vazio. */
export function useLocalStore(): Store {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export const ownedIds = (s: Store) => new Set(s.orders.filter((o) => o.status === "paid").flatMap((o) => o.items.map((i) => i.gameId)));

export function addToLocalCart(id: string) {
  const s = read();
  if (s.cart.includes(id) || ownedIds(s).has(id)) return;
  write({ ...s, cart: [...s.cart, id] });
}
export function removeFromLocalCart(id: string) {
  const s = read();
  write({ ...s, cart: s.cart.filter((x) => x !== id) });
}
export function toggleLocalWishlist(id: string) {
  const s = read();
  write({ ...s, wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] });
}

function newKey() {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  return [0, 5, 10, 15].map((i) => hex.slice(i, i + 5)).join("-");
}

export type PayInput = { method: "card" | "pix" | "boleto"; cardNumber?: string };
export type PayResult = { orderId: string; status: "paid" | "pending" | "failed"; reason?: string };

/** Gateway simulado: 4242… aprova, 4000 0000 0000 0002 recusa, 4000 0000 0000 0003 deixa pendente; PIX aprova; boleto fica pendente. */
export function payLocalCart(games: LiteGame[], input: PayInput): PayResult {
  const s = read();
  const total = games.reduce((a, g) => a + g.final_price_cents, 0);
  const method = total === 0 ? "free" : input.method;
  const digits = (input.cardNumber ?? "").replace(/\D/g, "");
  let status: LocalOrder["status"] = "paid";
  let reason: string | undefined;
  if (method === "card") {
    if (digits === "4000000000000002") { status = "failed"; reason = "Cartão recusado pelo emissor."; }
    else if (digits === "4000000000000003") status = "pending";
  } else if (method === "boleto") status = "pending";

  const order: LocalOrder = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    method,
    status,
    reason,
    totalCents: total,
    items: games.map((g) => ({ gameId: g.id, slug: g.slug, title: g.title, cover_path: g.cover_path, studio: g.studio, priceCents: g.final_price_cents, key: status === "paid" ? newKey() : null })),
  };
  write({ ...s, orders: [order, ...s.orders], cart: status === "failed" ? s.cart : s.cart.filter((id) => !games.some((g) => g.id === id)) });
  return { orderId: order.id, status, reason };
}

/** Simula o webhook do gateway para pedidos pendentes. */
export function settleLocalOrder(orderId: string, outcome: "paid" | "failed") {
  const s = read();
  write({
    ...s,
    orders: s.orders.map((o) =>
      o.id !== orderId || o.status !== "pending"
        ? o
        : { ...o, status: outcome, reason: outcome === "failed" ? "Pagamento não confirmado pelo gateway." : undefined, items: o.items.map((i) => ({ ...i, key: outcome === "paid" ? newKey() : null })) },
    ),
  });
}
