"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/env";
import { friendlyError } from "@/lib/errors";
import { safeNext } from "@/lib/routes";
import { formToObject, profileSchema, recoverSchema, resetPasswordSchema, signInSchema, signUpSchema, zodState, type ActionState } from "@/lib/validation";

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signInSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodState(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, message: friendlyError(error, "Não foi possível entrar. Tente novamente.") };

  revalidatePath("/", "layout");
  redirect(safeNext(String(formData.get("next") ?? "")));
}

export async function signUp(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signUpSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodState(parsed.error);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: { data: { display_name: parsed.data.displayName }, emailRedirectTo: `${siteUrl()}/auth/callback` },
  });
  if (error) return { ok: false, message: friendlyError(error, "Não foi possível criar a conta.") };

  if (data.session) {
    revalidatePath("/", "layout");
    redirect(safeNext(String(formData.get("next") ?? "")));
  }
  return { ok: true, message: "Conta criada! Enviamos um e-mail de confirmação. Confirme-o para entrar." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = recoverSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodState(parsed.error);

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl()}/auth/callback?next=/redefinir-senha`,
  });
  // Resposta neutra: não revela se o e-mail existe.
  return { ok: true, message: "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha." };
}

export async function updatePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodState(parsed.error);

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, message: friendlyError(error, "Não foi possível alterar a senha. O link pode ter expirado.") };
  redirect("/perfil?senha=alterada");
}

export async function updateProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = profileSchema.safeParse(formToObject(formData));
  if (!parsed.success) return zodState(parsed.error);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=/perfil");

  const { error } = await supabase.from("profiles").update({ display_name: parsed.data.displayName }).eq("id", user.id);
  if (error) return { ok: false, message: friendlyError(error) };
  revalidatePath("/", "layout");
  return { ok: true, message: "Perfil atualizado." };
}
