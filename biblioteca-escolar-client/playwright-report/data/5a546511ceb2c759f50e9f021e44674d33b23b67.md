# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: emprestimos.spec.js >> Gerenciamento de Empréstimos (E2E) >> deve permitir adicionar um novo empréstimo e encontrá-lo na lista
- Location: e2e\emprestimos.spec.js:27:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.selectOption: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('select[name="livro_id"]')
    - locator resolved to <select required="" name="livro_id">…</select>
  - attempting select option action
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
    - waiting 20ms
    2 × waiting for element to be visible and enabled
      - did not find some options
    - retrying select option action
      - waiting 100ms
    58 × waiting for element to be visible and enabled
       - did not find some options
     - retrying select option action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - heading [level=1]
      - generic [ref=e6]:
        - generic "admin@sistema.com" [ref=e7]: Administrador
        - button "Alternar tema" [ref=e8]:
          - img [ref=e9]
        - button "Sair" [ref=e11] [cursor=pointer]:
          - img [ref=e12]
  - generic [ref=e16]:
    - generic [ref=e17]:
      - heading "Empréstimos" [level=2] [ref=e18]
      - paragraph [ref=e19]: Gestão de retiradas e devoluções
    - generic [ref=e20]:
      - img [ref=e21]
      - generic [ref=e23]: Erro ao carregar dados.
      - button [ref=e24]:
        - img [ref=e25]
    - paragraph [ref=e29]: Nenhum registro encontrado.
    - button [active] [ref=e30]:
      - img [ref=e31]
    - generic [ref=e33]:
      - generic [ref=e34]:
        - heading "Novo Empréstimo" [level=3] [ref=e35]
        - button [ref=e36]:
          - img [ref=e37]
      - generic [ref=e40]:
        - generic [ref=e41]:
          - generic [ref=e42]:
            - generic [ref=e43]: Livro
            - combobox [ref=e44]:
              - option "Selecione um livro" [selected]
          - generic [ref=e45]:
            - generic [ref=e46]: Usuário
            - combobox [ref=e47]:
              - option "Selecione o aluno" [selected]
          - generic [ref=e48]:
            - generic [ref=e49]: Data de Devolução Prevista
            - textbox [ref=e50]
        - generic [ref=e51]:
          - button "Cancelar" [ref=e52] [cursor=pointer]
          - button "Confirmar" [ref=e53] [cursor=pointer]
  - navigation "Navegação principal" [ref=e54]:
    - generic [ref=e55]:
      - link "Livros" [ref=e56] [cursor=pointer]:
        - /url: /livros
        - img [ref=e58]
        - generic [ref=e60]: Livros
      - link "Empréstimos" [ref=e61] [cursor=pointer]:
        - /url: /emprestimos
        - img [ref=e63]
        - generic [ref=e66]: Empréstimos
      - link "Início" [ref=e67] [cursor=pointer]:
        - /url: /
        - img [ref=e69]
        - generic [ref=e72]: Início
      - link "Multas" [ref=e73] [cursor=pointer]:
        - /url: /multas
        - img [ref=e75]
        - generic [ref=e77]: Multas
      - link "Equipe" [ref=e78] [cursor=pointer]:
        - /url: /usuarios
        - img [ref=e80]
        - generic [ref=e85]: Equipe
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Gerenciamento de Empréstimos (E2E)", () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // 1. Vai para a página inicial (Login)
  6   |     await page.goto("/");
  7   | 
  8   |     // 2. Realiza o login (usando os dados do nosso mock de admin)
  9   |     await page.fill('input[type="email"]', "admin@sistema.com");
  10  |     await page.fill('input[type="password"]', "123456");
  11  |     await page.click('button[type="submit"]');
  12  | 
  13  |     // 3. Espera chegar no Dashboard (garante que logou)
  14  |     await expect(page).toHaveURL(/\/dashboard|$/);
  15  |   });
  16  | 
  17  |   test("deve navegar até a tela de empréstimos e listar o acervo", async ({
  18  |     page,
  19  |   }) => {
  20  |     // 1. Navega para empréstimos via URL (Dispara Promise.all internos do carregar)
  21  |     await page.goto("/emprestimos");
  22  | 
  23  |     // 2. Verifica se o título h2 da página está correto conforme o DOM do componente
  24  |     await expect(page.locator("h2")).toContainText("Empréstimos");
  25  |   });
  26  | 
  27  |   test("deve permitir adicionar um novo empréstimo e encontrá-lo na lista", async ({
  28  |     page,
  29  |   }) => {
  30  |     await page.goto("/emprestimos");
  31  | 
  32  |     // 1. Clicar no FAB (+) para abrir o modal
  33  |     await page.locator(".fab").click();
  34  |     await expect(page.locator(".modal")).toBeVisible();
  35  | 
  36  |     // 2. Preencher os campos do formulário (selects e input date obrigatórios do handleSalvar)
> 37  |     await page.locator('select[name="livro_id"]').selectOption({ index: 1 });
      |                                                   ^ Error: locator.selectOption: Test timeout of 30000ms exceeded.
  38  |     await page.locator('select[name="usuario_id"]').selectOption({ index: 1 });
  39  |     await page.fill('input[name="data_devolucao_prevista"]', "2026-12-31");
  40  | 
  41  |     // intercepta a chamada de criação: emprestimoService.criarEmprestimo
  42  |     const responsePromise = page.waitForResponse(
  43  |       (resp) =>
  44  |         resp.url().includes("/emprestimos") &&
  45  |         resp.request().method() === "POST" &&
  46  |         resp.status() >= 200 &&
  47  |         resp.status() < 300,
  48  |     );
  49  | 
  50  |     // 3. Salvar formulário
  51  |     await page.click('button[type="submit"]');
  52  | 
  53  |     await responsePromise;
  54  | 
  55  |     // Garante o fechamento do modal e verifica se o card do novo empréstimo renderizou na lista
  56  |     await expect(page.locator(".modal")).not.toBeVisible();
  57  |     await expect(page.locator(".list-card").first()).toBeVisible();
  58  |   });
  59  | 
  60  |   test("deve fechar o modal ao clicar no botão cancelar", async ({ page }) => {
  61  |     await page.goto("/emprestimos");
  62  | 
  63  |     await page.locator(".fab").click();
  64  |     await expect(page.locator(".modal")).toBeVisible();
  65  | 
  66  |     await page.click('button:has-text("Cancelar")');
  67  |     await expect(page.locator(".modal")).not.toBeVisible();
  68  |   });
  69  | 
  70  |   test("deve permitir registrar a devolução de um livro", async ({ page }) => {
  71  |     await page.goto("/emprestimos");
  72  |     await page.waitForSelector(".list-card");
  73  | 
  74  |     // Encontra o primeiro card que possui o botão de ação "Devolver" ativo
  75  |     const cardAtivo = page
  76  |       .locator(".list-card", {
  77  |         has: page.locator('button:has-text("Devolver")'),
  78  |       })
  79  |       .first();
  80  |     await cardAtivo.locator('button:has-text("Devolver")').click();
  81  | 
  82  |     // O botão dispara handleDevolucao que abre o modal de confirmação
  83  |     await expect(page.locator(".modal")).toBeVisible();
  84  | 
  85  |     // intercepta o método: emprestimoService.registrarDevolucao (PUT em /emprestimos/:id)
  86  |     const responsePromise = page.waitForResponse(
  87  |       (resp) =>
  88  |         resp.url().includes("/emprestimos/") &&
  89  |         resp.request().method() === "PUT" &&
  90  |         resp.status() >= 200 &&
  91  |         resp.status() < 300,
  92  |     );
  93  | 
  94  |     // Clica no botão Confirmar contido no rodapé do modal de confirmação
  95  |     await page.locator('.modal-footer button:has-text("Confirmar")').click();
  96  |     await responsePromise;
  97  | 
  98  |     await expect(page.locator(".modal")).not.toBeVisible();
  99  |   });
  100 | 
  101 |   test("deve permitir editar empréstimo", async ({ page }) => {
  102 |     await page.goto("/emprestimos");
  103 |     await page.waitForSelector(".list-card");
  104 | 
  105 |     const primeiroEmprestimo = page.locator(".list-card").first();
  106 |     await primeiroEmprestimo.locator('button:has-text("Editar")').click();
  107 |     await expect(page.locator(".modal")).toBeVisible();
  108 | 
  109 |     // Modifica o campo de data de devolução prevista
  110 |     const inputData = page.locator('input[name="data_devolucao_prevista"]');
  111 |     await inputData.click();
  112 |     await inputData.fill("2026-12-25");
  113 | 
  114 |     // intercepta o método: emprestimoService.atualizarEmprestimo (PUT em /emprestimos/:id)
  115 |     const responsePromise = page.waitForResponse(
  116 |       (resp) =>
  117 |         resp.url().includes("/emprestimos/") &&
  118 |         resp.request().method() === "PUT" &&
  119 |         resp.status() >= 200 &&
  120 |         resp.status() < 300,
  121 |     );
  122 | 
  123 |     await page.locator('.modal-footer button:has-text("Confirmar")').click();
  124 |     await responsePromise;
  125 | 
  126 |     await expect(page.locator(".modal")).not.toBeVisible();
  127 |   });
  128 | 
  129 |   test("deve permitir excluir um empréstimo", async ({ page }) => {
  130 |     await page.goto("/emprestimos");
  131 |     await page.waitForSelector(".list-card");
  132 | 
  133 |     const primeiroEmprestimo = page.locator(".list-card").first();
  134 | 
  135 |     // Captura o título do livro associado ao card para verificar a exclusão no fim
  136 |     const tituloOriginal = await primeiroEmprestimo
  137 |       .locator(".list-card__title")
```