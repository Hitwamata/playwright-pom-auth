import { test } from '../../src/fixtures/paginas.fixture';

// Projeto "autenticado": a sessão vem do auth.setup.ts, sem passar pelo login.
test.describe('Inventário', () => {
  test.beforeEach(async ({ inventarioPage }) => {
    await inventarioPage.abrir();
  });

  test('deve abrir já autenticado, sem passar pelo login', async ({ inventarioPage }) => {
    await inventarioPage.validarPaginaCarregada();
  });

  test('deve ordenar por preço do menor para o maior', async ({ inventarioPage }) => {
    await inventarioPage.ordenarPor('lohi');
    await inventarioPage.validarPrecosOrdenados('crescente');
  });

  test('deve ordenar por preço do maior para o menor', async ({ inventarioPage }) => {
    await inventarioPage.ordenarPor('hilo');
    await inventarioPage.validarPrecosOrdenados('decrescente');
  });

  test('deve ordenar por nome de Z a A', async ({ inventarioPage }) => {
    await inventarioPage.ordenarPor('za');
    await inventarioPage.validarNomesOrdenados('decrescente');
  });

  test('deve adicionar e remover produtos do carrinho', async ({ inventarioPage }) => {
    await inventarioPage.adicionarAoCarrinho('Sauce Labs Backpack');
    await inventarioPage.adicionarAoCarrinho('Sauce Labs Bike Light');
    await inventarioPage.validarQuantidadeNoCarrinho(2);

    await inventarioPage.removerDoCarrinho('Sauce Labs Backpack');
    await inventarioPage.validarQuantidadeNoCarrinho(1);
  });
});
