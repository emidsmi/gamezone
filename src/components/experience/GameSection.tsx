"use client";

import Link from "next/link";
import { addToCart } from "@/actions/shop";
import { ageLabel } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { PriceTag } from "@/components/PriceTag";
import type { ExperienceGame } from "./types";

type Props = {
  game: ExperienceGame;
  index: number;
  total: number;
  /** "stage": painel empilhado dentro do palco fixo (modo 3D). "flat": seção comum (sem 3D / movimento reduzido). */
  variant: "stage" | "flat";
  active: boolean;
  sceneReady: boolean;
  staticMode: boolean;
  innerRef?: (el: HTMLElement | null) => void;
};

/**
 * Painel de um jogo: poster (imagem) à esquerda e texto à direita. No palco 3D o poster só aparece enquanto a
 * cena carrega; é o fallback visual sem WebGL / com `prefers-reduced-motion`.
 */
export function GameSection({ game, index, total, variant, active, sceneReady, staticMode, innerRef }: Props) {
  const flat = variant === "flat";
  const show = flat || active;
  const posterVisible = flat || !sceneReady;
  const num = String(index + 1).padStart(2, "0");

  const content = (
    <>
      <div className={`overflow-hidden ${flat ? "h-[48svh] w-full lg:absolute lg:left-0 lg:top-0 lg:h-full lg:w-[58%]" : "absolute left-0 top-0 h-[52%] w-full lg:h-full lg:w-[58%]"}`}>
        <img
          src={mediaUrl(game.banner_path)}
          alt={flat ? `Arte do jogo ${game.title}` : ""}
          className={`h-full w-full object-cover transition-opacity duration-700 ${posterVisible ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      <div
        className={`flex flex-col justify-center gap-4 bg-ink/90 px-5 py-5 backdrop-blur lg:gap-5 lg:bg-transparent lg:px-10 lg:backdrop-blur-none xl:pr-20 ${flat ? "lg:absolute lg:inset-y-0 lg:left-[58%] lg:right-0" : "absolute inset-x-0 bottom-0 h-[48%] lg:inset-y-0 lg:left-[58%] lg:right-0 lg:h-auto"} transition-all duration-[600ms] ease-out ${show ? "translate-y-0 opacity-100 blur-0" : "translate-y-8 opacity-0 blur-sm"}`}
      >
        <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]">
          <span className="text-brand">{num} / {String(total).padStart(2, "0")}</span>
          <span className="rounded-full border border-brand/50 bg-brand/10 px-3 py-1 text-brand">{game.category_name}</span>
        </p>
        <h2
          id={`titulo-${game.slug}`}
          className="text-[clamp(2.2rem,6vw,5.5rem)] font-black uppercase italic leading-[0.95] tracking-[-0.02em] [text-wrap:balance]"
        >
          {game.title}
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-muted lg:text-lg">{game.short_description}</p>
        <ul className="flex flex-wrap gap-2" aria-label="Tags">
          {game.tag_names.slice(0, 3).map((t) => (
            <li key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs">{t}</li>
          ))}
          <li className="rounded-full bg-white/10 px-3 py-1 text-xs">Classificação {ageLabel(game.age_rating)}</li>
        </ul>
        <PriceTag game={game} size="lg" />
        <div className="flex flex-wrap items-center gap-3">
          {staticMode ? (
            <Link href={`/jogo/${game.slug}`} className="btn btn-primary !px-8 !py-3 !text-base shadow-[0_8px_30px_-8px_#a3e635aa]">COMPRAR</Link>
          ) : game.owned ? (
            <Link href="/biblioteca" className="btn btn-primary !px-8 !py-3 !text-base">Na sua biblioteca</Link>
          ) : (
            <form action={addToCart}>
              <input type="hidden" name="gameId" value={game.id} />
              <input type="hidden" name="back" value="/" />
              <input type="hidden" name="goTo" value="/carrinho" />
              <button className="btn btn-primary !px-8 !py-3 !text-base shadow-[0_8px_30px_-8px_#a3e635aa]">
                {game.final_price_cents === 0 ? "OBTER GRÁTIS" : "COMPRAR"}
              </button>
            </form>
          )}
          <Link href={`/jogo/${game.slug}`} className="btn btn-ghost !py-3">Ver jogo</Link>
        </div>
      </div>
    </>
  );

  if (flat) {
    return (
      <section ref={innerRef} id={`jogo-${game.slug}`} aria-labelledby={`titulo-${game.slug}`} className="relative py-8 lg:h-[70svh] lg:py-0">
        {content}
      </section>
    );
  }
  return (
    <section
      inert={!show}
      aria-labelledby={`titulo-${game.slug}`}
      className={`absolute inset-0 ${show ? "z-10" : "pointer-events-none"}`}
    >
      {content}
    </section>
  );
}
