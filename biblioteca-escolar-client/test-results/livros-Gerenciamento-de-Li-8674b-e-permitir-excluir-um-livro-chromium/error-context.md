# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: livros.spec.js >> Gerenciamento de Livros (E2E) >> deve permitir excluir um livro
- Location: e2e\livros.spec.js:67:2

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.list-card').filter({ hasText: 'Livro_Del_1781612318951' }).first().locator('button:has-text("Excluir")')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - heading [level=1]
      - generic [ref=e6]:
        - button "Alternar tema" [ref=e7] [cursor=pointer]:
          - img [ref=e8]
        - button "Sair" [ref=e10] [cursor=pointer]:
          - img [ref=e11]
  - generic [ref=e15]:
    - generic [ref=e16]:
      - heading "Acervo de Livros" [level=2] [ref=e17]
      - paragraph [ref=e18]: Gerenciamento completo da biblioteca
    - generic [ref=e19]:
      - textbox "Buscar por ID..." [active] [ref=e21]: "192"
      - button [ref=e22] [cursor=pointer]:
        - img [ref=e23]
    - generic [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]:
          - generic [ref=e29]:
            - heading "Clean Code - Editado - Editado - Editado - Editado - Editado - Editado" [level=3] [ref=e30]
            - generic [ref=e31]:
              - img [ref=e32]
              - text: Martin Code
          - generic [ref=e35]: "#169"
        - generic [ref=e37]: Disponível para empréstimo em breve.
        - generic [ref=e38]:
          - button "Editar" [ref=e39] [cursor=pointer]:
            - img [ref=e40]
            - text: Editar
          - button "Excluir" [ref=e42] [cursor=pointer]:
            - img [ref=e43]
            - text: Excluir
      - generic [ref=e46]:
        - generic [ref=e47]:
          - generic [ref=e48]:
            - heading "oi" [level=3] [ref=e49]
            - generic [ref=e50]:
              - img [ref=e51]
              - text: oi
          - generic [ref=e54]: "#170"
        - generic [ref=e56]: Disponível para empréstimo em breve.
        - generic [ref=e57]:
          - button "Editar" [ref=e58] [cursor=pointer]:
            - img [ref=e59]
            - text: Editar
          - button "Excluir" [ref=e61] [cursor=pointer]:
            - img [ref=e62]
            - text: Excluir
      - generic [ref=e65]:
        - generic [ref=e66]:
          - generic [ref=e67]:
            - heading "Livro E2E 198" [level=3] [ref=e68]
            - generic [ref=e69]:
              - img [ref=e70]
              - text: Automação Playwright
          - generic [ref=e73]: "#171"
        - generic [ref=e75]: Disponível para empréstimo em breve.
        - generic [ref=e76]:
          - button "Editar" [ref=e77] [cursor=pointer]:
            - img [ref=e78]
            - text: Editar
          - button "Excluir" [ref=e80] [cursor=pointer]:
            - img [ref=e81]
            - text: Excluir
      - generic [ref=e84]:
        - generic [ref=e85]:
          - generic [ref=e86]:
            - heading "testeeeee" [level=3] [ref=e87]
            - generic [ref=e88]:
              - img [ref=e89]
              - text: teste
          - generic [ref=e92]: "#173"
        - generic [ref=e94]: Disponível para empréstimo em breve.
        - generic [ref=e95]:
          - button "Editar" [ref=e96] [cursor=pointer]:
            - img [ref=e97]
            - text: Editar
          - button "Excluir" [ref=e99] [cursor=pointer]:
            - img [ref=e100]
            - text: Excluir
      - generic [ref=e103]:
        - generic [ref=e104]:
          - generic [ref=e105]:
            - heading "teste" [level=3] [ref=e106]
            - generic [ref=e107]:
              - img [ref=e108]
              - text: teste
          - generic [ref=e111]: "#174"
        - generic [ref=e113]: Disponível para empréstimo em breve.
        - generic [ref=e114]:
          - button "Editar" [ref=e115] [cursor=pointer]:
            - img [ref=e116]
            - text: Editar
          - button "Excluir" [ref=e118] [cursor=pointer]:
            - img [ref=e119]
            - text: Excluir
    - generic [ref=e122]:
      - button [disabled] [ref=e123] [cursor=pointer]:
        - img [ref=e124]
      - generic [ref=e126]: Página 1 de 4
      - button [ref=e127] [cursor=pointer]:
        - img [ref=e128]
    - button [ref=e130] [cursor=pointer]:
      - img [ref=e131]
  - navigation "Navegação principal" [ref=e132]:
    - generic [ref=e133]:
      - link "Livros" [ref=e134] [cursor=pointer]:
        - /url: /livros
        - img [ref=e136]
        - generic [ref=e138]: Livros
      - link "Empréstimos" [ref=e139] [cursor=pointer]:
        - /url: /emprestimos
        - img [ref=e141]
        - generic [ref=e144]: Empréstimos
      - link "Início" [ref=e145] [cursor=pointer]:
        - /url: /
        - img [ref=e147]
        - generic [ref=e150]: Início
      - link "Multas" [ref=e151] [cursor=pointer]:
        - /url: /multas
        - img [ref=e153]
        - generic [ref=e155]: Multas
      - link "Equipe" [ref=e156] [cursor=pointer]:
        - /url: /usuarios
        - img [ref=e158]
        - generic [ref=e163]: Equipe
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Gerenciamento de Livros (E2E)", () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto("/");
  6   | 
  7   |     await page.fill('input[type="email"]', "admin@sistema.com");
  8   |     await page.fill('input[type="password"]', "123456");
  9   |     await page.click('button[type="submit"]');
  10  | 
  11  |     await expect(page).toHaveURL(/\/dashboard|$/);
  12  |   });
  13  | 
  14  |   test("deve navegar até a tela de livros e listar o acervo", async ({
  15  |     page,
  16  |   }) => {
  17  |     await page.goto("/livros");
  18  | 
  19  |     await expect(page.locator("h2")).toContainText("Acervo de Livros");
  20  |   });
  21  | 
  22  |   test("deve permitir adicionar um novo livro e encontrá-lo na lista", async ({
  23  |     page,
  24  |   }) => {
  25  |     const tituloAleatorio = `Livro E2E ${Math.floor(Math.random() * 1000)}`;
  26  | 
  27  |     await page.goto("/livros");
  28  | 
  29  |     await page.locator(".fab").click();
  30  |     await expect(page.locator(".modal")).toBeVisible();
  31  | 
  32  |     await page.fill('input[name="titulo"]', tituloAleatorio);
  33  |     await page.fill('input[name="autor"]', "Automação Playwright");
  34  | 
  35  |     const responsePromise = page.waitForResponse(
  36  |       (resp) =>
  37  |         resp.url().includes("/livros") &&
  38  |         resp.request().method() === "POST" &&
  39  |         resp.status() >= 200 &&
  40  |         resp.status() < 300,
  41  |     );
  42  | 
  43  |     await page.click('button[type="submit"]');
  44  | 
  45  |     const response = await responsePromise;
  46  |     const novoLivro = await response.json();
  47  | 
  48  |     await page.fill(
  49  |       'input[placeholder = "Buscar por ID..."]',
  50  |       String(novoLivro.id),
  51  |     );
  52  |     await page.keyboard.press("Enter");
  53  | 
  54  |     await expect(page.getByText(tituloAleatorio)).toBeVisible();
  55  |   });
  56  | 
  57  |   test("deve fechar o modal ao clicar no botão cancelar", async ({ page }) => {
  58  |     await page.goto("/livros");
  59  | 
  60  |     await page.locator(".fab").click();
  61  |     await expect(page.locator(".modal")).toBeVisible();
  62  | 
  63  |     await page.click('button:has-text("Cancelar")');
  64  |     await expect(page.locator(".modal")).not.toBeVisible();
  65  |   });
  66  | 
  67  |  test("deve permitir excluir um livro", async ({ page }) => {
  68  |     await page.goto("/livros");
  69  | 
  70  |     const tituloUnico = `Livro_Del_${Date.now()}`;
  71  |     await page.locator(".fab").click();
  72  |     await page.fill('input[name="titulo"]', tituloUnico);
  73  |     await page.fill('input[name="autor"]', "Suporte E2E");
  74  | 
  75  |     const cadastrarPromise = page.waitForResponse(
  76  |       (resp) => resp.url().includes("/livros") && resp.request().method() === "POST"
  77  |     );
  78  |     await page.click('button[type="submit"]');
  79  |     const responseCadastro = await cadastrarPromise;
  80  |     const livroCriado = await responseCadastro.json();
  81  | 
  82  |     await page.fill('input[placeholder = "Buscar por ID..."]', String(livroCriado.id));
  83  |     await page.keyboard.press("Enter");
  84  |     await page.waitForTimeout(500);
  85  | 
  86  |     const cardLivro = page.locator(".list-card", { hasText: tituloUnico }).first();
> 87  |     await cardLivro.locator('button:has-text("Excluir")').click();
      |                                                           ^ Error: locator.click: Test timeout of 30000ms exceeded.
  88  |     await expect(page.locator(".modal")).toBeVisible();
  89  | 
  90  |     const deletePromise = page.waitForResponse(
  91  |       (resp) => resp.url().includes("/livros/") && resp.request().method() === "DELETE"
  92  |     );
  93  | 
  94  |     await page.click('.modal button:has-text("Excluir")', { force: true });
  95  |     await deletePromise;
  96  | 
  97  |     await expect(page.locator(".modal")).not.toBeVisible();
  98  |     await expect(page.locator(".list-card", { hasText: tituloUnico })).not.toBeVisible();
  99  |   });
  100 | 
  101 |   test("deve permitir editar livro", async ({ page }) => {
  102 |     await page.goto("/livros");
  103 |     await page.waitForSelector(".list-card");
  104 | 
  105 |     const primeiroLivro = page.locator(".list-card").first();
  106 |     const tituloOriginal = await primeiroLivro
  107 |       .locator(".list-card__title")
  108 |       .innerText();
  109 | 
  110 |     await primeiroLivro.locator('button:has-text("Editar")').click();
  111 |     await expect(page.locator(".modal")).toBeVisible();
  112 | 
  113 |     const inputTitulo = page.locator('input[name="titulo"]');
  114 |     await inputTitulo.click();
  115 |     await inputTitulo.fill(`${tituloOriginal} - Editado`);
  116 | 
  117 |     const responsePromise = page.waitForResponse(
  118 |       (resp) =>
  119 |         resp.url().includes("/livros/") &&
  120 |         resp.request().method() === "PUT" &&
  121 |         resp.status() >= 200 &&
  122 |         resp.status() < 300,
  123 |     );
  124 | 
  125 |     await page.getByRole("button", { name: "Confirmar" }).click();
  126 |     await responsePromise;
  127 | 
  128 |     await expect(page.locator(".modal")).not.toBeVisible();
  129 |     await expect(
  130 |       page.locator(".list-card", { hasText: tituloOriginal + " - Editado" }),
  131 |     ).toBeVisible();
  132 |   });
  133 | });
  134 | 
```