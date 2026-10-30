"use client";

import Link from "next/link";
import { useId, useRef } from "react";

export function Carousel({ title, subtitle, href, children }: { title: string; subtitle?: string; href?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: "smooth" });

  return (
    <section aria-labelledby={id} className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6">
      <div className="mb-1 flex items-end justify-between gap-4">
        <div>
          <h2 id={id} className="text-xl font-extrabold sm:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {href && <Link href={href} className="text-sm font-semibold text-brand hover:underline">Ver tudo</Link>}
          <button type="button" onClick={() => scroll(-1)} className="btn btn-ghost btn-sm hidden sm:inline-flex" aria-label={`${title}: anterior`}>‹</button>
          <button type="button" onClick={() => scroll(1)} className="btn btn-ghost btn-sm hidden sm:inline-flex" aria-label={`${title}: próximos`}>›</button>
        </div>
      </div>
      <div ref={ref} className="no-scrollbar -mx-2 flex snap-x gap-4 overflow-x-auto px-2 py-6" tabIndex={-1}>
        {children}
      </div>
    </section>
  );
}
