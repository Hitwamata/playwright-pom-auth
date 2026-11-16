import { test } from '../../src/fixtures/paginas.fixture';
import { produtos } from '../../src/data/produtos';

// Projeto "autenticado": a sessão vem do auth.setup.ts, sem passar pelo login.
test.describe('Inventário', () => {
  test.beforeEach(async ({ inventarioPage }) => {
    await inventarioPage.abrir();
  });

  test('deve abrir já autenticado, sem passar pelo login', { tag: '@smoke' }, async ({ inventarioPage }) => {
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
    await inventarioPage.adicionarAoCarrinho(produtos.mochila.nome);
    await inventarioPage.adicionarAoCarrinho(produtos.luzBicicleta.nome);
    await inventarioPage.validarQuantidadeNoCarrinho(2);

    await inventarioPage.removerDoCarrinho(produtos.mochila.nome);
    await inventarioPage.validarQuantidadeNoCarrinho(1);
  });
});
