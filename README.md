# Playwright POM Auth — Automação de Testes E2E

![Testes Playwright](../../actions/workflows/playwright.yml/badge.svg)

Framework de automação de testes E2E com **Playwright** e **TypeScript**, organizado em **Page Object Model (POM)** e com **autenticação reutilizável**: o login é feito uma única vez e a sessão é partilhada por todos os testes.

A aplicação testada é o [Sauce Demo](https://www.saucedemo.com), uma loja pública de demonstração.

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação](#instalação)
- [Execução](#execução)
- [Arquitetura](#arquitetura)
- [Como funciona a autenticação](#como-funciona-a-autenticação)
- [Cobertura de Testes](#cobertura-de-testes)
- [Boas Práticas](#boas-práticas)
- [CI (Continuous Integration)](#ci-continuous-integration)
- [Autor](#autor)

## Tecnologias Utilizadas

| Ferramenta                          | Utilização                                             |
| ----------------------------------- | -------------------------------------------------------- |
| [Playwright](https://playwright.dev) | Execução dos testes E2E, relatórios, traces e vídeos |
| TypeScript                          | Tipagem forte nas Page Objects, dados e fixtures         |
| Node.js 22+                         | Ambiente de execução                                   |
| dotenv                              | Leitura das credenciais e da URL a partir do `.env`    |
| Docker                              | Execução isolada, com a imagem oficial do Playwright   |
| GitHub Actions                      | Pipeline de CI em cada push e pull request               |

## Instalação

Siga o **[INSTALL.md](INSTALL.md)** para requisitos e o passo a passo. Versão curta:

```bash
npm install
npx playwright install chromium
cp .env.example .env
```

## Execução

| Comando                                            | O que faz                                                      |
| -------------------------------------------------- | -------------------------------------------------------------- |
| `npm test`                                       | Corre todos os testes                                          |
| `npm run test:smoke`                             | Corre só os testes marcados com `@smoke` (fluxos críticos) |
| `npm run test:headed`                            | Corre com o browser visível                                   |
| `npm run test:ui`                                | Abre o modo interativo do Playwright                           |
| `npm run test:debug`                             | Corre passo a passo com o Playwright Inspector                 |
| `npm run report`                                 | Abre o relatório HTML da última execução                   |
| `npm run typecheck`                              | Verifica os tipos TypeScript sem correr testes                 |
| `npm run docker:build` / `npm run docker:test` | Constrói a imagem e corre os testes em Docker                 |

Para correr um único ficheiro ou projeto:

```bash
npx playwright test tests/checkout
npx playwright test --project=sem-sessao
```

### Variáveis de ambiente

| Variável         | Descrição            | Padrão                       |
| ----------------- | ---------------------- | ----------------------------- |
| `BASE_URL`      | URL da aplicação     | `https://www.saucedemo.com` |
| `UTILIZADOR`    | Utilizador do login    | `standard_user`             |
| `PALAVRA_PASSE` | Palavra-passe do login | `secret_sauce`              |

O `.env` e a pasta `.auth/` estão no `.gitignore`, para que credenciais e sessões nunca vão para o repositório. No CI são definidas como *secrets* do GitHub.

## Arquitetura

```
playwright-pom-auth/
├── .github/workflows/playwright.yml   # Pipeline de CI (GitHub Actions)
├── src/
│   ├── config/sessao.ts               # Caminho do ficheiro de sessão
│   ├── data/
│   │   ├── utilizadores.ts            # Credenciais (via .env)
│   │   ├── produtos.ts                # Catálogo de produtos e cálculo de subtotal
│   │   └── checkout.ts                # Dados do comprador
│   ├── fixtures/paginas.fixture.ts    # Injeção das Page Objects nos testes
│   └── pages/
│       ├── BasePage.ts                # Cabeçalho comum (carrinho, menu, logout)
│       ├── LoginPage.ts
│       ├── InventarioPage.ts
│       ├── CarrinhoPage.ts
│       └── CheckoutPage.ts
├── tests/
│   ├── auth/auth.setup.ts             # Login único + gravação da sessão
│   ├── login/                         # Ecrã de login (sem sessão)
│   ├── inventario/                    # Lista de produtos e ordenação
│   ├── carrinho/                      # Gestão do carrinho
│   ├── checkout/                      # Fluxo de compra E2E
│   └── sessao/                        # Logout e proteção de rotas
├── .env.example                       # Modelo das variáveis de ambiente
├── Dockerfile                         # Execução em contentor
├── INSTALL.md                         # Guia de instalação
├── CI.md                              # Documentação do pipeline
├── playwright.config.ts
└── tsconfig.json
```

### Princípios da Arquitetura

- **Page Objects** — cada página tem a sua classe, com localizadores `readonly` declarados no construtor e ações/validações em métodos próprios. O cabeçalho comum vive na `BasePage`.
- **Fixtures** — as Page Objects são injetadas nos testes (`async ({ inventarioPage }) => …`), sem `new` espalhados pelo código.
- **Dados separados dos testes** — credenciais, produtos e dados de checkout ficam em `src/data/`. O subtotal esperado é calculado a partir do catálogo, em vez de estar fixo no teste.
- **Steps legíveis** — cada ação está dentro de `test.step(..., { box: true })`, por isso o relatório HTML mostra passos com nomes claros e aponta o erro para a linha do teste.
- **Evidências automáticas** — trace no primeiro retry, screenshot e vídeo só quando um teste falha.

## Como funciona a autenticação

```
          ┌──────────────┐   guarda sessão   ┌─────────────────────────┐
          │ projeto      │ ────────────────▶ │ .auth/utilizador.json   │
          │ "setup"      │                   └───────────┬─────────────┘
          └──────────────┘                               │ storageState
                                                         ▼
 ┌──────────────────────┐                   ┌─────────────────────────┐
 │ projeto "sem-sessao" │                   │ projeto "autenticado"   │
 │ tests/login/*        │                   │ inventário, carrinho,   │
 └──────────────────────┘                   │ checkout, sessão        │
                                            └─────────────────────────┘
```

1. `setup` corre primeiro (é dependência de `autenticado`) e faz login com as credenciais do `.env`.
2. `autenticado` carrega a sessão gravada e vai direto às páginas internas.
3. `sem-sessao` corre os testes do próprio ecrã de login, partindo de um browser limpo.

Cada teste tem o seu próprio contexto de browser, por isso um logout em `tests/sessao/` não invalida a sessão dos outros testes.

## Cobertura de Testes

| Área       | Cenários                                                                                                                       |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Login       | Login válido `@smoke`, palavra-passe inválida, utilizador bloqueado, utilizador em falta                                    |
| Inventário | Abre já autenticado `@smoke`, ordenação por preço (crescente/decrescente) e por nome (Z→A), adicionar e remover produtos |
| Carrinho    | Carrinho vazio, remover produto no carrinho, manter produtos ao voltar à lista                                                 |
| Checkout    | Compra de ponta a ponta com validação do subtotal `@smoke`, primeiro nome obrigatório, código postal obrigatório         |
| Sessão     | Logout `@smoke`, acesso bloqueado a páginas internas depois do logout                                                        |

## Boas Práticas

Práticas seguidas neste projeto e recomendadas para novos testes.

### 1. Planeamento e preparação

Antes de automatizar um cenário:

- **Definition of Ready (DoR)**: confirme que o cenário cumpre os critérios de prontidão.
- **Objetivo claro**: cada teste valida um comportamento, descrito no título (`deve …`).
- **Fluxos críticos primeiro**: os caminhos principais recebem a tag `@smoke`.
- **Dependências**: identifique os dados e pré-condições necessários e coloque-os em `src/data/`.

### 2. Mapeamento de elementos

- **Localizadores semânticos e estáveis**: prefira `getByTestId()` (o atributo `data-test` está configurado no `playwright.config.ts`), `getByRole()` e `getByLabel()`.
- **Não misture inglês e português** nos nomes: `campoUtilizador`, e não `inputUtilizador`.
- **camelCase e nomes descritivos**: `botaoEntrar`, `campoPalavraPasse`, `contadorCarrinho`.
- **Evite seletores frágeis**: nada de CSS/XPath dependentes da estrutura do DOM ou de índices.

```typescript
// Bom
this.campoUtilizador = page.getByTestId('username');
this.botaoMenu = page.getByRole('button', { name: 'Open Menu' });

// Evitar
this.campoUtilizador = page.locator('div > form > input:nth-child(1)');
this.botaoMenu = page.locator('#react-burger-menu-btn');
```

### 3. Page Object Model

- **Encapsule a interação**: os testes chamam métodos (`fazerLogin`, `adicionarAoCarrinho`), nunca localizadores soltos.
- **Validações dentro da Page Object**: métodos `validar…` mantêm as asserções reutilizáveis.
- **Steps com nome**: envolva cada ação num `test.step` para o relatório ficar legível.
- **Tipagem forte**: use tipos como `DadosCheckout` e `OrdenacaoProdutos`.

```typescript
// src/pages/LoginPage.ts
export class LoginPage {
  readonly campoUtilizador: Locator;
  readonly campoPalavraPasse: Locator;
  readonly botaoEntrar: Locator;

  constructor(readonly page: Page) {
    this.campoUtilizador = page.getByTestId('username');
    this.campoPalavraPasse = page.getByTestId('password');
    this.botaoEntrar = page.getByTestId('login-button');
  }

  async fazerLogin(utilizador: string, palavraPasse: string) {
    await test.step(`Fazer login como "${utilizador}"`, async () => {
      await this.campoUtilizador.fill(utilizador);
      await this.campoPalavraPasse.fill(palavraPasse);
      await this.botaoEntrar.click();
    }, { box: true });
  }
}
```

### 4. Independência e isolamento

- **Sem dependências entre testes**: cada teste corre sozinho e em qualquer ordem (`fullyParallel: true`).
- **Estado inicial consistente**: use `beforeEach` para abrir a página de partida.
- **Login por `storageState`**, não pela UI em cada teste, exceto nos testes do próprio login.

### 5. Asserções e esperas

```typescript
// Use asserções com auto-waiting
await expect(this.titulo).toHaveText('Products');

// Evite esperas fixas
await page.waitForTimeout(3000);
```

Use `expect.soft` quando quiser ver todas as falhas de uma verificação em lista (por exemplo, vários produtos no carrinho) sem parar no primeiro erro.

### 6. Configuração de execução

```typescript
// playwright.config.ts
export default defineConfig({
  fullyParallel: true,
  forbidOnly: !!process.env.CI,          // impede test.only esquecidos no CI
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
});
```

### Adicionar um novo teste

1. Crie ou estenda a Page Object em `src/pages/` (localizadores + métodos com `test.step`).
2. Se for uma página nova, registe-a em `src/fixtures/paginas.fixture.ts`.
3. Coloque os dados em `src/data/`.
4. Escreva o teste em `tests/<área>/<área>.spec.ts`, importando `test` da fixture.
5. Corra `npm run typecheck` e `npm test` antes do commit.

## CI (Continuous Integration)

Veja o **[CI.md](CI.md)** para a documentação do pipeline do GitHub Actions.

## Autor

**Eliazel Hitwamata** — QA Automation Engineer · Luanda, Angola
[LinkedIn](https://www.linkedin.com/in/eliazelhitwamata-29a91a334)

## Happy Testing! 🎭

Este documento deve ser revisto periodicamente e atualizado à medida que o projeto evolui.
