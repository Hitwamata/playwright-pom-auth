import { expect, test, type Locator, type Page } from '@playwright/test';

/**
 * Classe base partilhada por todas as páginas.
 * Contém o cabeçalho comum (carrinho e menu) e ações genéricas.
 */
export abstract class BasePage {
  readonly page: Page;
  readonly iconeCarrinho: Locator;
  readonly contadorCarrinho: Locator;
  readonly botaoMenu: Locator;
  readonly linkLogout: Locator;

  constructor(page: Page) {
    this.page = page;
    this.iconeCarrinho = page.getByTestId('shopping-cart-link');
    this.contadorCarrinho = page.getByTestId('shopping-cart-badge');
    this.botaoMenu = page.getByRole('button', { name: 'Open Menu' });
    this.linkLogout = page.getByTestId('logout-sidebar-link');
  }

  async abrirCarrinho() {
    await test.step('Abrir o carrinho', async () => {
      await this.iconeCarrinho.click();
    }, { box: true });
  }

  async validarQuantidadeNoCarrinho(quantidade: number) {
    await test.step(`Validar ${quantidade} item(ns) no carrinho`, async () => {
      if (quantidade === 0) {
        await expect(this.contadorCarrinho).toBeHidden();
      } else {
        await expect(this.contadorCarrinho).toHaveText(String(quantidade));
      }
    }, { box: true });
  }

  async fazerLogout() {
    await test.step('Fazer logout', async () => {
      await this.botaoMenu.click();
      await this.linkLogout.click();
    }, { box: true });
  }
}
