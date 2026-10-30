import { MockGateway } from "./mock";
import type { PaymentGateway } from "./types";

export type { ChargeRequest, ChargeResult, GatewayMethod, PaymentGateway } from "./types";

/** Troque aqui (ou via PAYMENT_PROVIDER) pelo gateway real quando for para produção. */
export function getGateway(): PaymentGateway {
  switch (process.env.PAYMENT_PROVIDER ?? "mock") {
    case "mock":
    default:
      return new MockGateway();
  }
}
