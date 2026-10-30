"use client";

import Link from "next/link";
import { Carousel } from "@/components/Carousel";
import { PriceTag } from "@/components/PriceTag";
import { mediaUrl } from "@/lib/media";
import type { ExperienceGame } from "./types";

/** Menu de seleção estilo Netflix: cada card rola até o jogo; o link leva à página de detalhes. */
export function MoreGames({ games, onSelect }: { games: ExperienceGame[]; onSelect: (index: number) => void }) {
  return (
    <div id="mais-jogos" className="relative z-10 bg-ink pt-6">
      <Carousel title="Escolha seu próximo jogo" subtitle="Toque em um card para voltar à cena dele" href="/loja">
        {games.map((g, i) => (
          <article key={g.id} className="group relative w-44 shrink-0 snap-start sm:w-52">
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-label={`Ir para ${g.title}`}
              className="block w-full overflow-hidden rounded-xl border border-line bg-panel text-left transition duration-200 group-hover:-translate-y-1 group-hover:border-brand/70 group-hover:shadow-2xl"
            >
              <img src={mediaUrl(g.cover_path)} alt={`Capa de ${g.title}`} loading="lazy" className="aspect-[3/4] w-full object-cover" />
              <span className="block space-y-1 p-3">
                <span className="block truncate text-sm font-bold">{g.title}</span>
                <PriceTag game={g} />
              </span>
            </button>
            <Link href={`/jogo/${g.slug}`} className="mt-2 block text-center text-xs font-semibold text-brand hover:underline">Ver detalhes</Link>
          </article>
        ))}
      </Carousel>
    </div>
  );
}
