"use client";

import Link from "next/link";
import { useActionState } from "react";
import { requestPasswordReset, signIn, signUp, updatePassword, updateProfile } from "@/actions/auth";
import { initialState } from "@/lib/validation";
import { Field, FormMessage, SubmitButton } from "@/components/ui";

export function SignInForm({ next }: { next: string }) {
  const [state, action] = useActionState(signIn, initialState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field label="E-mail" name="email" type="email" state={state} autoComplete="email" />
      <Field label="Senha" name="password" type="password" state={state} autoComplete="current-password" />
      <FormMessage state={state} />
      <SubmitButton pending="Entrando…">Entrar</SubmitButton>
      <p className="text-sm text-muted">
        <Link href="/recuperar-senha" className="text-brand hover:underline">Esqueci minha senha</Link> ·{" "}
        <Link href={`/cadastro${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-brand hover:underline">Criar conta</Link>
      </p>
    </form>
  );
}

export function SignUpForm({ next }: { next: string }) {
  const [state, action] = useActionState(signUp, initialState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <Field label="Nome" name="displayName" state={state} autoComplete="name" />
      <Field label="E-mail" name="email" type="email" state={state} autoComplete="email" />
      <Field label="Senha" name="password" type="password" state={state} autoComplete="new-password" hint="Mínimo de 8 caracteres, com letras e números." />
      <Field label="Confirmar senha" name="confirmPassword" type="password" state={state} autoComplete="new-password" />
      <FormMessage state={state} />
      <SubmitButton pending="Criando conta…">Criar conta</SubmitButton>
      <p className="text-sm text-muted">Já tem conta? <Link href="/entrar" className="text-brand hover:underline">Entrar</Link></p>
    </form>
  );
}

export function RecoverForm() {
  const [state, action] = useActionState(requestPasswordReset, initialState);
  return (
    <form action={action} className="space-y-4">
      <Field label="E-mail da conta" name="email" type="email" state={state} autoComplete="email" />
      <FormMessage state={state} />
      <SubmitButton pending="Enviando…">Enviar link de recuperação</SubmitButton>
      <p className="text-sm text-muted"><Link href="/entrar" className="text-brand hover:underline">Voltar ao login</Link></p>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, action] = useActionState(updatePassword, initialState);
  return (
    <form action={action} className="space-y-4">
      <Field label="Nova senha" name="password" type="password" state={state} autoComplete="new-password" hint="Mínimo de 8 caracteres, com letras e números." />
      <Field label="Confirmar nova senha" name="confirmPassword" type="password" state={state} autoComplete="new-password" />
      <FormMessage state={state} />
      <SubmitButton pending="Salvando…">Salvar nova senha</SubmitButton>
    </form>
  );
}

export function ProfileForm({ displayName, email }: { displayName: string; email: string }) {
  const [state, action] = useActionState(updateProfile, initialState);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email-ro" className="mb-1 block text-sm font-semibold">E-mail</label>
        <input id="email-ro" value={email} readOnly className="input opacity-70" />
      </div>
      <Field label="Nome" name="displayName" defaultValue={displayName} state={state} autoComplete="name" />
      <FormMessage state={state} />
      <SubmitButton pending="Salvando…">Salvar alterações</SubmitButton>
    </form>
  );
}
