import { z } from "zod";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialState: ActionState = { ok: false };

const password = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.")
  .regex(/[A-Za-z]/, "A senha deve ter ao menos uma letra.")
  .regex(/\d/, "A senha deve ter ao menos um número.");

const email = z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido."));

export const signUpSchema = z
  .object({
    displayName: z.string().trim().min(2, "Informe seu nome.").max(60, "Nome muito longo."),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "As senhas não conferem." });

export const signInSchema = z.object({ email, password: z.string().min(1, "Informe a senha.") });
export const recoverSchema = z.object({ email });
export const resetPasswordSchema = z
  .object({ password, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "As senhas não conferem." });

export const profileSchema = z.object({
  displayName: z.string().trim().min(2, "Informe seu nome.").max(60, "Nome muito longo."),
});

export const reviewSchema = z.object({
  gameId: z.uuid(),
  rating: z.coerce.number().int().min(1, "Escolha uma nota de 1 a 5.").max(5, "Escolha uma nota de 1 a 5."),
  comment: z.string().trim().max(2000, "Comentário muito longo (máx. 2000 caracteres).").default(""),
});

const digits = (s: string) => s.replace(/\D/g, "");

export function luhn(value: string): boolean {
  const d = digits(value);
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
}

export const checkoutSchema = z
  .discriminatedUnion("method", [
    z.object({
      method: z.literal("card"),
      cardName: z.string().trim().min(3, "Informe o nome impresso no cartão."),
      cardNumber: z.string().refine(luhn, "Número de cartão inválido."),
      cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Validade no formato MM/AA."),
      cardCvv: z.string().regex(/^\d{3,4}$/, "CVV inválido."),
    }),
    z.object({ method: z.literal("pix") }),
    z.object({ method: z.literal("boleto") }),
  ])
  .superRefine((v, ctx) => {
    if (v.method !== "card") return;
    const [mm, yy] = v.cardExpiry.split("/").map(Number);
    const end = new Date(2000 + yy, mm, 0, 23, 59, 59);
    if (end < new Date()) ctx.addIssue({ code: "custom", path: ["cardExpiry"], message: "Cartão vencido." });
  });

const optionalText = z.string().trim().optional().transform((v) => v || "");
const reqText = (label: string, max = 200) => z.string().trim().min(1, `Informe ${label}.`).max(max, `${label} muito longo.`);
const slug = z.string().trim().toLowerCase().regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen.");

export const gameSchema = z.object({
  id: z.uuid().optional().or(z.literal("")),
  title: reqText("o título", 120),
  slug,
  shortDescription: reqText("o resumo", 300),
  description: reqText("a descrição", 5000),
  categoryId: z.uuid("Escolha uma categoria."),
  studio: reqText("o estúdio", 100),
  publisher: reqText("o publisher", 100),
  priceReais: z.coerce.number().min(0, "Preço inválido.").max(9999, "Preço muito alto."),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida."),
  ageRating: z.coerce.number().refine((n) => [0, 10, 12, 14, 16, 18].includes(n), "Classificação inválida."),
  isFeatured: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
  tags: optionalText,
  platformIds: z.array(z.uuid()).default([]),
  reqMinOs: optionalText, reqMinCpu: optionalText, reqMinRam: optionalText, reqMinGpu: optionalText, reqMinStorage: optionalText,
  reqRecOs: optionalText, reqRecCpu: optionalText, reqRecRam: optionalText, reqRecGpu: optionalText, reqRecStorage: optionalText,
});

export const categorySchema = z.object({
  id: z.uuid().optional().or(z.literal("")),
  name: reqText("o nome", 60),
  slug,
});

export const promotionSchema = z
  .object({
    gameId: z.uuid("Escolha um jogo."),
    discountPercent: z.coerce.number().int().min(1, "Desconto entre 1% e 95%.").max(95, "Desconto entre 1% e 95%."),
    startsAt: z.string().min(1, "Informe o início."),
    endsAt: z.string().min(1, "Informe o fim."),
  })
  .refine((v) => new Date(v.endsAt) > new Date(v.startsAt), { path: ["endsAt"], message: "O fim deve ser depois do início." });

/** Converte erros do Zod em estado de formulário amigável. */
export function zodState(error: z.ZodError): ActionState {
  return { ok: false, message: "Corrija os campos destacados.", fieldErrors: z.flattenError(error).fieldErrors as Record<string, string[]> };
}

export function formToObject(formData: FormData): Record<string, FormDataEntryValue | FormDataEntryValue[]> {
  const out: Record<string, FormDataEntryValue | FormDataEntryValue[]> = {};
  for (const key of new Set(formData.keys())) {
    const all = formData.getAll(key);
    out[key] = all.length > 1 || key.endsWith("Ids") ? all : all[0];
  }
  return out;
}
