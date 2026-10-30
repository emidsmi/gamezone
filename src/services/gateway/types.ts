export type GatewayMethod = "card" | "pix" | "boleto" | "free";

export type ChargeRequest = {
  orderId: string;
  paymentId: string;
  amountCents: number;
  method: GatewayMethod;
  card?: { number: string; holder: string; expiry: string; cvv: string };
};

export type ChargeResult = {
  status: "approved" | "declined" | "pending";
  providerRef: string;
  reason?: string;
  /** Instruções exibidas ao cliente em pagamentos pendentes (PIX copia e cola, linha do boleto...). */
  instructions?: string;
};

/**
 * Contrato do gateway de pagamento. Para usar um gateway real (Stripe, Mercado Pago, Pagar.me...),
 * implemente esta interface e registre em services/gateway/index.ts.
 * A liberação do jogo NÃO acontece aqui: o resultado é enviado à RPC confirm_payment.
 */
export interface PaymentGateway {
  readonly name: string;
  charge(request: ChargeRequest): Promise<ChargeResult>;
}
