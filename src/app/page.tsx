import { getFeaturedGames } from "@/data/featured";
import { getUserFlags } from "@/data/user-data";
import { isStaticMode } from "@/lib/static-mode";
import { Experience } from "@/components/experience/Experience";
import { EmptyState } from "@/components/StateMessage";

/** Home: experiência de rolagem com 6 jogos em destaque (a loja clássica continua em /loja). */
export default async function HomePage() {
  const [featured, flags] = await Promise.all([getFeaturedGames(), getUserFlags()]);

  if (featured.length === 0) {
    return <EmptyState title="Os jogos em destaque não foram encontrados" hint={'Aplique o seed (README, "Rodar o seed de novo") e confira os slugs em src/config/featured.ts.'} />;
  }

  const games = featured.map((g) => ({
    id: g.id,
    slug: g.slug,
    title: g.title,
    short_description: g.short_description,
    category_name: g.category_name,
    tag_names: g.tag_names,
    age_rating: g.age_rating,
    price_cents: g.price_cents,
    final_price_cents: g.final_price_cents,
    discount_percent: g.discount_percent,
    cover_path: g.cover_path,
    banner_path: g.banner_path,
    owned: flags.owned.includes(g.id),
  }));

  return <Experience games={games} staticMode={isStaticMode()} />;
}
