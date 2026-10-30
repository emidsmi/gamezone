import type { ChargeRequest, ChargeResult, PaymentGateway } from "./types";

/**
 * Gateway simulado. Regras (pelo final do cartão):
 *  - termina em 0002 -> recusado (cartão recusado pelo emissor)
 *  - termina em 0051 -> recusado (saldo insuficiente)
 *  - termina em 0003 -> pendente (análise antifraude)
 *  - qualquer outro  -> aprovado
 * PIX e boleto ficam pendentes até a confirmação simulada. Pedidos gratuitos são aprovados.
 */
export class MockGateway implements PaymentGateway {
  readonly name = "mock";

  async charge(req: ChargeRequest): Promise<ChargeResult> {
    const providerRef = `mock_${req.paymentId.replace(/-/g, "").slice(0, 12)}`;

    if (req.method === "free" || req.amountCents === 0) return { status: "approved", providerRef };

    if (req.method === "pix") {
      return { status: "pending", providerRef, instructions: `00020126GAMEZONEBR${providerRef.toUpperCase()}5204000053039865802BR` };
    }
    if (req.method === "boleto") {
      return { status: "pending", providerRef, instructions: `34191.79001 01043.510047 91020.150008 5 ${String(req.amountCents).padStart(14, "0")}` };
    }

    const number = (req.card?.number ?? "").replace(/\D/g, "");
    if (number.endsWith("0002")) return { status: "declined", providerRef, reason: "Cartão recusado pelo emissor." };
    if (number.endsWith("0051")) return { status: "declined", providerRef, reason: "Saldo insuficiente." };
    if (number.endsWith("0003")) return { status: "pending", providerRef, reason: "Pagamento em análise antifraude." };
    return { status: "approved", providerRef };
  }
}
