import { getCurrentUser } from "@/data/auth";
import { getHomeData } from "@/data/games";
import { getUserFlags } from "@/data/user-data";
import { hasSupabaseEnv } from "@/lib/env";
import { isStaticMode } from "@/lib/static-mode";
import { Hero } from "@/components/Hero";
import { Carousel } from "@/components/Carousel";
import { GameCard } from "@/components/GameCard";
import { EmptyState, ErrorState } from "@/components/StateMessage";
import type { CatalogGame } from "@/data/games";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Loja" };

export default async function ShopPage() {
  if (!isStaticMode() && !hasSupabaseEnv()) return <ErrorState error={new Error("Variável de ambiente ausente: NEXT_PUBLIC_SUPABASE_URL")} />;

  const user = await getCurrentUser();
  const [home, flags] = await Promise.all([getHomeData(user?.id), getUserFlags()]);

  if (home.error) return <ErrorState error={home.error} />;
  const total = home.trending.length + home.newReleases.length + home.featured.length;
  if (total === 0) {
    return <EmptyState title="O catálogo está vazio" hint={'O seed ainda não foi aplicado neste banco. Veja o README ("Rodar o seed de novo") e rode npm run doctor.'} />;
  }

  const row = (title: string, games: CatalogGame[], opts: { subtitle?: string; href?: string } = {}) =>
    games.length ? (
      <Carousel title={title} subtitle={opts.subtitle} href={opts.href}>
        {games.map((g) => (
          <GameCard key={g.id} game={g} flags={flags} back="/loja" />
        ))}
      </Carousel>
    ) : null;

  return (
    <>
      <Hero games={home.featured.length ? home.featured : home.trending.slice(0, 5)} owned={flags.owned} staticMode={isStaticMode()} />
      <div className="pb-4">
        {row("Em alta", home.trending, { subtitle: "Os mais vendidos da semana", href: "/catalogo?sort=relevancia" })}
        {row("Lançamentos", home.newReleases, { subtitle: "Acabaram de chegar", href: "/catalogo?sort=lancamento" })}
        {row("Promoções", home.promotions, { subtitle: "Descontos por tempo limitado", href: "/catalogo?promo=1" })}
        {home.because && row(`Porque você jogou ${home.because.title}`, home.because.games, { subtitle: "Sugestões do mesmo estilo da sua biblioteca" })}
        {row("Grátis para jogar", home.free, { subtitle: "Sem custo, é só adicionar à biblioteca", href: "/catalogo?free=1" })}
      </div>
    </>
  );
}
