# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: usuarios.spec.js >> Gerenciamento de Usuários (E2E) >> deve permitir adicionar um novo usuário e encontrá-lo na lista
- Location: e2e\usuarios.spec.js:22:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Usuário E2E 31')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Usuário E2E 31')

```

```yaml
- banner:
  - heading [level=1]
  - button "Alternar tema"
  - button "Sair"
- heading "Gestão de Usuários" [level=2]
- paragraph: Controle de acesso
- text: Usuário criado.
- button
- textbox "Buscar por ID...": "616"
- button
- heading "Usuário E2E 11 - Editado" [level=3]
- text: "e2e_1779975338175@teste.com #600"
- button "Editar"
- button "Excluir"
- heading "Usuário E2E 700" [level=3]
- text: "e2e_1779976860514@teste.com #601"
- button "Editar"
- button "Excluir"
- heading "João Silva" [level=3]
- text: "joao_1779978886165@email.com #602"
- button "Editar"
- button "Excluir"
- heading "Maria Souza" [level=3]
- text: "duplicado_1779978887918@email.com #603"
- button "Editar"
- button "Excluir"
- heading "Pedro Novo" [level=3]
- text: "pedro_1779978888997@email.com #605"
- button "Editar"
- button "Excluir"
- button
- text: 1 / 3
- button
- button
- navigation "Navegação principal":
  - link "Livros":
    - /url: /livros
  - link "Empréstimos":
    - /url: /emprestimos
  - link "Início":
    - /url: /
  - link "Multas":
    - /url: /multas
  - link "Equipe":
    - /url: /usuarios
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Gerenciamento de Usuários (E2E)", () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto("/");
  6   | 
  7   |     await page.fill('input[type="email"]', "admin@sistema.com");
  8   |     await page.fill('input[type="password"]', "123456");
  9   |     await page.click('button[type="submit"]');
  10  | 
  11  |     await expect(page).toHaveURL(/\/dashboard|\/$/);
  12  |   });
  13  | 
  14  |   test("deve navegar até a tela de usuários e listar usuários", async ({
  15  |     page,
  16  |   }) => {
  17  |     await page.goto("/usuarios");
  18  | 
  19  |     await expect(page.locator("h2")).toContainText("Gestão de Usuários");
  20  |   });
  21  | 
  22  |   test("deve permitir adicionar um novo usuário e encontrá-lo na lista", async ({
  23  |     page,
  24  |   }) => {
  25  |     const nomeAleatorio = `Usuário E2E ${Math.floor(Math.random() * 1000)}`;
  26  | 
  27  |     await page.goto("/usuarios");
  28  | 
  29  |     await page.locator(".fab").click();
  30  |     await expect(page.locator(".modal")).toBeVisible();
  31  | 
  32  |     await page.fill('input[name="nome"]', nomeAleatorio);
  33  |     await page.fill('input[name="email"]', `e2e_${Date.now()}@teste.com`);
  34  |     await page.fill('input[name="senha"]', "123456");
  35  |     await page.locator("select").selectOption("aluno");
  36  |     
  37  |     const responsePromise = page.waitForResponse(
  38  |       (resp) =>
  39  |         resp.url().includes("/usuarios") &&
  40  |         resp.request().method() === "POST" &&
  41  |         resp.status() >= 200 &&
  42  |         resp.status() < 300,
  43  |     );
  44  | 
  45  |     await page.click('button[type="submit"]');
  46  | 
  47  |     const response = await responsePromise;
  48  |     const novoUsuario = await response.json();
  49  | 
  50  |     await page.fill(
  51  |       'input[placeholder="Buscar por ID..."]',
  52  |       String(novoUsuario.id),
  53  |     );
  54  | 
  55  |     await page.keyboard.press("Enter");
  56  | 
> 57  |     await expect(page.getByText(nomeAleatorio)).toBeVisible();
      |                                                 ^ Error: expect(locator).toBeVisible() failed
  58  |   });
  59  | 
  60  |   test("deve fechar o modal ao clicar no botão cancelar", async ({ page }) => {
  61  |     await page.goto("/usuarios");
  62  | 
  63  |     await page.locator(".fab").click();
  64  |     await expect(page.locator(".modal")).toBeVisible();
  65  | 
  66  |     await page.click('button:has-text("Cancelar")');
  67  |     await expect(page.locator(".modal")).not.toBeVisible();
  68  |   });
  69  | 
  70  |   test("deve permitir excluir um usuário", async ({ page }) => {
  71  |     await page.goto("/usuarios");
  72  | 
  73  |     await page.waitForSelector(".list-card");
  74  | 
  75  |     const primeiroUsuario = page.locator(".list-card").first();
  76  | 
  77  |     const nomeUsuario = await primeiroUsuario
  78  |       .locator(".list-card__title")
  79  |       .innerText();
  80  | 
  81  |     await primeiroUsuario.locator('button:has-text("Excluir")').click();
  82  | 
  83  |     await expect(page.locator(".modal")).toBeVisible();
  84  | 
  85  |     await page.click('.modal button:has-text("Confirmar")');
  86  | 
  87  |     await expect(page.locator(".modal")).not.toBeVisible();
  88  | 
  89  |     await expect(
  90  |       page.locator(".list-card", { hasText: nomeUsuario }),
  91  |     ).not.toBeVisible();
  92  |   });
  93  | 
  94  |   test("deve permitir editar um usuário", async ({ page }) => {
  95  |     await page.goto("/usuarios");
  96  | 
  97  |     await page.waitForSelector(".list-card");
  98  | 
  99  |     const primeiroUsuario = page.locator(".list-card").first();
  100 | 
  101 |     const nomeOriginal = await primeiroUsuario
  102 |       .locator(".list-card__title")
  103 |       .innerText();
  104 | 
  105 |     await primeiroUsuario.locator('button:has-text("Editar")').click();
  106 | 
  107 |     await expect(page.locator(".modal")).toBeVisible();
  108 | 
  109 |     const inputNome = page.locator('input[name="nome"]');
  110 |     await inputNome.fill(`${nomeOriginal} - Editado`);
  111 | 
  112 |     const responsePromise = page.waitForResponse(
  113 |       (resp) =>
  114 |         resp.url().includes("/usuarios/") &&
  115 |         resp.request().method() === "PUT" &&
  116 |         resp.status() >= 200 &&
  117 |         resp.status() < 300,
  118 |     );
  119 | 
  120 |     await page.getByRole("button", { name: "Confirmar" }).click();
  121 | 
  122 |     await responsePromise;
  123 | 
  124 |     await expect(page.locator(".modal")).not.toBeVisible();
  125 | 
  126 |     await expect(
  127 |       page.locator(".list-card", { hasText: `${nomeOriginal} - Editado` }),
  128 |     ).toBeVisible();
  129 |   });
  130 | });
  131 | 
```