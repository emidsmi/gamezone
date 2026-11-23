import { expect, test } from "@playwright/test";

/** Fluxo de compra do modo estático (sem banco): tudo fica no localStorage do navegador. */

test("jogo → carrinho → pagamento aprovado → biblioteca com chave → pedidos", async ({ page }) => {
  await page.goto("/jogo/turbo-quartzo");
  await page.getByRole("button", { name: "Comprar agora" }).click();
  await expect(page).toHaveURL(/\/carrinho/);
  await expect(page.getByRole("link", { name: "Turbo Quartzo" })).toBeVisible();

  await page.getByRole("link", { name: "Ir para o pagamento" }).click();
  await page.getByRole("button", { name: /Pagar/ }).click();
  await expect(page).toHaveURL(/\/pedidos\/[0-9a-f-]{36}/);
  await expect(page.getByText("Pagamento aprovado").first()).toBeVisible();

  await page.goto("/biblioteca");
  const item = page.getByTestId("library-item").filter({ hasText: "Turbo Quartzo" });
  await expect(item).toBeVisible();
  await item.getByRole("button", { name: "Mostrar chave" }).click();
  await expect(item.getByTestId("activation-key")).toHaveText(/^[0-9A-F]{5}(-[0-9A-F]{5}){3}$/);
  const [download] = await Promise.all([page.waitForEvent("download"), item.getByRole("button", { name: "Baixar" }).click()]);
  expect(download.suggestedFilename()).toContain("turbo-quartzo");

  await page.goto("/pedidos");
  await expect(page.getByText("Pago").first()).toBeVisible();
});

test("cartão recusado não libera o jogo", async ({ page }) => {
  await page.goto("/jogo/lanterna-minima");
  await page.getByRole("button", { name: /Comprar agora|Obter grátis/ }).click();
  await page.getByRole("link", { name: "Ir para o pagamento" }).click();
  await page.getByLabel("Número do cartão").fill("4000 0000 0000 0002");
  await page.getByRole("button", { name: /Pagar/ }).click();
  await expect(page.getByText("Pagamento recusado").first()).toBeVisible();
  await page.goto("/biblioteca");
  await expect(page.getByTestId("library-item")).toHaveCount(0);
});

test("COMPRAR da home 3D leva ao carrinho; desejos funcionam", async ({ page }) => {
  await page.goto("/?q=low");
  await page.getByRole("button", { name: "COMPRAR" }).first().click();
  await expect(page).toHaveURL(/\/carrinho/);
  await expect(page.getByRole("link", { name: "Gravitron GP" })).toBeVisible();

  await page.goto("/jogo/turbo-quartzo");
  await page.getByRole("button", { name: /Adicionar à lista de desejos/ }).click();
  await page.goto("/desejos");
  await expect(page.getByRole("link", { name: "Turbo Quartzo" })).toBeVisible();
});
