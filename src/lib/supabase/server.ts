import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { supabaseAnonKey, supabaseUrl } from "@/lib/env";

/** Cliente Supabase do servidor, autenticado como o usuário da requisição (respeita RLS). */
export async function createClient() {
  const store = await cookies();
  return createServerClient<Database>(supabaseUrl(), supabaseAnonKey(), {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Chamado de um Server Component: o proxy já renova a sessão.
        }
      },
    },
  });
}
