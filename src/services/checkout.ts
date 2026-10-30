import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getGateway, type ChargeRequest, type PaymentGateway } from "@/services/gateway";

type Db = SupabaseClient<Database>;

export type CheckoutInput = {
  method: "card" | "pix" | "boleto";
  card?: ChargeRequest["card"];
};

export type CheckoutOutcome = {
  orderId: string;
  status: "approved" | "declined" | "pending";
  reason?: string;
  instructions?: string;
};

type OrderRpc = { order_id: string; payment_id: string; total_cents: number; method: ChargeRequest["method"] };

/**
 * Fluxo de compra:
 *  1. (usuário, RLS) RPC create_order_from_cart -> pedido + pagamento pendentes, com preços calculados no banco;
 *  2. gateway cobra;
 *  3. (service role) RPC confirm_payment -> única forma de liberar jogo/chave.
 * `userDb` é o cliente do usuário; `adminDb` é o service role e só existe no servidor.
 */
export async function placeOrder(userDb: Db, adminDb: Db, input: CheckoutInput, gateway: PaymentGateway = getGateway()): Promise<CheckoutOutcome> {
  const { data, error } = await userDb.rpc("create_order_from_cart", { p_method: input.method });
  if (error) throw error;
  const order = data as unknown as OrderRpc;

  const result = await gateway.charge({
    orderId: order.order_id,
    paymentId: order.payment_id,
    amountCents: order.total_cents,
    method: order.method,
    card: input.card,
  });

  const { error: confirmError } = await adminDb.rpc("confirm_payment", {
    p_payment_id: order.payment_id,
    p_status: result.status,
    p_provider_ref: result.providerRef,
    p_reason: result.reason,
  });
  if (confirmError) throw confirmError;

  return { orderId: order.order_id, status: result.status, reason: result.reason, instructions: result.instructions };
}

/** Simula o webhook do gateway para pagamentos pendentes (PIX/boleto/antifraude). */
export async function settlePendingPayment(userDb: Db, adminDb: Db, orderId: string, outcome: "approved" | "declined") {
  // O select usa o cliente do usuário: a RLS garante que só o dono (ou admin) enxerga o pagamento.
  const { data: payment, error } = await userDb
    .from("payments")
    .select("id, status, order_id")
    .eq("order_id", orderId)
    .eq("status", "pending")
    .maybeSingle();
  if (error) throw error;
  if (!payment) throw new Error("order_not_pending");

  const { error: confirmError } = await adminDb.rpc("confirm_payment", {
    p_payment_id: payment.id,
    p_status: outcome,
    p_provider_ref: `mock_webhook_${payment.id.slice(0, 8)}`,
    p_reason: outcome === "declined" ? "Pagamento não confirmado pelo gateway." : undefined,
  });
  if (confirmError) throw confirmError;
}
