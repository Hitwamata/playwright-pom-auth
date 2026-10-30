import { expect, test, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly campoUtilizador: Locator;
  readonly campoPalavraPasse: Locator;
  readonly botaoEntrar: Locator;
  readonly mensagemErro: Locator;

  constructor(page: Page) {
    this.page = page;
    this.campoUtilizador = page.getByTestId('username');
    this.campoPalavraPasse = page.getByTestId('password');
    this.botaoEntrar = page.getByTestId('login-button');
    this.mensagemErro = page.getByTestId('error');
  }

  async abrir() {
    await test.step('Abrir a página de login', async () => {
      await this.page.goto('/');
      await expect(this.botaoEntrar).toBeVisible();
    }, { box: true });
  }

  async fazerLogin(utilizador: string, palavraPasse: string) {
    await test.step(`Fazer login como "${utilizador}"`, async () => {
      await this.campoUtilizador.fill(utilizador);
      await this.campoPalavraPasse.fill(palavraPasse);
      await this.botaoEntrar.click();
    }, { box: true });
  }

  async validarMensagemErro(texto: string | RegExp) {
    await test.step('Validar mensagem de erro', async () => {
      await expect(this.mensagemErro).toBeVisible();
      await expect(this.mensagemErro).toContainText(texto);
    }, { box: true });
  }
}
