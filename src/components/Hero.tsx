"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CatalogGame } from "@/data/games";
import { addToCart } from "@/actions/shop";
import { mediaUrl } from "@/lib/media";
import { PriceTag } from "@/components/PriceTag";
import { ageLabel } from "@/lib/format";

export function Hero({ games, owned, staticMode = false }: { games: CatalogGame[]; owned: string[]; staticMode?: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || games.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % games.length), 7000);
    return () => clearInterval(t);
  }, [paused, games.length]);

  if (!games.length) return null;
  const game = games[index];
  const isOwned = owned.includes(game.id);

  return (
    <section
      aria-roledescription="carrossel"
      aria-label="Jogos em destaque"
      className="relative isolate overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <img key={game.id} src={mediaUrl(game.banner_path)} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-ink to-transparent" />

      <div className="mx-auto flex min-h-[26rem] max-w-[1400px] flex-col justify-end gap-4 px-4 pb-16 pt-24 sm:min-h-[32rem] sm:px-6 sm:pb-20" aria-live={paused ? "polite" : "off"}>
        <p className="text-sm font-bold uppercase tracking-widest text-gold">
          {game.discount_percent > 0 ? `Oferta · ${game.discount_percent}% off` : "Destaque da semana"}
        </p>
        <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-6xl">{game.title}</h1>
        <p className="max-w-xl text-base text-fg/90 sm:text-lg">{game.short_description}</p>
        <ul className="flex flex-wrap gap-2" aria-label="Tags">
          <li className="rounded-full bg-brand/20 px-3 py-1 text-xs font-bold text-brand">{game.category_name}</li>
          {game.tag_names.slice(0, 3).map((t) => (
            <li key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs">{t}</li>
          ))}
          <li className="rounded-full bg-white/10 px-3 py-1 text-xs">Classificação {ageLabel(game.age_rating)}</li>
        </ul>
        <div className="flex flex-wrap items-center gap-3">
          <PriceTag game={game} size="lg" />
          {staticMode ? (
            <Link href={`/jogo/${game.slug}`} className="btn btn-primary">Ver detalhes</Link>
          ) : isOwned ? (
            <Link href="/biblioteca" className="btn btn-primary">Jogar na biblioteca</Link>
          ) : (
            <form action={addToCart}>
              <input type="hidden" name="gameId" value={game.id} />
              <input type="hidden" name="back" value="/" />
              <input type="hidden" name="goTo" value="/carrinho" />
              <button className="btn btn-primary">{game.final_price_cents === 0 ? "Obter grátis" : "Comprar agora"}</button>
            </form>
          )}
          {!staticMode && <Link href={`/jogo/${game.slug}`} className="btn btn-ghost bg-black/30">Ver detalhes</Link>}
        </div>
      </div>

      {games.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2" role="group" aria-label="Escolher destaque">
          {games.map((g, i) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Destaque ${i + 1}: ${g.title}`}
              aria-current={i === index}
              className={`h-3 rounded-full transition-all ${i === index ? "w-8 bg-brand" : "w-3 bg-white/50 hover:bg-white"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
