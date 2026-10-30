import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGameBySlug, getGameReviews, getPlatforms, getRelatedGames } from "@/data/games";
import { getMyReview, getUserFlags } from "@/data/user-data";
import { addToCart, toggleWishlist } from "@/actions/shop";
import { ageLabel, formatDate } from "@/lib/format";
import { mediaUrl } from "@/lib/media";
import { Gallery } from "@/components/Gallery";
import { PriceTag } from "@/components/PriceTag";
import { Stars } from "@/components/Stars";
import { ReviewForm } from "@/components/ReviewForm";
import { Carousel } from "@/components/Carousel";
import { isStaticMode } from "@/lib/static-mode";
import { GameCard } from "@/components/GameCard";

type Req = { os?: string; cpu?: string; ram?: string; gpu?: string; storage?: string };

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  return game ? { title: game.title, description: game.short_description } : { title: "Jogo não encontrado" };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) notFound();

  const [reviews, related, flags, myReview, platforms] = await Promise.all([getGameReviews(game.id), getRelatedGames(game), getUserFlags(), getMyReview(game.id), getPlatforms()]);
  const platformNames = platforms.filter((p) => game.platform_slugs.includes(p.slug)).map((p) => p.name);
  const staticMode = isStaticMode();
  const owned = flags.owned.includes(game.id);
  const inCart = flags.cart.includes(game.id);
  const wished = flags.wishlist.includes(game.id);
  const back = `/jogo/${game.slug}`;
  const reqs = game.system_requirements as { minimum?: Req; recommended?: Req } | null;
  const images = [game.banner_path, ...game.gallery_paths].filter(Boolean).map((p) => mediaUrl(p));
  const REQ_LABELS: [keyof Req, string][] = [["os", "Sistema"], ["cpu", "Processador"], ["ram", "Memória"], ["gpu", "Placa de vídeo"], ["storage", "Armazenamento"]];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
      <nav aria-label="Trilha" className="mb-4 text-sm text-muted">
        <Link href="/catalogo" className="hover:text-fg">Catálogo</Link> › <Link href={`/catalogo?categoria=${game.category_slug}`} className="hover:text-fg">{game.category_name}</Link>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-black sm:text-5xl">{game.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {game.review_count > 0 ? <Stars value={Number(game.avg_rating)} showValue count={game.review_count} /> : <span className="text-sm text-muted">Sem avaliações ainda</span>}
              <span className="rounded bg-panel2 px-2 py-0.5 text-sm font-bold">{ageLabel(game.age_rating)}</span>
            </div>
          </div>

          <Gallery images={images} title={game.title} />

          <section aria-labelledby="sobre">
            <h2 id="sobre" className="mb-2 text-2xl font-extrabold">Sobre o jogo</h2>
            <div className="space-y-3 whitespace-pre-line text-fg/90">{game.description}</div>
          </section>

          <section aria-labelledby="reqs">
            <h2 id="reqs" className="mb-3 text-2xl font-extrabold">Requisitos de sistema</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {([["Mínimos", reqs?.minimum], ["Recomendados", reqs?.recommended]] as const).map(([label, r]) => (
                <div key={label} className="card p-4">
                  <h3 className="mb-2 font-bold text-brand">{label}</h3>
                  <dl className="space-y-1 text-sm">
                    {REQ_LABELS.map(([k, name]) => r?.[k] && (
                      <div key={k} className="flex gap-2"><dt className="w-28 shrink-0 text-muted">{name}</dt><dd>{r[k]}</dd></div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="avaliacoes">
            <h2 id="avaliacoes" className="mb-3 text-2xl font-extrabold">Avaliações</h2>
            {staticMode ? null : owned ? (
              <div className="mb-6">
                <h3 className="mb-2 font-bold">{myReview ? "Sua avaliação" : "Avalie este jogo"}</h3>
                <ReviewForm gameId={game.id} initialRating={myReview?.rating} initialComment={myReview?.comment} />
              </div>
            ) : (
              <p className="mb-6 rounded-lg border border-line bg-panel p-3 text-sm text-muted">Somente quem comprou o jogo pode avaliá-lo.</p>
            )}
            {reviews.length === 0 ? (
              <p className="text-muted">Ainda não há avaliações para este jogo.</p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-bold">{r.author_name}</p>
                      <Stars value={r.rating} size={14} />
                    </div>
                    {r.comment && <p className="mt-2 text-fg/90">{r.comment}</p>}
                    <p className="mt-2 text-xs text-muted">{formatDate(r.created_at)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start" aria-label="Compra">
          <img src={mediaUrl(game.cover_path)} alt={`Capa de ${game.title}`} className="hidden aspect-[3/4] w-full rounded-2xl border border-line object-cover lg:block" />
          <div className="card space-y-4 p-4">
            <PriceTag game={game} size="lg" />
            {staticMode ? (
              <div className="space-y-2">
                <button type="button" disabled className="btn btn-primary w-full">{game.final_price_cents === 0 ? "Obter grátis" : "Comprar agora"}</button>
                <p className="rounded-lg border border-gold/40 bg-gold/10 p-2 text-xs text-gold">Pré-visualização: a compra fica disponível na versão completa do projeto.</p>
              </div>
            ) : owned ? (
              <Link href="/biblioteca" className="btn btn-primary w-full">Está na sua biblioteca</Link>
            ) : (
              <div className="flex flex-col gap-2">
                {inCart ? (
                  <Link href="/carrinho" className="btn btn-primary w-full">Ir para o carrinho</Link>
                ) : (
                  <>
                    <form action={addToCart}>
                      <input type="hidden" name="gameId" value={game.id} />
                      <input type="hidden" name="back" value={back} />
                      <input type="hidden" name="goTo" value="/carrinho" />
                      <button className="btn btn-primary w-full">{game.final_price_cents === 0 ? "Obter grátis" : "Comprar agora"}</button>
                    </form>
                    <form action={addToCart}>
                      <input type="hidden" name="gameId" value={game.id} />
                      <input type="hidden" name="back" value={back} />
                      <button className="btn btn-ghost w-full">Adicionar ao carrinho</button>
                    </form>
                  </>
                )}
                <form action={toggleWishlist}>
                  <input type="hidden" name="gameId" value={game.id} />
                  <input type="hidden" name="back" value={back} />
                  <button className="btn btn-ghost w-full" aria-pressed={wished}>{wished ? "♥ Na lista de desejos" : "♡ Adicionar à lista de desejos"}</button>
                </form>
              </div>
            )}
            <p className="text-xs text-muted">Entrega digital: a chave de ativação aparece na sua biblioteca assim que o pagamento é confirmado.</p>
          </div>

          <dl className="card space-y-2 p-4 text-sm">
            <div className="flex justify-between gap-2"><dt className="text-muted">Estúdio</dt><dd className="text-right font-semibold">{game.studio}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted">Publisher</dt><dd className="text-right font-semibold">{game.publisher}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted">Lançamento</dt><dd className="text-right font-semibold">{formatDate(game.release_date)}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted">Classificação</dt><dd className="text-right font-semibold">{ageLabel(game.age_rating)}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted">Gênero</dt><dd className="text-right font-semibold">{game.category_name}</dd></div>
            <div className="flex justify-between gap-2"><dt className="text-muted">Plataformas</dt><dd className="text-right font-semibold">{platformNames.join(", ")}</dd></div>
          </dl>
          <ul className="flex flex-wrap gap-2" aria-label="Tags">
            {game.tag_names.map((t, i) => (
              <li key={t}><Link href={`/catalogo?tag=${game.tag_slugs[i] ?? ""}`} className="rounded-full border border-line bg-panel px-3 py-1 text-xs hover:border-brand">{t}</Link></li>
            ))}
          </ul>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="-mx-4 mt-10 sm:-mx-6">
          <Carousel title="Você também pode gostar" subtitle={`Mais jogos de ${game.category_name}`} href={`/catalogo?categoria=${game.category_slug}`}>
            {related.map((g) => <GameCard key={g.id} game={g} flags={flags} back={back} />)}
          </Carousel>
        </div>
      )}
    </div>
  );
}
