import { test, expect } from "@playwright/test";

test.describe("Gerenciamento de Empréstimos (E2E)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.fill('input[type="email"]', "admin@sistema.com");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard|$/);
  });

  test("deve navegar até a tela de empréstimos e listar o acervo", async ({
    page,
  }) => {
    await page.goto("/emprestimos");

    await expect(page.locator("h2")).toContainText("Empréstimos");
  });

  test("deve permitir adicionar um novo empréstimo e encontrá-lo na lista", async ({
    page,
  }) => {
    await page.goto("/emprestimos");

    await page.locator(".fab").click();
    await expect(page.locator(".modal")).toBeVisible();

    await page.locator('select[name="livro_id"]').selectOption({ index: 1 });
    await page.locator('select[name="usuario_id"]').selectOption({ index: 1 });
    await page.fill('input[name="data_devolucao_prevista"]', "2026-12-31");

    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/emprestimos") &&
        resp.request().method() === "POST" &&
        resp.status() >= 200 &&
        resp.status() < 300,
    );

    await page.click('button[type="submit"]');

    await responsePromise;

    await expect(page.locator(".modal")).not.toBeVisible();
    await expect(page.locator(".list-card").first()).toBeVisible();
  });

  test("deve fechar o modal ao clicar no botão cancelar", async ({ page }) => {
    await page.goto("/emprestimos");

    await page.locator(".fab").click();
    await expect(page.locator(".modal")).toBeVisible();

    await page.click('button:has-text("Cancelar")');
    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("deve permitir registrar a devolução de um livro", async ({ page }) => {
    await page.goto("/emprestimos");
    await page.waitForSelector(".list-card");

    const cardAtivo = page
      .locator(".list-card", {
        has: page.locator('button:has-text("Devolver")'),
      })
      .first();
    await cardAtivo.locator('button:has-text("Devolver")').click();

    await expect(page.locator(".modal")).toBeVisible();

    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/emprestimos/") &&
        resp.request().method() === "PUT" &&
        resp.status() >= 200 &&
        resp.status() < 300,
    );

    await page.locator('.modal-footer button:has-text("Confirmar")').click();
    await responsePromise;

    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("deve permitir editar empréstimo", async ({ page }) => {
    await page.goto("/emprestimos");
    await page.waitForSelector(".list-card");

    const primeiroEmprestimo = page.locator(".list-card").first();
    await primeiroEmprestimo.locator('button:has-text("Editar")').click();
    await expect(page.locator(".modal")).toBeVisible();

    const inputData = page.locator('input[name="data_devolucao_prevista"]');
    await inputData.click();
    await inputData.fill("2026-12-25");

    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/emprestimos/") &&
        resp.request().method() === "PUT" &&
        resp.status() >= 200 &&
        resp.status() < 300,
    );

    await page.locator('.modal-footer button:has-text("Confirmar")').click();
    await responsePromise;

    await expect(page.locator(".modal")).not.toBeVisible();
  });

  test("deve permitir excluir um empréstimo", async ({ page }) => {
    await page.goto("/emprestimos");
    await page.waitForSelector(".list-card");

    const primeiroEmprestimo = page.locator(".list-card").first();

    const tituloOriginal = await primeiroEmprestimo
      .locator(".list-card__title")
      .innerText();

    await primeiroEmprestimo.locator('button:has-text("Excluir")').click();
    await expect(page.locator(".modal")).toBeVisible();

    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/emprestimos/") &&
        resp.request().method() === "DELETE" &&
        resp.status() >= 200 &&
        resp.status() < 300,
    );

    await page.locator('.modal-footer button:has-text("Confirmar")').click();
    await responsePromise;

    await expect(page.locator(".modal")).not.toBeVisible();
  });
});
