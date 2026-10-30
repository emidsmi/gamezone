"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/data/auth";
import { friendlyError } from "@/lib/errors";
import { safeNext } from "@/lib/routes";
import { checkoutSchema, formToObject, reviewSchema, zodState, type ActionState } from "@/lib/validation";
import { placeOrder, settlePendingPayment } from "@/services/checkout";

const back = (formData: FormData) => safeNext(String(formData.get("back") ?? "/"));

async function requireLogin(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect(`/entrar?next=${encodeURIComponent(back(formData))}`);
  return user;
}

export async function addToCart(formData: FormData) {
  const user = await requireLogin(formData);
  const gameId = String(formData.get("gameId") ?? "");
  const supabase = await createClient();

  const { data: owned } = await supabase.from("library_items").select("id").eq("user_id", user.id).eq("game_id", gameId).maybeSingle();
  if (!owned) {
    const { data: cart } = await supabase.from("carts").upsert({ user_id: user.id }, { onConflict: "user_id" }).select("id").single();
    if (cart) await supabase.from("cart_items").upsert({ cart_id: cart.id, game_id: gameId }, { onConflict: "cart_id,game_id", ignoreDuplicates: true });
  }
  revalidatePath("/", "layout");
  if (formData.get("goTo")) redirect(safeNext(String(formData.get("goTo"))));
}

export async function removeFromCart(formData: FormData) {
  const user = await requireLogin(formData);
  const supabase = await createClient();
  const { data: cart } = await supabase.from("carts").select("id").eq("user_id", user.id).maybeSingle();
  if (cart) await supabase.from("cart_items").delete().eq("cart_id", cart.id).eq("game_id", String(formData.get("gameId")));
  revalidatePath("/", "layout");
}

export async function toggleWishlist(formData: FormData) {
  const user = await requireLogin(formData);
  const gameId = String(formData.get("gameId") ?? "");
  const supabase = await createClient();
  const { data: existing } = await supabase.from("wishlists").select("game_id").eq("user_id", user.id).eq("game_id", gameId).maybeSingle();
  if (existing) await supabase.from("wishlists").delete().eq("user_id", user.id).eq("game_id", gameId);
  else await supabase.from("wishlists").insert({ user_id: user.id, game_id: gameId });
  revalidatePath("/", "layout");
}

export async function checkout(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/checkout");

  const parsed = checkoutSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodState(parsed.error);
  const input = parsed.data;

  let orderId: string;
  try {
    const outcome = await placeOrder(await createClient(), createAdminClient(), {
      method: input.method,
      card: input.method === "card" ? { number: input.cardNumber, holder: input.cardName, expiry: input.cardExpiry, cvv: input.cardCvv } : undefined,
    });
    orderId = outcome.orderId;
  } catch (e) {
    return { ok: false, message: friendlyError(e, "Não foi possível finalizar a compra. Nenhum valor foi cobrado.") };
  }
  revalidatePath("/", "layout");
  redirect(`/pedidos/${orderId}?novo=1`);
}

/** Simula o webhook do gateway (PIX pago, boleto compensado, antifraude aprovada ou recusada). */
export async function settlePending(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  const orderId = String(formData.get("orderId") ?? "");
  const outcome = formData.get("outcome") === "declined" ? "declined" : "approved";
  try {
    await settlePendingPayment(await createClient(), createAdminClient(), orderId, outcome);
  } catch {
    // Pedido já resolvido ou inexistente: apenas recarrega a página.
  }
  revalidatePath("/", "layout");
  redirect(`/pedidos/${orderId}`);
}

export async function submitReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  const parsed = reviewSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodState(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .upsert({ user_id: user.id, game_id: parsed.data.gameId, rating: parsed.data.rating, comment: parsed.data.comment }, { onConflict: "user_id,game_id" });
  if (error) {
    const denied = error.message.includes("row-level security");
    return { ok: false, message: denied ? "Somente quem comprou o jogo pode avaliá-lo." : friendlyError(error) };
  }
  revalidatePath("/jogo/[slug]", "page");
  return { ok: true, message: "Avaliação publicada. Obrigado!" };
}
