import { createClient } from "@/lib/supabase/server";
import { computeStats } from "@/services/stats";

// Todas as consultas usam o cliente do usuário: as políticas RLS de admin é que liberam a leitura.

export async function getAdminStats() {
  const supabase = await createClient();
  const [orders, items] = await Promise.all([
    supabase.from("orders").select("id, status, total_cents, created_at"),
    supabase.from("order_items").select("order_id, game_id, game_title, unit_price_cents"),
  ]);
  return computeStats(orders.data ?? [], items.data ?? []);
}

export async function getAdminGames() {
  const supabase = await createClient();
  const { data } = await supabase.from("games").select("*, categories(name)").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAdminGame(id: string) {
  const supabase = await createClient();
  const [game, tags, platforms] = await Promise.all([
    supabase.from("games").select("*").eq("id", id).maybeSingle(),
    supabase.from("game_tags").select("tags(name)").eq("game_id", id),
    supabase.from("game_platforms").select("platform_id").eq("game_id", id),
  ]);
  return {
    game: game.data,
    tagNames: (tags.data ?? []).map((t) => (t.tags as { name: string } | null)?.name).filter(Boolean) as string[],
    platformIds: (platforms.data ?? []).map((p) => p.platform_id),
  };
}

export async function getAdminPromotions() {
  const supabase = await createClient();
  const { data } = await supabase.from("promotions").select("*, games(title, slug)").order("ends_at", { ascending: false });
  return data ?? [];
}

export async function getAdminOrders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, status, total_cents, created_at, paid_at, user_id, profiles(display_name), order_items(game_title), payments(status, method)")
    .order("created_at", { ascending: false })
    .limit(200);
  return data ?? [];
}
