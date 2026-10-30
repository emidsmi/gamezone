"use client";

import { diagnoseSetup } from "@/lib/errors";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const p = diagnoseSetup(error);
  return (
    <div role="alert" className="mx-auto max-w-2xl px-4 py-20">
      <div className="rounded-2xl border border-danger/50 bg-danger/10 p-6">
        <h1 className="text-xl font-extrabold text-danger">{p.title}</h1>
        <p className="mt-1">{p.detail}</p>
        <p className="mt-3 rounded-lg bg-black/30 p-3 font-mono text-sm">{p.fix}</p>
        <button onClick={reset} className="btn btn-primary mt-4">Tentar novamente</button>
      </div>
    </div>
  );
}
