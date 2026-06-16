import { test, expect } from "@playwright/test";

test.describe("Gerenciamento de Multas (E2E)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.fill('input[type="email"]', "admin@sistema.com");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard|$/);
  });

  test("deve navegar para a tela de multas", async ({ page }) => {
    await page.goto("/multas");

    await expect(page.locator("h2")).toContainText("Gestão de Multas");
  });

  test("deve abrir e fechar o modal de nova multa", async ({ page }) => {
    await page.goto("/multas");

    await page.locator(".fab").click();

    await expect(page.locator(".modal")).toBeVisible();

    await page.click('button:has-text("Cancelar")');

    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("deve permitir cadastrar uma multa", async ({ page }) => {
    await page.goto("/emprestimos");
    await page.locator(".fab").click();
    await page.locator('select[name="livro_id"]').selectOption({ index: 1 });
    await page.locator('select[name="usuario_id"]').selectOption({ index: 1 });
    await page.fill('input[name="data_devolucao_prevista"]', "2026-12-31");

    const empPromise = page.waitForResponse(
      (r) =>
        r.url().includes("/emprestimos") && r.request().method() === "POST",
    );
    await page.click('button[type="submit"]');
    await empPromise;

    await page.goto("/multas");
    await page.locator(".fab").click();
    await expect(page.locator(".modal")).toBeVisible();

    const selectEmprestimo = page.locator('select[name="emprestimo_id"]');
    await selectEmprestimo.click();
    await selectEmprestimo.selectOption({ index: 1 });

    await page.fill('input[name="valor"]', "15.50");

    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/multas") &&
        resp.request().method() === "POST" &&
        resp.status() >= 200 &&
        resp.status() < 300,
    );

    await page.click('button[type="submit"]');
    await responsePromise;

    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("deve permitir editar uma multa", async ({ page }) => {
    await page.goto("/multas");

    if ((await page.locator(".list-card").count()) === 0) {
      await page.goto("/emprestimos");
      await page.locator(".fab").click();
      await page.locator('select[name="livro_id"]').selectOption({ index: 1 });
      await page
        .locator('select[name="usuario_id"]')
        .selectOption({ index: 1 });
      await page.fill('input[name="data_devolucao_prevista"]', "2026-12-31");
      await page.click('button[type="submit"]');

      await page.goto("/multas");
      await page.locator(".fab").click();
      await page
        .locator('select[name="emprestimo_id"]')
        .selectOption({ index: 1 });
      await page.fill('input[name="valor"]', "10.00");
      await page.click('button[type="submit"]');
    }

    await page.goto("/multas");
    await page.waitForSelector(".list-card");

    const primeiroCard = page.locator(".list-card").first();
    await primeiroCard.locator('button:has-text("Editar")').click();
    await expect(page.locator(".modal")).toBeVisible();

    const inputValor = page.locator('input[name="valor"]');
    await inputValor.click();
    await inputValor.fill("25.00");

    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/multas/") &&
        resp.request().method() === "PUT" &&
        resp.status() >= 200 &&
        resp.status() < 300,
    );

    await page.locator('.modal-footer button:has-text("Confirmar")').click();
    await responsePromise;

    await expect(page.locator(".modal")).not.toBeVisible();
  });
});
