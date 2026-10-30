import { describe, expect, it } from "vitest";
import { staticGameBySlug, staticHome, staticReviews, staticSearch } from "@/data/static";

describe("catálogo estático (entrega parcial)", () => {
  it("tem pelo menos 40 jogos e a home completa", () => {
    expect(staticSearch({}, 100).total).toBeGreaterThanOrEqual(40);
    const home = staticHome();
    expect(home.featured.length).toBeGreaterThan(0);
    for (const k of ["trending", "newReleases", "promotions", "free"] as const) expect(home[k].length).toBeGreaterThan(0);
    expect(home.because?.games.length).toBeGreaterThan(0);
  });
  it("filtra por promoção, gratuitos, gênero, plataforma, preço e busca sem acento", () => {
    expect(staticSearch({ promo: true }, 100).games.every((g) => g.discount_percent > 0)).toBe(true);
    expect(staticSearch({ free: true }, 100).games.every((g) => g.final_price_cents === 0)).toBe(true);
    expect(staticSearch({ category: "rpg" }, 100).games.every((g) => g.category_slug === "rpg")).toBe(true);
    expect(staticSearch({ platform: "android" }, 100).games.every((g) => g.platform_slugs.includes("android"))).toBe(true);
    expect(staticSearch({ maxPrice: 50 }, 100).games.every((g) => g.final_price_cents <= 5000)).toBe(true);
    expect(staticSearch({ q: "lamina" }, 100).games.map((g) => g.slug)).toContain("lamina-do-eclipse");
    expect(staticSearch({ maxAge: 10 }, 100).games.every((g) => g.age_rating <= 10)).toBe(true);
  });
  it("ordena e pagina", () => {
    const asc = staticSearch({ sort: "preco-asc" }, 100).games.map((g) => g.final_price_cents);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    const p = staticSearch({ page: 2 }, 24);
    expect(p.games.length).toBe(17);
    expect(p.pages).toBe(2);
  });
  it("jogo tem avaliações coerentes com a nota média", () => {
    const g = staticGameBySlug("lamina-do-eclipse")!;
    const r = staticReviews(g.id);
    expect(r.length).toBe(g.review_count);
    expect(r.length).toBeGreaterThanOrEqual(3);
    expect(Number(g.avg_rating)).toBeCloseTo(r.reduce((s, x) => s + x.rating, 0) / r.length, 1);
  });
});
