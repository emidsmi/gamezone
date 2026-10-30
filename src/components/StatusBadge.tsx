import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/lib/format";

const TONE: Record<string, string> = {
  paid: "bg-ok/15 text-ok border-ok/40",
  approved: "bg-ok/15 text-ok border-ok/40",
  pending: "bg-gold/15 text-gold border-gold/40",
  failed: "bg-danger/15 text-danger border-danger/40",
  declined: "bg-danger/15 text-danger border-danger/40",
  cancelled: "bg-white/10 text-muted border-line",
};

export function StatusBadge({ status, kind = "order" }: { status: string; kind?: "order" | "payment" }) {
  const label = (kind === "order" ? ORDER_STATUS_LABEL : PAYMENT_STATUS_LABEL)[status] ?? status;
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-bold ${TONE[status] ?? TONE.cancelled}`}>{label}</span>;
}
