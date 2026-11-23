import Link from "next/link";
import type { CatalogGame } from "@/data/games";
import type { UserFlags } from "@/data/user-data";
import { addToCart, toggleWishlist } from "@/actions/shop";
import { mediaUrl } from "@/lib/media";
import { ageLabel } from "@/lib/format";
import { PriceTag } from "@/components/PriceTag";
import { Stars } from "@/components/Stars";
import { isStaticMode } from "@/lib/static-mode";
import { toLite } from "@/lib/lite";
import { LocalBuyButton, LocalWishButton } from "@/components/local/LocalShop";

export function GameCard({ game, flags, back = "/", fluid = false }: { game: CatalogGame; flags: UserFlags; back?: string; fluid?: boolean }) {
  const owned = flags.owned.includes(game.id);
  const inCart = flags.cart.includes(game.id);
  const wished = flags.wishlist.includes(game.id);
  const staticMode = isStaticMode();

  return (
    <article
      className={`group relative transition-transform duration-200 hover:z-20 focus-within:z-20 md:hover:scale-[1.07] md:focus-within:scale-[1.07] ${fluid ? "w-full" : "w-40 shrink-0 snap-start sm:w-48 lg:w-52"}`}
    >
      <div className="overflow-hidden rounded-xl border border-line bg-panel shadow-md transition-shadow group-hover:border-brand/70 group-hover:shadow-2xl group-focus-within:border-brand/70">
        <Link href={`/jogo/${game.slug}`} className="block" aria-label={`${game.title}, ${game.final_price_cents === 0 ? "grátis" : "ver detalhes"}`}>
          <div className="relative aspect-[3/4] overflow-hidden bg-panel2">
            <img src={mediaUrl(game.cover_path)} alt={`Capa de ${game.title}`} loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-xs font-bold">{ageLabel(game.age_rating)}</span>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black via-black/90 to-transparent p-3 pt-16 opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand">{game.category_name}</p>
              {game.review_count > 0 && <Stars value={Number(game.avg_rating)} size={13} />}
              <ul className="mt-1 flex flex-wrap gap-1" aria-label="Tags">
                {game.tag_names.slice(0, 3).map((t) => (
                  <li key={t} className="rounded bg-white/15 px-1.5 py-0.5 text-[11px]">{t}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-1 p-3">
            <h3 className="truncate text-sm font-bold">{game.title}</h3>
            <PriceTag game={game} />
          </div>
        </Link>

        <div className="max-h-0 overflow-hidden transition-[max-height] duration-200 group-hover:max-h-28 group-focus-within:max-h-28">
          <div className="flex gap-2 border-t border-line p-2">
            {staticMode ? (
              <>
                <LocalBuyButton game={toLite(game)} className="btn btn-primary btn-sm flex-1" label={game.final_price_cents === 0 ? "Obter" : "Comprar"} />
                <LocalWishButton gameId={game.id} className="btn btn-ghost btn-sm" compact />
              </>
            ) : owned ? (
              <Link href="/biblioteca" className="btn btn-ghost btn-sm flex-1">Na biblioteca</Link>
            ) : inCart ? (
              <Link href="/carrinho" className="btn btn-ghost btn-sm flex-1">Ver carrinho</Link>
            ) : (
              <form action={addToCart} className="flex-1">
                <input type="hidden" name="gameId" value={game.id} />
                <input type="hidden" name="back" value={back} />
                <button className="btn btn-primary btn-sm w-full" aria-label={`${game.final_price_cents === 0 ? "Obter" : "Comprar"} ${game.title}`}>
                  {game.final_price_cents === 0 ? "Obter" : "Comprar"}
                </button>
              </form>
            )}
            {!owned && !staticMode && (
              <form action={toggleWishlist}>
                <input type="hidden" name="gameId" value={game.id} />
                <input type="hidden" name="back" value={back} />
                <button className="btn btn-ghost btn-sm" aria-pressed={wished} aria-label={wished ? `Remover ${game.title} dos desejos` : `Adicionar ${game.title} aos desejos`}>
                  <span aria-hidden="true">{wished ? "♥" : "♡"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
