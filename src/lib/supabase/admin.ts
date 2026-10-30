import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { serviceRoleKey, supabaseUrl } from "@/lib/env";

/**
 * Cliente com service role: IGNORA a RLS. Use somente no servidor e apenas para operações
 * que o cliente nunca pode fazer sozinho (ex.: confirmar pagamento).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(supabaseUrl(), serviceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
