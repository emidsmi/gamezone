import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-6xl font-black text-brand">404</p>
      <h1 className="mt-2 text-2xl font-extrabold">Página não encontrada</h1>
      <p className="mt-1 text-muted">O endereço pode ter mudado ou o jogo saiu do catálogo.</p>
      <Link href="/" className="btn btn-primary mt-6">Voltar à loja</Link>
    </div>
  );
}
