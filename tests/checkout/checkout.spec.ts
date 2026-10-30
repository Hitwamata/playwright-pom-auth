import { test } from '../../src/fixtures/paginas.fixture';
import { dadosCheckout } from '../../src/data/utilizadores';

const produtos = ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt'];
const subtotalEsperado = 29.99 + 15.99;

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventarioPage }) => {
    await inventarioPage.abrir();
    for (const produto of produtos) {
      await inventarioPage.adicionarAoCarrinho(produto);
    }
    await inventarioPage.abrirCarrinho();
  });

  test('deve concluir uma compra de ponta a ponta', async ({ carrinhoPage, checkoutPage }) => {
    await carrinhoPage.validarPaginaCarregada();
    await carrinhoPage.validarProdutosNoCarrinho(produtos);
    await carrinhoPage.irParaCheckout();

    await checkoutPage.preencherDados(dadosCheckout);
    await checkoutPage.validarSubtotal(subtotalEsperado);
    await checkoutPage.finalizarCompra();
    await checkoutPage.validarCompraConcluida();
    await checkoutPage.validarQuantidadeNoCarrinho(0);
  });

  test('deve exigir o primeiro nome no checkout', async ({ carrinhoPage, checkoutPage }) => {
    await carrinhoPage.irParaCheckout();
    await checkoutPage.preencherDados({ ...dadosCheckout, primeiroNome: '' });
    await checkoutPage.validarMensagemErro('First Name is required');
  });
});
