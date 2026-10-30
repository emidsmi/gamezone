import { describe, expect, it } from "vitest";
import { FEATURED, FEATURED_SLUGS } from "@/config/featured";
import { staticGameBySlug } from "@/data/static";

describe("jogos em destaque da experiência de rolagem", () => {
  it("são exatamente 6, sem repetição", () => {
    expect(FEATURED).toHaveLength(6);
    expect(new Set(FEATURED_SLUGS).size).toBe(6);
    expect(new Set(FEATURED.map((f) => f.scene)).size).toBe(6); // uma cena 3D diferente por jogo
  });
  it("todos existem no catálogo e estão ativos", () => {
    for (const slug of FEATURED_SLUGS) {
      const g = staticGameBySlug(slug);
      expect(g, slug).not.toBeNull();
      expect(g!.is_active).toBe(true);
      expect(g!.cover_path && g!.banner_path).toBeTruthy();
    }
  });
  it("seguem a ordem combinada", () => {
    expect(FEATURED_SLUGS).toEqual(["gravitron-gp", "fazenda-lua-nova", "mares-de-guerra", "casa-dos-espelhos-cegos", "a-trilha-dos-vagalumes", "rali-das-dunas-vermelhas"]);
  });
  it("temas têm cores hexadecimais válidas", () => {
    for (const f of FEATURED) for (const c of Object.values(f.theme)) expect(c).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
