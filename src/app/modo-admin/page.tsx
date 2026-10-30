import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/demo";
import { setDemoRole } from "@/actions/demo";

export const metadata: Metadata = { title: "Modo admin" };

export default function AdminModePage() {
  if (!isDemoMode()) redirect("/");
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-2xl font-black">Painel administrativo</h1>
      <p className="mt-2 text-muted">Na demonstração não há login: ative o <strong>Modo admin</strong> para gerenciar jogos, categorias, promoções e pedidos.</p>
      <form action={setDemoRole} className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <input type="hidden" name="role" value="admin" />
        <button className="btn btn-primary">Ativar Modo admin</button>
        <Link href="/" className="btn btn-ghost">Voltar à loja</Link>
      </form>
    </div>
  );
}
