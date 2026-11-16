import { expect, test, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CarrinhoPage extends BasePage {
  readonly titulo: Locator;
  readonly itensCarrinho: Locator;
  readonly botaoCheckout: Locator;
  readonly botaoContinuarCompras: Locator;

  constructor(page: Page) {
    super(page);
    this.titulo = page.getByTestId('title');
    this.itensCarrinho = page.getByTestId('inventory-item');
    this.botaoCheckout = page.getByTestId('checkout');
    this.botaoContinuarCompras = page.getByTestId('continue-shopping');
  }

  async validarPaginaCarregada() {
    await test.step('Validar que o carrinho carregou', async () => {
      await expect(this.page).toHaveURL(/cart\.html/);
      await expect(this.titulo).toHaveText('Your Cart');
    }, { box: true });
  }

  async validarProdutosNoCarrinho(nomesProdutos: string[]) {
    await test.step('Validar produtos no carrinho', async () => {
      await expect(this.itensCarrinho).toHaveCount(nomesProdutos.length);
      for (const nome of nomesProdutos) {
        await expect.soft(this.itensCarrinho.filter({ hasText: nome })).toBeVisible();
      }
    }, { box: true });
  }

  async validarCarrinhoVazio() {
    await test.step('Validar que o carrinho está vazio', async () => {
      await expect(this.itensCarrinho).toHaveCount(0);
    }, { box: true });
  }

  async removerProduto(nomeProduto: string) {
    await test.step(`Remover "${nomeProduto}" do carrinho`, async () => {
      const item = this.itensCarrinho.filter({ hasText: nomeProduto });
      await item.getByRole('button', { name: 'Remove' }).click();
      await expect(item).toBeHidden();
    }, { box: true });
  }

  async continuarAComprar() {
    await test.step('Voltar à lista de produtos', async () => {
      await this.botaoContinuarCompras.click();
    }, { box: true });
  }

  async irParaCheckout() {
    await test.step('Ir para o checkout', async () => {
      await this.botaoCheckout.click();
    }, { box: true });
  }
}
