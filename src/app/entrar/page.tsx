import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { SignInForm } from "@/components/AuthForms";
import { safeNext } from "@/lib/routes";

export const metadata: Metadata = { title: "Entrar" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const { next, erro } = await searchParams;
  return (
    <AuthShell title="Entrar" subtitle="Acesse sua biblioteca e seus pedidos.">
      {erro && <p role="alert" className="rounded-lg border border-danger/50 bg-danger/10 px-3 py-2 text-sm text-danger">O link de acesso é inválido ou expirou. Tente novamente.</p>}
      <SignInForm next={safeNext(next)} />
    </AuthShell>
  );
}
