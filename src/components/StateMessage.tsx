import Link from "next/link";
import { diagnoseSetup } from "@/lib/errors";

/** Estado de erro de carregamento (conexão, migrations, RLS...) com instrução de correção. */
export function ErrorState({ error }: { error: unknown }) {
  const p = diagnoseSetup(error);
  return (
    <div role="alert" className="mx-auto my-12 max-w-2xl rounded-2xl border border-danger/50 bg-danger/10 p-6">
      <h2 className="text-xl font-extrabold text-danger">{p.title}</h2>
      <p className="mt-1">{p.detail}</p>
      <p className="mt-3 rounded-lg bg-black/30 p-3 font-mono text-sm">{p.fix}</p>
      <Link href="/" className="btn btn-ghost mt-4">Tentar novamente</Link>
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div role="status" className="mx-auto my-12 max-w-xl rounded-2xl border border-line bg-panel p-8 text-center">
      <p className="text-lg font-bold">{title}</p>
      {hint && <p className="mt-1 text-muted">{hint}</p>}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`animate-pulse rounded-xl bg-panel2 ${className}`} />;
}
