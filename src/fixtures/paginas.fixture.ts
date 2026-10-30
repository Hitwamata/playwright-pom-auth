import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventarioPage } from '../pages/InventarioPage';
import { CarrinhoPage } from '../pages/CarrinhoPage';
import { CheckoutPage } from '../pages/CheckoutPage';

type Paginas = {
  loginPage: LoginPage;
  inventarioPage: InventarioPage;
  carrinhoPage: CarrinhoPage;
  checkoutPage: CheckoutPage;
};

/**
 * Fixtures que injetam as Page Objects diretamente nos testes,
 * evitando repetir `new XPage(page)` em cada ficheiro.
 */
export const test = base.extend<Paginas>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventarioPage: async ({ page }, use) => {
    await use(new InventarioPage(page));
  },
  carrinhoPage: async ({ page }, use) => {
    await use(new CarrinhoPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect } from '@playwright/test';
