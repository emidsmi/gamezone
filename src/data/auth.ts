import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/demo";
import { isStaticMode } from "@/lib/static-mode";
import type { Tables } from "@/types/database";

export type CurrentUser = { id: string; email: string; profile: Tables<"profiles"> };

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (isStaticMode()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (!profile) return null;
    return { id: user.id, email: user.email ?? "", profile };
  } catch {
    return null; // Supabase inacessível: o cabeçalho continua renderizando e a página mostra o erro.
  }
});

export async function requireUser(next = "/"): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) {
    // Modo demo: não há tela de login; a falha vira um estado de erro explicativo.
    if (isDemoMode()) throw new Error("DEMO_USER_UNAVAILABLE");
    redirect(`/entrar?next=${encodeURIComponent(next)}`);
  }
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser("/admin");
  if (user.profile.role !== "admin") redirect(isDemoMode() ? "/modo-admin" : "/");
  return user;
}
