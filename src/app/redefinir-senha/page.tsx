import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { ResetPasswordForm } from "@/components/AuthForms";
import { getCurrentUser } from "@/data/auth";

export const metadata: Metadata = { title: "Nova senha" };

export default async function ResetPasswordPage() {
  // O link do e-mail passa por /auth/callback, que cria a sessão temporária de recuperação.
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?erro=link");
  return (
    <AuthShell title="Definir nova senha">
      <ResetPasswordForm />
    </AuthShell>
  );
}
