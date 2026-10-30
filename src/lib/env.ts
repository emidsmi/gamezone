function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Variável de ambiente ausente: ${name}. Copie .env.example para .env.local e preencha os valores do Supabase.`);
  }
  return value;
}

export const supabaseUrl = () => required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
export const supabaseAnonKey = () => required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
/** Somente servidor. Nunca importe em componentes de cliente. */
export const serviceRoleKey = () => required("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY);
export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const hasSupabaseEnv = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
