"use client";

import { useState } from "react";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-line bg-panel2">
        <img src={images[active]} alt={`${title}: imagem ${active + 1} de ${images.length}`} className="aspect-video w-full object-cover" />
      </div>
      {images.length > 1 && (
        <ul className="grid grid-cols-4 gap-2" aria-label="Galeria de imagens">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ver imagem ${i + 1}`}
                aria-current={i === active}
                className={`block w-full overflow-hidden rounded-lg border-2 ${i === active ? "border-brand" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <img src={src} alt="" loading="lazy" className="aspect-video w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
