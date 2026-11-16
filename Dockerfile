# Imagem oficial do Playwright: já traz Node e os browsers com as dependências do sistema.
# Mantém esta versão igual à de @playwright/test no package.json.
FROM mcr.microsoft.com/playwright:v1.64.1-noble

WORKDIR /app
ENV CI=true

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
