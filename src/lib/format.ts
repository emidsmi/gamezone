const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export const formatPrice = (cents: number) => (cents === 0 ? "Grátis" : brl.format(cents / 100));
export const formatMoney = (cents: number) => brl.format(cents / 100);

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "America/Sao_Paulo" }).format(new Date(iso));

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(iso));

export const ageLabel = (age: number) => (age === 0 ? "Livre" : `${age}+`);

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  failed: "Pagamento recusado",
  cancelled: "Cancelado",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "Pendente",
  approved: "Aprovado",
  declined: "Recusado",
  cancelled: "Cancelado",
};

export const METHOD_LABEL: Record<string, string> = {
  card: "Cartão de crédito",
  pix: "PIX",
  boleto: "Boleto",
  free: "Gratuito",
};
