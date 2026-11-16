import { test, expect } from '../../src/fixtures/paginas.fixture';

// O logout só afeta o contexto deste teste; o ficheiro de sessão continua válido para os outros.
test.describe('Sessão', () => {
  test.beforeEach(async ({ inventarioPage }) => {
    await inventarioPage.abrir();
    await inventarioPage.fazerLogout();
  });

  test('deve terminar a sessão com logout', { tag: '@smoke' }, async ({ page, loginPage }) => {
    await expect(page).toHaveURL('/');
    await expect(loginPage.botaoEntrar).toBeVisible();
  });

  test('não deve aceder a páginas internas depois do logout', async ({ page, loginPage }) => {
    await page.goto('/inventory.html');
    await loginPage.validarMensagemErro("You can only access '/inventory.html' when you are logged in.");
  });
});
