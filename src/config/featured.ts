/**
 * Os 6 jogos da experiência de rolagem (na ordem das cenas). Para trocar um jogo, altere o slug aqui:
 * a cena 3D é escolhida por `scene` e as cores vêm de `theme`.
 */
export type SceneKey = "ufo" | "barn" | "boat" | "mirror" | "moon" | "car";

export type FeaturedConfig = {
  slug: string;
  scene: SceneKey;
  /** Cores da cena 3D (fundo e acento de luz); o texto e o botão seguem sempre os tokens da marca. */
  theme: { bg: string; accent: string; fog: string };
};

export const FEATURED: FeaturedConfig[] = [
  { slug: "gravitron-gp", scene: "ufo", theme: { bg: "#0b0a2a", accent: "#22d3ee", fog: "#1a0f4a" } },
  { slug: "fazenda-lua-nova", scene: "barn", theme: { bg: "#0f1f3d", accent: "#9db7ff", fog: "#1b2b52" } },
  { slug: "mares-de-guerra", scene: "boat", theme: { bg: "#0a1f33", accent: "#ffd7a1", fog: "#14344f" } },
  { slug: "casa-dos-espelhos-cegos", scene: "mirror", theme: { bg: "#07090d", accent: "#7fb4d9", fog: "#0e1822" } },
  { slug: "a-trilha-dos-vagalumes", scene: "moon", theme: { bg: "#0a1a1a", accent: "#bef264", fog: "#0f2c2a" } },
  { slug: "rali-das-dunas-vermelhas", scene: "car", theme: { bg: "#3b0a0a", accent: "#ffb27a", fog: "#5a1d12" } },
];

export const FEATURED_SLUGS = FEATURED.map((f) => f.slug);
