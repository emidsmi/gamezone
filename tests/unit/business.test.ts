import { describe, expect, it, vi } from "vitest";
import { applyDiscount, averageRating, cartTotals, isPromotionActive } from "@/services/pricing";
import { MockGateway } from "@/services/gateway/mock";
import { placeOrder, settlePendingPayment } from "@/services/checkout";
import { checkoutSchema, luhn, promotionSchema, reviewSchema, signUpSchema } from "@/lib/validation";
import { resolveAccess, safeNext } from "@/lib/routes";
import { diagnoseSetup, friendlyError, toError } from "@/lib/errors";
import { formatPrice } from "@/lib/format";

describe("pricing", () => {
  it("aplica desconto arredondando o desconto para baixo", () => {
    expect(applyDiscount(11990, 25)).toBe(8993);
    expect(applyDiscount(5000, 0)).toBe(5000);
    expect(applyDiscount(5000, 100)).toBe(0);
  });
  it("rejeita valores invalidos", () => {
    expect(() => applyDiscount(-1, 10)).toThrow();
    expect(() => applyDiscount(100, 101)).toThrow();
  });
  it("soma carrinho e economia", () => {
    expect(cartTotals([{ price_cents: 10000, final_price_cents: 7500 }, { price_cents: 5000, final_price_cents: 5000 }])).toEqual({ subtotal: 15000, total: 12500, savings: 2500, count: 2 });
  });
  it("detecta promocao vigente", () => {
    const now = new Date("2026-06-01T12:00:00Z");
    expect(isPromotionActive({ active: true, starts_at: "2026-05-01T00:00:00Z", ends_at: "2026-07-01T00:00:00Z" }, now)).toBe(true);
    expect(isPromotionActive({ active: false, starts_at: "2026-05-01T00:00:00Z", ends_at: "2026-07-01T00:00:00Z" }, now)).toBe(false);
    expect(isPromotionActive({ active: true, starts_at: "2026-07-02T00:00:00Z", ends_at: "2026-08-01T00:00:00Z" }, now)).toBe(false);
  });
  it("calcula media de notas", () => {
    expect(averageRating([5, 4, 4])).toBe(4.33);
    expect(averageRating([])).toBe(0);
  });
  it("formata preco e gratuito", () => {
    expect(formatPrice(0)).toBe("Grátis");
    expect(formatPrice(8993)).toMatch(/89,93/);
  });
});

describe("gateway simulado", () => {
  const gw = new MockGateway();
  const base = { orderId: "o", paymentId: "11111111-2222-3333-4444-555555555555", amountCents: 1000 };
  const card = (number: string) => ({ ...base, method: "card" as const, card: { number, holder: "A B", expiry: "12/40", cvv: "123" } });

  it("aprova cartao valido", async () => {
    expect((await gw.charge(card("4242 4242 4242 4242"))).status).toBe("approved");
  });
  it("recusa cartoes de teste", async () => {
    expect(await gw.charge(card("4000000000000002"))).toMatchObject({ status: "declined", reason: expect.stringContaining("recusado") });
    expect(await gw.charge(card("4000000000000051"))).toMatchObject({ status: "declined", reason: "Saldo insuficiente." });
  });
  it("deixa pendente: antifraude, pix e boleto", async () => {
    expect((await gw.charge(card("4000000000000003"))).status).toBe("pending");
    const pix = await gw.charge({ ...base, method: "pix" });
    expect(pix.status).toBe("pending");
    expect(pix.instructions).toBeTruthy();
    expect((await gw.charge({ ...base, method: "boleto" })).status).toBe("pending");
  });
  it("aprova pedido gratuito", async () => {
    expect((await gw.charge({ ...base, amountCents: 0, method: "free" })).status).toBe("approved");
  });
});

