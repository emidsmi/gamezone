"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { DEMO_ROLE_COOKIE, isDemoMode, parseDemoRole } from "@/lib/demo";

/** Alterna entre o usuário demo (cliente) e o admin demo. Só existe com DEMO_MODE=true. */
export async function setDemoRole(formData: FormData) {
  if (!isDemoMode()) redirect("/");
  const role = parseDemoRole(String(formData.get("role") ?? ""));

  (await cookies()).set(DEMO_ROLE_COOKIE, role, { path: "/", httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 24 * 30 });
  const supabase = await createClient();
  await supabase.auth.signOut({ scope: "local" }); // o proxy entra de novo com o perfil escolhido
  revalidatePath("/", "layout");
  redirect(role === "admin" ? "/admin" : "/");
}
