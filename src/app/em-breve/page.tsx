import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Em breve" };

const AREAS: Record<string, string> = {
  "/carrinho": "Carrinho",
  "/checkout": "Pagamento",
  "/biblioteca": "Biblioteca",
  "/pedidos": "Pedidos",
  "/desejos": "Lista de desejos",
  "/admin": "Painel administrativo",
};

export default async function ComingSoonPage({ searchParams }: { searchParams: Promise<{ area?: string }> }) {
  const { area } = await searchParams;
  const name = Object.entries(AREAS).find(([p]) => area?.startsWith(p))?.[1] ?? "Esta área";
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-gold">Entrega parcial</p>
      <h1 className="mt-2 text-3xl font-black">{name} faz parte da versão completa</h1>
      <p className="mt-3 text-muted">
        Esta pré-visualização mostra o visual da loja: home, catálogo com filtros e páginas dos jogos. Conta, carrinho, pagamento, biblioteca e painel
        administrativo já estão implementados no código e dependem do banco de dados (Supabase), que será conectado na próxima etapa.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
        <Link href="/" className="btn btn-primary">Voltar à loja</Link>
        <Link href="/catalogo" className="btn btn-ghost">Ver catálogo</Link>
      </div>
    </div>
  );
}
