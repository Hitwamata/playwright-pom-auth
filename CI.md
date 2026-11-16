# CI (Continuous Integration)

O pipeline está em [.github/workflows/playwright.yml](.github/workflows/playwright.yml) e corre no GitHub Actions.

## Quando corre

- Em cada `push` para `main`
- Em cada pull request para `main`
- Manualmente, em **Actions → Testes Playwright → Run workflow** (`workflow_dispatch`)

## Etapas

| # | Etapa | Descrição |
| --- | --- | --- |
| 1 | Checkout | Obtém o código do repositório |
| 2 | Setup Node 22 | Instala o Node com cache do `npm` |
| 3 | `npm ci` | Instala as dependências exatas do `package-lock.json` |
| 4 | `npm run typecheck` | Falha cedo se houver erros de TypeScript |
| 5 | Instalar Chromium | `npx playwright install --with-deps chromium` |
| 6 | Correr testes | `npx playwright test` |
| 7 | Publicar relatório | Envia `playwright-report/` como artefacto (14 dias), mesmo quando os testes falham |

O job tem um limite de 20 minutos.

## Comportamento no CI

Definido no [playwright.config.ts](playwright.config.ts) através da variável `CI`:

- `retries: 2` — um teste instável tem mais duas tentativas.
- `workers: 1` — execução em série, mais estável em máquinas partilhadas.
- `forbidOnly: true` — o pipeline falha se ficar um `test.only` no código.
- `trace: 'on-first-retry'` — o trace é gravado na primeira repetição, para investigar falhas.

## Secrets

Em **Settings → Secrets and variables → Actions** podem ser definidos:

| Secret | Descrição |
| --- | --- |
| `UTILIZADOR` | Utilizador do login |
| `PALAVRA_PASSE` | Palavra-passe do login |

Se não existirem, o pipeline usa as credenciais públicas do Sauce Demo.

## Ver o relatório de uma execução

1. Abra a execução em **Actions**.
2. Em **Artifacts**, descarregue `playwright-report`.
3. Extraia o ZIP e corra `npx playwright show-report <pasta-extraída>`.

Os traces anexados podem ser abertos no próprio relatório ou em [trace.playwright.dev](https://trace.playwright.dev).
