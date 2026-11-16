import { test } from '../../src/fixtures/paginas.fixture';
import { dadosCheckout } from '../../src/data/checkout';
import { calcularSubtotal, produtos } from '../../src/data/produtos';

const itens = [produtos.mochila, produtos.tShirt];
const nomes = itens.map((produto) => produto.nome);

test.describe('Checkout', () => {
  test.beforeEach(async ({ inventarioPage }) => {
    await inventarioPage.abrir();
    for (const nome of nomes) {
      await inventarioPage.adicionarAoCarrinho(nome);
    }
    await inventarioPage.abrirCarrinho();
  });

  test('deve concluir uma compra de ponta a ponta', { tag: '@smoke' }, async ({ carrinhoPage, checkoutPage }) => {
    await carrinhoPage.validarPaginaCarregada();
    await carrinhoPage.validarProdutosNoCarrinho(nomes);
    await carrinhoPage.irParaCheckout();

    await checkoutPage.preencherDados(dadosCheckout);
    await checkoutPage.validarSubtotal(calcularSubtotal(itens));
    await checkoutPage.finalizarCompra();
    await checkoutPage.validarCompraConcluida();
    await checkoutPage.validarQuantidadeNoCarrinho(0);
  });

  test('deve exigir o primeiro nome no checkout', async ({ carrinhoPage, checkoutPage }) => {
    await carrinhoPage.irParaCheckout();
    await checkoutPage.preencherDados({ ...dadosCheckout, primeiroNome: '' });
    await checkoutPage.validarMensagemErro('First Name is required');
  });

  test('deve exigir o código postal no checkout', async ({ carrinhoPage, checkoutPage }) => {
    await carrinhoPage.irParaCheckout();
    await checkoutPage.preencherDados({ ...dadosCheckout, codigoPostal: '' });
    await checkoutPage.validarMensagemErro('Postal Code is required');
  });
});
