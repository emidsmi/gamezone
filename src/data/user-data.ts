import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/data/auth";
import { isStaticMode } from "@/lib/static-mode";
import type { CatalogGame } from "@/data/games";

export type UserFlags = { loggedIn: boolean; owned: string[]; wishlist: string[]; cart: string[] };

/** Quais jogos o usuário já possui, deseja ou colocou no carrinho (usado nos cards). */
export const getUserFlags = cache(async (): Promise<UserFlags> => {
  if (isStaticMode()) return { loggedIn: false, owned: [], wishlist: [], cart: [] };
  const user = await getCurrentUser();
  if (!user) return { loggedIn: false, owned: [], wishlist: [], cart: [] };
  const supabase = await createClient();
  const [lib, wish, cart] = await Promise.all([
    supabase.from("library_items").select("game_id").eq("user_id", user.id),
    supabase.from("wishlists").select("game_id").eq("user_id", user.id),
    supabase.from("cart_items").select("game_id, carts!inner(user_id)").eq("carts.user_id", user.id),
  ]);
  return {
    loggedIn: true,
    owned: (lib.data ?? []).map((r) => r.game_id),
    wishlist: (wish.data ?? []).map((r) => r.game_id),
    cart: (cart.data ?? []).map((r) => r.game_id),
  };
});

export async function getCartGames(): Promise<CatalogGame[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data: items } = await supabase.from("cart_items").select("game_id, added_at, carts!inner(user_id)").eq("carts.user_id", user.id).order("added_at");
  const ids = (items ?? []).map((i) => i.game_id);
  if (!ids.length) return [];
  const { data: games } = await supabase.from("catalog_games").select("*").in("id", ids);
  const byId = new Map((games ?? []).map((g) => [g.id, g]));
  return ids.map((id) => byId.get(id)).filter((g): g is CatalogGame => Boolean(g));
}

export async function getWishlistGames(): Promise<CatalogGame[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data: rows } = await supabase.from("wishlists").select("game_id").eq("user_id", user.id).order("added_at", { ascending: false });
  const ids = (rows ?? []).map((r) => r.game_id);
  if (!ids.length) return [];
  const { data: games } = await supabase.from("catalog_games").select("*").in("id", ids);
  const byId = new Map((games ?? []).map((g) => [g.id, g]));
  return ids.map((id) => byId.get(id)).filter((g): g is CatalogGame => Boolean(g));
}

export async function getLibrary() {
  const user = await getCurrentUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("library_items")
    .select("id, acquired_at, order_id, game_id, games(slug, title, cover_path, studio, publisher), activation_keys(key)")
    .eq("user_id", user.id)
    .order("acquired_at", { ascending: false });
  return data ?? [];
}

export async function getOrders() {
  const user = await getCurrentUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, status, total_cents, created_at, paid_at, order_items(game_title, unit_price_cents), payments(status, method)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getOrder(id: string) {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, status, total_cents, created_at, paid_at, order_items(id, game_id, game_title, unit_price_cents, discount_percent), payments(id, status, method, failure_reason, provider_ref, created_at)")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  return data;
}

export async function getMyReview(gameId: string) {
  if (isStaticMode()) return null;
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("reviews").select("*").eq("game_id", gameId).eq("user_id", user.id).maybeSingle();
  return data;
}
