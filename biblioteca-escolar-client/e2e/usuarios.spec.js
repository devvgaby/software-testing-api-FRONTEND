import { test, expect } from '@playwright/test';

test.describe('Gerenciamento de Usuários (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.fill('input[type="email"]', 'admin@sistema.com');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard|$/);
  });

  test('deve navegar até a tela de usuários e listar usuários', async ({ page }) => {
    await page.goto('/usuarios');

    await expect(page.locator('h2')).toContainText('Gestão de Usuários');
  });

  test('deve permitir adicionar um novo usuário e encontrá-lo na lista', async ({ page }) => {
    const nomeAleatorio = `Usuário E2E ${Math.floor(Math.random() * 1000)}`;

    await page.goto('/usuarios');

    await page.locator('.fab').click();
    await expect(page.locator('.modal')).toBeVisible();

    await page.fill('input[name="nome"]', nomeAleatorio);
    await page.fill('input[name="email"]', `e2e_${Date.now()}@teste.com`);
    await page.fill('input[name="senha"]', '123456');
    await page.selectOption('select[name="tipo"]', 'aluno');

    const responsePromise = page.waitForResponse(
      resp => resp.url().includes('/usuarios') && resp.request().method() === 'POST' && resp.status() >= 200 && resp.status() < 300
    );

    await page.click('button[type="submit"]');

    const response = await responsePromise;
    const novoUsuario = await response.json();

    await page.fill('input[placeholder = "Buscar por ID..."]', String(novoUsuario.id));
    await page.keyboard.press('Enter');
    
    await expect(page.getByText(nomeAleatorio)).toBeVisible(); 
  });

  test('deve fechar o modal ao clicar no botão cancelar', async ({ page }) => {
    await page.goto('/usuarios');

    await page.locator('.fab').click();
    await expect(page.locator('.modal')).toBeVisible();

    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('deve permitir excluir um usuário', async ({ page }) => {
    await page.goto('/usuarios');

    await page.waitForSelector('.list-card');

    const primeiroUsuario = page.locator('.list-card').first();
    const idBadge = await primeiroUsuario.locator('.badge').innerText();

    await primeiroUsuario.locator('button:has-text("Excluir")').click();

    await expect(page.locator('.modal')).toBeVisible();

    await page.click('.modal button:has-text("Excluir")', { force: true });

    await expect(page.locator('.modal')).not.toBeVisible();

    await expect(page.locator('.list-card', { hasText: idBadge }))
      .not.toBeVisible();
  });

  test("deve permitir editar um usuário", async ({ page}) => {
    await page.goto('/usuarios');
    await page.waitForSelector('.list-card');

    const primeiroUsuario = page.locator('.list-card').first();
    const nomeOriginal = await primeiroUsuario.locator('.list-card__title').innerText();

    await primeiroUsuario.locator('button:has-text("Editar")').click();
    await expect (page.locator('.modal')).toBeVisible();

    const inputNome = page.locator('input[name="nome"]');
    await inputNome.click();
    await inputNome.fill(`${nomeOriginal} - Editado`);

    const responsePromise = page.waitForResponse(
      resp => resp.url().includes('/usuarios/') 
      && resp.request().method() === 'PUT' 
      && resp.status() >= 200 && resp.status() < 300
    );

    await page.getByRole('button', { name: 'Confirmar' }).click();
    await responsePromise;

    await expect(page.locator('.modal')).not.toBeVisible();
    await expect(page.locator('.list-card', { hasText: nomeOriginal + " - Editado"}))
      .toBeVisible();  
  });
});