import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { RecoverForm } from "@/components/AuthForms";

export const metadata: Metadata = { title: "Recuperar senha" };

export default function RecoverPage() {
  return (
    <AuthShell title="Recuperar senha" subtitle="Enviaremos um link para você criar uma nova senha.">
      <RecoverForm />
    </AuthShell>
  );
}
