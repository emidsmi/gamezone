import { expect, test } from "@playwright/test";

/** Experiência de rolagem da home (/): funciona em modo estático (sem Supabase) e com Supabase. */
const TITLES = ["Gravitron GP", "Fazenda Lua Nova", "Marés de Guerra", "Casa dos Espelhos Cegos", "A Trilha dos Vagalumes", "Rali das Dunas Vermelhas"];

async function scrollToGame(page: import("@playwright/test").Page, i: number, frac = 0.5) {
  await page.evaluate(([i, frac]) => {
    const el = [...document.querySelectorAll("[id^=jogo-]")][i] as HTMLElement;
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + el.offsetHeight * frac);
  }, [i, frac] as const);
  await page.waitForTimeout(1500);
}

const activeTitles = (page: import("@playwright/test").Page) =>
  page.evaluate(() => [...document.querySelectorAll("section")].filter((s) => !s.hasAttribute("inert")).map((s) => s.querySelector("h2")?.textContent?.trim()));

test("6 jogos, cada um com texto e COMPRAR; canvas 3D único; carrossel e rodapé", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?q=low");
  await expect(page.locator("canvas")).toHaveCount(1, { timeout: 15_000 });
  for (const title of TITLES) await expect(page.getByRole("heading", { name: title, level: 2 })).toHaveCount(1);
  expect(await page.getByRole("link", { name: "COMPRAR" }).or(page.getByRole("button", { name: /COMPRAR|OBTER/ })).count()).toBe(6);
  await expect(page.getByRole("navigation", { name: "Jogos em destaque" })).toBeVisible();

  // rolar troca o jogo ativo (só o painel da cena atual fica interativo)
  await scrollToGame(page, 0);
  await expect.poll(() => activeTitles(page), { timeout: 20_000 }).toContain("Gravitron GP");
  await scrollToGame(page, 3);
  await expect.poll(() => activeTitles(page), { timeout: 20_000 }).toContain("Casa dos Espelhos Cegos");
  expect(await activeTitles(page)).not.toContain("Gravitron GP");

  // carrossel estilo Netflix + rodapé
  await page.locator("#mais-jogos").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Ir para Marés de Guerra" }).click();
  await expect.poll(() => activeTitles(page), { timeout: 25_000 }).toContain("Marés de Guerra");
  await expect(page.getByText("© 2026 GameZone Brasil")).toBeAttached();
  expect(errors).toEqual([]);
});

test("movimento reduzido: sem canvas, 6 seções estáticas com poster", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(0);
  for (const title of TITLES) await expect(page.getByRole("heading", { name: title, level: 2 })).toBeVisible();
  await ctx.close();
});

test("mobile: layout em coluna, sem rolagem horizontal", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto("/?q=low");
  await expect(page.locator("canvas")).toHaveCount(1, { timeout: 15_000 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  await ctx.close();
});
