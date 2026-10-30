/**
 * Modo demonstração (DEMO_MODE=true): o site abre sem tela de login. O proxy entra automaticamente
 * com um usuário real do Supabase Auth (criado pelo seed), então a RLS continua valendo igual.
 * NUNCA ligue em produção de verdade: qualquer visitante poderia ativar o "Modo admin".
 */
export const DEMO_ACCOUNTS = {
  customer: { email: "demo@pixelporto.test", password: "Demo@123456" },
  admin: { email: "admin@pixelporto.test", password: "Admin@123456" },
} as const;

export type DemoRole = keyof typeof DEMO_ACCOUNTS;

export const DEMO_ROLE_COOKIE = "pp_demo_role";

export const isDemoMode = () => process.env.DEMO_MODE === "true";

export const parseDemoRole = (value: string | undefined | null): DemoRole => (value === "admin" ? "admin" : "customer");
