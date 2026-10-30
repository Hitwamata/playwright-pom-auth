# Playwright + TypeScript · Page Object Model · Login automático

![Testes Playwright](../../actions/workflows/playwright.yml/badge.svg)

Projeto de demonstração de automação de testes E2E com **Playwright** e **TypeScript**, organizado com **Page Object Model (POM)** e **autenticação reutilizável**: o login é feito uma única vez e a sessão é partilhada por todos os testes.

A aplicação testada é o [Sauce Demo](https://www.saucedemo.com), uma loja pública de demonstração.

## Destaques

- **Page Object Model** — cada página tem a sua classe, com localizadores `readonly` declarados no construtor e ações/validações em métodos próprios.
- **Login automático (storageState)** — um projeto `setup` faz login pela UI, guarda cookies e `localStorage` em `.auth/utilizador.json`, e os testes seguintes já começam autenticados. Menos tempo de execução, menos repetição.
- **Fixtures** — as Page Objects são injetadas nos testes (`async ({ inventarioPage }) => …`), sem `new` espalhados pelo código.
- **Relatórios legíveis** — cada ação está dentro de `test.step(..., { box: true })`, por isso o relatório HTML mostra passos com nomes claros e aponta o erro para a linha do teste.
- **Localizadores estáveis** — `getByTestId` e `getByRole`, sem `waitForTimeout` nem seletores por índice.
- **CI com GitHub Actions** — os testes correm em cada push e o relatório fica disponível como artefacto.

## Estrutura

```
├── .github/workflows/playwright.yml   # Pipeline de CI
├── src/
│   ├── config/sessao.ts               # Caminho do ficheiro de sessão
│   ├── data/utilizadores.ts           # Credenciais (via .env) e massa de dados
│   ├── fixtures/paginas.fixture.ts    # Injeção das Page Objects
│   └── pages/
│       ├── BasePage.ts                # Cabeçalho comum (carrinho, menu, logout)
│       ├── LoginPage.ts
│       ├── InventarioPage.ts
│       ├── CarrinhoPage.ts
│       └── CheckoutPage.ts
├── tests/
│   ├── auth/auth.setup.ts             # Login único + gravação da sessão
│   ├── login/login.spec.ts            # Testes do login (sem sessão)
│   ├── inventario/inventario.spec.ts  # Testes autenticados
│   └── checkout/checkout.spec.ts      # Fluxo de compra E2E
└── playwright.config.ts
```

## Como funciona a autenticação

```
          ┌──────────────┐   guarda sessão   ┌─────────────────────────┐
          │ projeto      │ ────────────────▶ │ .auth/utilizador.json   │
          │ "setup"      │                   └───────────┬─────────────┘
          └──────────────┘                               │ storageState
                                                         ▼
 ┌──────────────────────┐                   ┌─────────────────────────┐
 │ projeto "sem-sessao" │                   │ projeto "autenticado"   │
 │ tests/login/*        │                   │ inventário, checkout…   │
 └──────────────────────┘                   └─────────────────────────┘
```

1. `setup` corre primeiro (é dependência de `autenticado`) e faz login com as credenciais do `.env`.
2. `autenticado` carrega a sessão gravada e vai direto às páginas internas.
3. `sem-sessao` corre os testes do próprio ecrã de login, partindo de um browser limpo.

## Como correr

```bash
npm install
npx playwright install chromium
cp .env.example .env

npm test              # todos os testes
npm run test:headed   # com o browser visível
npm run test:ui       # modo interativo
npm run report        # abrir o relatório HTML
```

## Variáveis de ambiente

| Variável        | Descrição                    | Padrão                        |
| --------------- | ---------------------------- | ----------------------------- |
| `BASE_URL`      | URL da aplicação             | `https://www.saucedemo.com`   |
| `UTILIZADOR`    | Utilizador do login          | `standard_user`               |
| `PALAVRA_PASSE` | Palavra-passe do login       | `secret_sauce`                |

O `.env` e a pasta `.auth/` estão no `.gitignore`, para que credenciais e sessões nunca vão para o repositório. No CI, podem ser definidas como *secrets* do GitHub.

## Autor

**Eliazel Hitwamata** — QA Automation Engineer · Luanda, Angola
[LinkedIn](https://www.linkedin.com/in/eliazelhitwamata-29a91a334)