describe("orquestracao do checkout", () => {
  const order = { order_id: "ord1", payment_id: "pay1", total_cents: 5000, method: "card" };
  const userDb = (data: unknown, error: unknown = null) => ({ rpc: vi.fn().mockResolvedValue({ data, error }) });
  const adminDb = () => ({ rpc: vi.fn().mockResolvedValue({ data: {}, error: null }) });
  const card = { number: "4242424242424242", holder: "Ana", expiry: "12/40", cvv: "123" };

  it("cria pedido, cobra e confirma pelo service role", async () => {
    const u = userDb(order), a = adminDb();
    const out = await placeOrder(u as never, a as never, { method: "card", card });
    expect(out).toMatchObject({ orderId: "ord1", status: "approved" });
    expect(u.rpc).toHaveBeenCalledWith("create_order_from_cart", { p_method: "card" });
    expect(a.rpc).toHaveBeenCalledWith("confirm_payment", expect.objectContaining({ p_payment_id: "pay1", p_status: "approved" }));
  });
  it("envia recusa ao banco com o motivo", async () => {
    const a = adminDb();
    const out = await placeOrder(userDb(order) as never, a as never, { method: "card", card: { ...card, number: "4000000000000002" } });
    expect(out.status).toBe("declined");
    expect(a.rpc).toHaveBeenCalledWith("confirm_payment", expect.objectContaining({ p_status: "declined", p_reason: expect.any(String) }));
  });
  it("nao chama o gateway nem confirma se a criacao do pedido falhar", async () => {
    const a = adminDb();
    await expect(placeOrder(userDb(null, new Error("empty_cart")) as never, a as never, { method: "pix" })).rejects.toThrow("empty_cart");
    expect(a.rpc).not.toHaveBeenCalled();
  });
  it("settlePendingPayment exige pagamento pendente visivel ao usuario", async () => {
    const chain = (row: unknown) => ({ from: () => ({ select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: async () => ({ data: row, error: null }) }) }) }) }) });
    const a = adminDb();
    await expect(settlePendingPayment(chain(null) as never, a as never, "ord1", "approved")).rejects.toThrow("order_not_pending");
    expect(a.rpc).not.toHaveBeenCalled();
    await settlePendingPayment(chain({ id: "pay123456789", status: "pending", order_id: "ord1" }) as never, a as never, "ord1", "approved");
    expect(a.rpc).toHaveBeenCalledWith("confirm_payment", expect.objectContaining({ p_status: "approved" }));
  });
});

describe("validacao (Zod)", () => {
  it("cadastro exige senha forte e confirmacao igual", () => {
    expect(signUpSchema.safeParse({ displayName: "Ana", email: "ANA@x.com", password: "abc12345", confirmPassword: "abc12345" }).success).toBe(true);
    expect(signUpSchema.safeParse({ displayName: "Ana", email: "ana@x.com", password: "curta1", confirmPassword: "curta1" }).success).toBe(false);
    expect(signUpSchema.safeParse({ displayName: "Ana", email: "ana@x.com", password: "abc12345", confirmPassword: "outra123" }).success).toBe(false);
    expect(signUpSchema.safeParse({ displayName: "A", email: "invalido", password: "abc12345", confirmPassword: "abc12345" }).success).toBe(false);
  });
  it("valida cartao com Luhn e validade", () => {
    expect(luhn("4242 4242 4242 4242")).toBe(true);
    expect(luhn("4242 4242 4242 4241")).toBe(false);
    const ok = { method: "card", cardName: "Ana Souza", cardNumber: "4242424242424242", cardExpiry: "12/40", cardCvv: "123" };
    expect(checkoutSchema.safeParse(ok).success).toBe(true);
    expect(checkoutSchema.safeParse({ ...ok, cardExpiry: "01/20" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ ...ok, cardCvv: "12" }).success).toBe(false);
    expect(checkoutSchema.safeParse({ method: "pix" }).success).toBe(true);
    expect(checkoutSchema.safeParse({ method: "outro" }).success).toBe(false);
  });
  it("avaliacao exige nota de 1 a 5", () => {
    const id = "00000000-0000-4000-8000-000000000001";
    expect(reviewSchema.safeParse({ gameId: id, rating: "5", comment: "ótimo" }).success).toBe(true);
    expect(reviewSchema.safeParse({ gameId: id, rating: "6" }).success).toBe(false);
    expect(reviewSchema.safeParse({ gameId: id, rating: "0" }).success).toBe(false);
  });
  it("promocao: fim depois do inicio e desconto valido", () => {
    const id = "00000000-0000-4000-8000-000000000001";
    expect(promotionSchema.safeParse({ gameId: id, discountPercent: "30", startsAt: "2026-01-01T00:00", endsAt: "2026-02-01T00:00" }).success).toBe(true);
    expect(promotionSchema.safeParse({ gameId: id, discountPercent: "30", startsAt: "2026-02-01T00:00", endsAt: "2026-01-01T00:00" }).success).toBe(false);
    expect(promotionSchema.safeParse({ gameId: id, discountPercent: "99", startsAt: "2026-01-01T00:00", endsAt: "2026-02-01T00:00" }).success).toBe(false);
  });
});

