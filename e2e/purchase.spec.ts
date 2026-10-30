import { expect, test, type Page } from "@playwright/test";

/**
 * Requer: Supabase configurado em .env.local com DEMO_MODE=true, migrations + seed aplicados
 * (npm run doctor deve passar). Não há login: o proxy entra como "Jogador Demo".
 */

// Jogos que o usuário demo ainda não possui; o teste usa o primeiro disponível, assim pode rodar várias vezes.
const CANDIDATES = ["turbo-quartzo", "lanterna-minima", "casa-dos-espelhos-cegos", "cartografo-das-nuvens", "coruja-engrenagem", "cafeteria-quantica", "ace-point-tenis", "cesta-maxima-street"];

async function firstBuyable(page: Page) {
  for (const slug of CANDIDATES) {
    await page.goto(`/jogo/${slug}`);
    if (await page.getByRole("button", { name: "Comprar agora" }).isVisible()) {
      return { slug, title: (await page.getByRole("heading", { level: 1 }).textContent())!.trim() };
    }
  }
  throw new Error("O usuário demo já possui todos os jogos candidatos. Rode o seed de novo.");
}

async function payWithCard(page: Page, number: string) {
  await page.getByRole("link", { name: "Ir para o pagamento" }).click();
  await page.getByLabel("Nome no cartão").fill("JOGADOR DEMO");
  await page.getByLabel("Número do cartão").fill(number);
  await page.getByLabel("Validade (MM/AA)").fill("12/40");
  await page.getByLabel("CVV").fill("123");
  await page.getByRole("button", { name: /Pagar/ }).click();
}

test("loja clássica (/loja) abre sem login, mostra o usuário demo e os carrosséis", async ({ page }) => {
  await page.goto("/loja");
  await expect(page.getByRole("link", { name: "Entrar" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Criar conta" })).toHaveCount(0);
  await expect(page.getByText("Jogador Demo").first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible(); // hero
  for (const title of ["Em alta", "Lançamentos", "Promoções", "Grátis para jogar"]) {
    await expect(page.getByRole("heading", { name: title })).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: /Porque você jogou/ })).toBeVisible();
  expect(await page.locator("article").count()).toBeGreaterThan(10);
});

test("escolher jogo → carrinho → pagar (aprovado) → biblioteca com chave", async ({ page }) => {
  const game = await firstBuyable(page);
  await page.getByRole("button", { name: "Comprar agora" }).click();
  await expect(page).toHaveURL(/\/carrinho/);
  await expect(page.getByText(game.title).first()).toBeVisible();

  await payWithCard(page, "4242 4242 4242 4242");
  await expect(page).toHaveURL(/\/pedidos\/[0-9a-f-]{36}/);
  await expect(page.getByText("Pagamento aprovado")).toBeVisible();

  await page.goto("/biblioteca");
  const item = page.getByTestId("library-item").filter({ hasText: game.title });
  await expect(item).toBeVisible();
  await item.getByRole("button", { name: "Mostrar chave" }).click();
  await expect(item.getByTestId("activation-key")).toHaveText(/^[0-9A-F]{5}(-[0-9A-F]{5}){3}$/);
  const [download] = await Promise.all([page.waitForEvent("download"), item.getByRole("link", { name: "Baixar" }).click()]);
  expect(download.suggestedFilename()).toContain(game.slug);

  await page.goto("/pedidos");
  await expect(page.getByText("Pago").first()).toBeVisible();
});

test("cartão recusado não libera o jogo", async ({ page }) => {
  const game = await firstBuyable(page);
  await page.getByRole("button", { name: "Adicionar ao carrinho" }).click();
  await page.goto("/carrinho");
  await payWithCard(page, "4000 0000 0000 0002");
  await expect(page.getByText("Pagamento recusado").first()).toBeVisible();
  await page.goto("/biblioteca");
  await expect(page.getByTestId("library-item").filter({ hasText: game.title })).toHaveCount(0);
});

test("lista de desejos e Modo admin", async ({ page }) => {
  await page.goto("/desejos");
  await expect(page.getByRole("heading", { name: "Lista de desejos" })).toBeVisible();

  await page.goto("/admin"); // cliente demo -> explica o Modo admin
  await expect(page).toHaveURL(/\/modo-admin/);
  await page.getByRole("button", { name: "Ativar Modo admin" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Indicadores" })).toBeVisible();
  await page.goto("/admin/jogos");
  await expect(page.getByRole("heading", { name: /Jogos/ })).toBeVisible();
  await page.getByRole("switch", { name: /Modo admin/ }).click(); // volta ao cliente
  await expect(page).toHaveURL(/\/$/);
});
