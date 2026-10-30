import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import { FICHEIRO_SESSAO } from './src/config/sessao';

dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true });

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.saucedemo.com',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // 1) Faz login uma vez e guarda a sessão em .auth/utilizador.json
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // 2) Testes que já começam autenticados (reutilizam a sessão)
    {
      name: 'autenticado',
      use: { ...devices['Desktop Chrome'], storageState: FICHEIRO_SESSAO },
      dependencies: ['setup'],
      testIgnore: /login\/.*\.spec\.ts/,
    },

    // 3) Testes do próprio login, sem sessão
    {
      name: 'sem-sessao',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /login\/.*\.spec\.ts/,
    },
  ],
});