describe("rotas e erros", () => {
  it("protege rotas por perfil", () => {
    expect(resolveAccess("/biblioteca", null)).toBe("/entrar?next=%2Fbiblioteca");
    expect(resolveAccess("/biblioteca", { role: "customer" })).toBeNull();
    expect(resolveAccess("/admin/jogos", { role: "customer" })).toBe("/");
    expect(resolveAccess("/admin", null)).toBe("/entrar?next=%2Fadmin");
    expect(resolveAccess("/admin/pedidos", { role: "admin" })).toBeNull();
    expect(resolveAccess("/entrar", { role: "customer" })).toBe("/");
    expect(resolveAccess("/catalogo", null)).toBeNull();
    expect(resolveAccess("/administrador", null)).toBeNull();
  });
  it("modo demo: sem login, /admin exige Modo admin", () => {
    const demo = { demo: true };
    expect(resolveAccess("/entrar", null, demo)).toBe("/");
    expect(resolveAccess("/cadastro", { role: "customer" }, demo)).toBe("/");
    expect(resolveAccess("/biblioteca", null, demo)).toBeNull();
    expect(resolveAccess("/admin/jogos", { role: "customer" }, demo)).toBe("/modo-admin");
    expect(resolveAccess("/admin", { role: "admin" }, demo)).toBeNull();
  });
  it("diagnostica problemas de configuracao", () => {
    expect(diagnoseSetup(new Error("Variável de ambiente ausente: NEXT_PUBLIC_SUPABASE_URL")).title).toMatch(/não configurado/);
    expect(diagnoseSetup({ message: "TypeError: fetch failed", details: "ECONNREFUSED" }).title).toMatch(/conectar/);
    expect(diagnoseSetup({ code: "PGRST205", message: "Could not find the table 'public.games'" }).title).toMatch(/sem as tabelas/);
    expect(diagnoseSetup({ message: "Invalid API key" }).title).toMatch(/Chave/);
    expect(diagnoseSetup(new Error("DEMO_USER_UNAVAILABLE")).title).toMatch(/demonstração/);
    expect(toError({ code: "42P01", message: "x", details: "y" }).message).toBe("42P01 · x · y");
  });
  it("bloqueia open redirect", () => {
    expect(safeNext("/biblioteca")).toBe("/biblioteca");
    expect(safeNext("//evil.com")).toBe("/");
    expect(safeNext("https://evil.com")).toBe("/");
    expect(safeNext(null)).toBe("/");
  });
  it("traduz erros tecnicos", () => {
    expect(friendlyError(new Error("already_owned"))).toMatch(/já possui/);
    expect(friendlyError({ message: "new row violates row-level security policy" })).toMatch(/permissão/);
    expect(friendlyError(new Error("Invalid login credentials"))).toBe("E-mail ou senha incorretos.");
    expect(friendlyError(new Error("xyz stack trace"))).toMatch(/Algo deu errado/);
  });
});
