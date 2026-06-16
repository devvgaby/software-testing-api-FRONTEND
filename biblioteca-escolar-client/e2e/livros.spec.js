import { test, expect } from "@playwright/test";

test.describe("Gerenciamento de Livros (E2E)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");

    await page.fill('input[type="email"]', "admin@sistema.com");
    await page.fill('input[type="password"]', "123456");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard|$/);
  });

  test("deve navegar até a tela de livros e listar o acervo", async ({
    page,
  }) => {
    await page.goto("/livros");

    await expect(page.locator("h2")).toContainText("Acervo de Livros");
  });

  test("deve permitir adicionar um novo livro e encontrá-lo na lista", async ({
    page,
  }) => {
    const tituloAleatorio = `Livro E2E ${Math.floor(Math.random() * 1000)}`;

    await page.goto("/livros");

    await page.locator(".fab").click();
    await expect(page.locator(".modal")).toBeVisible();

    await page.fill('input[name="titulo"]', tituloAleatorio);
    await page.fill('input[name="autor"]', "Automação Playwright");

    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/livros") &&
        resp.request().method() === "POST" &&
        resp.status() >= 200 &&
        resp.status() < 300,
    );

    await page.click('button[type="submit"]');

    const response = await responsePromise;
    const novoLivro = await response.json();

    await page.fill(
      'input[placeholder = "Buscar por ID..."]',
      String(novoLivro.id),
    );
    await page.keyboard.press("Enter");

    await expect(page.getByText(tituloAleatorio)).toBeVisible();
  });

  test("deve fechar o modal ao clicar no botão cancelar", async ({ page }) => {
    await page.goto("/livros");

    await page.locator(".fab").click();
    await expect(page.locator(".modal")).toBeVisible();

    await page.click('button:has-text("Cancelar")');
    await expect(page.locator(".modal")).not.toBeVisible();
  });

 test("deve permitir excluir um livro", async ({ page }) => {
    await page.goto("/livros");

    const tituloUnico = `Livro_Del_${Date.now()}`;
    await page.locator(".fab").click();
    await page.fill('input[name="titulo"]', tituloUnico);
    await page.fill('input[name="autor"]', "Suporte E2E");

    const cadastrarPromise = page.waitForResponse(
      (resp) => resp.url().includes("/livros") && resp.request().method() === "POST"
    );
    await page.click('button[type="submit"]');
    const responseCadastro = await cadastrarPromise;
    const livroCriado = await responseCadastro.json();

    await page.fill('input[placeholder = "Buscar por ID..."]', String(livroCriado.id));
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);

    const cardLivro = page.locator(".list-card", { hasText: tituloUnico }).first();
    await cardLivro.locator('button:has-text("Excluir")').click();
    await expect(page.locator(".modal")).toBeVisible();

    const deletePromise = page.waitForResponse(
      (resp) => resp.url().includes("/livros/") && resp.request().method() === "DELETE"
    );

    await page.click('.modal button:has-text("Excluir")', { force: true });
    await deletePromise;

    await expect(page.locator(".modal")).not.toBeVisible();
    await expect(page.locator(".list-card", { hasText: tituloUnico })).not.toBeVisible();
  });

  test("deve permitir editar livro", async ({ page }) => {
    await page.goto("/livros");
    await page.waitForSelector(".list-card");

    const primeiroLivro = page.locator(".list-card").first();
    const tituloOriginal = await primeiroLivro
      .locator(".list-card__title")
      .innerText();

    await primeiroLivro.locator('button:has-text("Editar")').click();
    await expect(page.locator(".modal")).toBeVisible();

    const inputTitulo = page.locator('input[name="titulo"]');
    await inputTitulo.click();
    await inputTitulo.fill(`${tituloOriginal} - Editado`);

    const responsePromise = page.waitForResponse(
      (resp) =>
        resp.url().includes("/livros/") &&
        resp.request().method() === "PUT" &&
        resp.status() >= 200 &&
        resp.status() < 300,
    );

    await page.getByRole("button", { name: "Confirmar" }).click();
    await responsePromise;

    await expect(page.locator(".modal")).not.toBeVisible();
    await expect(
      page.locator(".list-card", { hasText: tituloOriginal + " - Editado" }),
    ).toBeVisible();
  });
});
