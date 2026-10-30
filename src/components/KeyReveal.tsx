"use client";

import { useState } from "react";

export function KeyReveal({ value }: { value: string }) {
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setShown(true);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <code className="rounded-lg border border-line bg-ink px-3 py-1.5 font-mono text-sm tracking-wider" data-testid="activation-key">
        {shown ? value : value.replace(/[0-9A-F]/gi, "•")}
      </code>
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShown((s) => !s)} aria-pressed={shown}>
        {shown ? "Ocultar" : "Mostrar chave"}
      </button>
      <button type="button" className="btn btn-ghost btn-sm" onClick={copy}>{copied ? "Copiado!" : "Copiar"}</button>
      <span className="sr-only" role="status">{copied ? "Chave copiada" : ""}</span>
    </div>
  );
}
