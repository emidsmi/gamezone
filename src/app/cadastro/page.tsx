import type { Metadata } from "next";
import { AuthShell } from "@/components/AuthShell";
import { SignUpForm } from "@/components/AuthForms";
import { safeNext } from "@/lib/routes";

export const metadata: Metadata = { title: "Criar conta" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <AuthShell title="Criar conta" subtitle="É rápido: em poucos minutos você já pode comprar.">
      <SignUpForm next={safeNext(next)} />
    </AuthShell>
  );
}
