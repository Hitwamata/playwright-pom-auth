import { test } from '../../src/fixtures/paginas.fixture';
import { produtos } from '../../src/data/produtos';

test.describe('Carrinho', () => {
  test.beforeEach(async ({ inventarioPage }) => {
    await inventarioPage.abrir();
  });

  test('deve mostrar o carrinho vazio quando nada foi adicionado', async ({ inventarioPage, carrinhoPage }) => {
    await inventarioPage.abrirCarrinho();
    await carrinhoPage.validarPaginaCarregada();
    await carrinhoPage.validarCarrinhoVazio();
  });

  test('deve remover um produto dentro do carrinho', async ({ inventarioPage, carrinhoPage }) => {
    await inventarioPage.adicionarAoCarrinho(produtos.mochila.nome);
    await inventarioPage.adicionarAoCarrinho(produtos.luzBicicleta.nome);
    await inventarioPage.abrirCarrinho();

    await carrinhoPage.removerProduto(produtos.mochila.nome);
    await carrinhoPage.validarProdutosNoCarrinho([produtos.luzBicicleta.nome]);
    await carrinhoPage.validarQuantidadeNoCarrinho(1);
  });

  test('deve manter os produtos ao voltar à lista', async ({ inventarioPage, carrinhoPage }) => {
    await inventarioPage.adicionarAoCarrinho(produtos.tShirt.nome);
    await inventarioPage.abrirCarrinho();

    await carrinhoPage.continuarAComprar();
    await inventarioPage.validarPaginaCarregada();
    await inventarioPage.validarQuantidadeNoCarrinho(1);
  });
});
