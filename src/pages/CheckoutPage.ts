import { expect, test, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

type DadosCheckout = {
  primeiroNome: string;
  ultimoNome: string;
  codigoPostal: string;
};

export class CheckoutPage extends BasePage {
  readonly campoPrimeiroNome: Locator;
  readonly campoUltimoNome: Locator;
  readonly campoCodigoPostal: Locator;
  readonly botaoContinuar: Locator;
  readonly botaoFinalizar: Locator;
  readonly mensagemErro: Locator;
  readonly subtotal: Locator;
  readonly tituloConfirmacao: Locator;

  constructor(page: Page) {
    super(page);
    this.campoPrimeiroNome = page.getByTestId('firstName');
    this.campoUltimoNome = page.getByTestId('lastName');
    this.campoCodigoPostal = page.getByTestId('postalCode');
    this.botaoContinuar = page.getByTestId('continue');
    this.botaoFinalizar = page.getByTestId('finish');
    this.mensagemErro = page.getByTestId('error');
    this.subtotal = page.getByTestId('subtotal-label');
    this.tituloConfirmacao = page.getByTestId('complete-header');
  }

  async preencherDados(dados: DadosCheckout) {
    await test.step('Preencher dados do comprador', async () => {
      await this.campoPrimeiroNome.fill(dados.primeiroNome);
      await this.campoUltimoNome.fill(dados.ultimoNome);
      await this.campoCodigoPostal.fill(dados.codigoPostal);
      await this.botaoContinuar.click();
    }, { box: true });
  }

  async validarSubtotal(valorEsperado: number) {
    await test.step(`Validar subtotal de $${valorEsperado}`, async () => {
      await expect(this.subtotal).toContainText(`$${valorEsperado.toFixed(2)}`);
    }, { box: true });
  }

  async finalizarCompra() {
    await test.step('Finalizar a compra', async () => {
      await this.botaoFinalizar.click();
    }, { box: true });
  }

  async validarCompraConcluida() {
    await test.step('Validar que a compra foi concluída', async () => {
      await expect(this.page).toHaveURL(/checkout-complete\.html/);
      await expect(this.tituloConfirmacao).toHaveText('Thank you for your order!');
    }, { box: true });
  }

  async validarMensagemErro(texto: string) {
    await test.step('Validar mensagem de erro no checkout', async () => {
      await expect(this.mensagemErro).toContainText(texto);
    }, { box: true });
  }
}
