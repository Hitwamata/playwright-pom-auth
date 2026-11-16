# Instalação

## Requisitos

- [Node.js](https://nodejs.org) 22 ou superior (inclui o `npm`)
- [Git](https://git-scm.com)
- Opcional: [Docker](https://www.docker.com) para correr os testes num contentor
- Recomendado: VS Code com a extensão [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

## Passo a passo

1. Clonar o repositório:

   ```bash
   git clone <url-do-repositorio>
   cd playwright-pom-auth
   ```

2. Instalar as dependências:

   ```bash
   npm install
   ```

3. Instalar o browser usado nos testes:

   ```bash
   npx playwright install chromium
   ```

   No Linux, use `npx playwright install --with-deps chromium` para instalar também as bibliotecas do sistema.

4. Criar o ficheiro de ambiente:

   ```bash
   cp .env.example .env
   ```

   No Windows (PowerShell): `Copy-Item .env.example .env`.
   Os valores por omissão são as credenciais públicas do Sauce Demo e funcionam sem alterações.

5. Verificar a instalação:

   ```bash
   npm run typecheck
   npm run test:smoke
   ```

## Com Docker

A imagem usa `mcr.microsoft.com/playwright`, que já traz Node e os browsers.

```bash
npm run docker:build
npm run docker:test
```

Para guardar o relatório HTML fora do contentor, monte a pasta como volume:

```bash
# Linux / macOS / Git Bash
docker run --rm -v "$(pwd)/playwright-report:/app/playwright-report" playwright-pom-auth

# PowerShell
docker run --rm -v "${PWD}/playwright-report:/app/playwright-report" playwright-pom-auth
```

Ao atualizar o `@playwright/test` no `package.json`, atualize também a versão da imagem no `Dockerfile`.

## Problemas comuns

| Sintoma | Solução |
| --- | --- |
| `Executable doesn't exist` | Os browsers não estão instalados: `npx playwright install chromium` |
| `npx tsc` instala um pacote chamado `tsc` | As dependências não estão instaladas: corra `npm install` primeiro |
| Testes autenticados voltam ao login | Apague a pasta `.auth/` e corra de novo; o projeto `setup` recria a sessão |
