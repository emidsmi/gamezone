"use client";

import { useState } from "react";

/** Em telas pequenas os filtros ficam recolhidos atrás de um botão; a partir de md aparecem como barra lateral. */
export function FiltersPanel({ children, activeCount }: { children: React.ReactNode; activeCount: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" className="btn btn-ghost w-full md:hidden" aria-expanded={open} aria-controls="filtros" onClick={() => setOpen((o) => !o)}>
        {open ? "Ocultar filtros" : `Filtros e ordenação${activeCount ? ` (${activeCount})` : ""}`}
      </button>
      <div id="filtros" className={`${open ? "mt-3 block" : "hidden"} md:mt-0 md:block`}>{children}</div>
    </div>
  );
}
