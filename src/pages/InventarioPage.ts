import { expect, test, type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

export type OrdenacaoProdutos = 'az' | 'za' | 'lohi' | 'hilo';

export class InventarioPage extends BasePage {
  readonly titulo: Locator;
  readonly listaProdutos: Locator;
  readonly cartoesProduto: Locator;
  readonly nomesProduto: Locator;
  readonly precosProduto: Locator;
  readonly seletorOrdenacao: Locator;

  constructor(page: Page) {
    super(page);
    this.titulo = page.getByTestId('title');
    this.listaProdutos = page.getByTestId('inventory-list');
    this.cartoesProduto = this.listaProdutos.getByTestId('inventory-item');
    this.nomesProduto = this.listaProdutos.getByTestId('inventory-item-name');
    this.precosProduto = this.listaProdutos.getByTestId('inventory-item-price');
    this.seletorOrdenacao = page.getByTestId('product-sort-container');
  }

  async abrir() {
    await test.step('Abrir a página de produtos', async () => {
      await this.page.goto('/inventory.html');
      await this.validarPaginaCarregada();
    }, { box: true });
  }

  async validarPaginaCarregada() {
    await test.step('Validar que a página de produtos carregou', async () => {
      await expect(this.page).toHaveURL(/inventory\.html/);
      await expect(this.titulo).toHaveText('Products');
      await expect(this.listaProdutos).toBeVisible();
    }, { box: true });
  }

  private cartaoDoProduto(nomeProduto: string): Locator {
    return this.cartoesProduto.filter({ hasText: nomeProduto });
  }

  async adicionarAoCarrinho(nomeProduto: string) {
    await test.step(`Adicionar "${nomeProduto}" ao carrinho`, async () => {
      const cartao = this.cartaoDoProduto(nomeProduto);
      await cartao.getByRole('button', { name: 'Add to cart' }).click();
      await expect(cartao.getByRole('button', { name: 'Remove' })).toBeVisible();
    }, { box: true });
  }

  async removerDoCarrinho(nomeProduto: string) {
    await test.step(`Remover "${nomeProduto}" do carrinho`, async () => {
      const cartao = this.cartaoDoProduto(nomeProduto);
      await cartao.getByRole('button', { name: 'Remove' }).click();
      await expect(cartao.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    }, { box: true });
  }

  async ordenarPor(ordenacao: OrdenacaoProdutos) {
    await test.step(`Ordenar produtos por "${ordenacao}"`, async () => {
      await this.seletorOrdenacao.selectOption(ordenacao);
    }, { box: true });
  }

  async obterPrecos(): Promise<number[]> {
    const textos = await this.precosProduto.allInnerTexts();
    return textos.map((texto) => Number(texto.replace('$', '')));
  }

  async validarPrecosOrdenados(direcao: 'crescente' | 'decrescente') {
    await test.step(`Validar preços em ordem ${direcao}`, async () => {
      const precos = await this.obterPrecos();
      const esperado = [...precos].sort((a, b) =>
        direcao === 'crescente' ? a - b : b - a,
      );
      expect(precos).toEqual(esperado);
    }, { box: true });
  }

  async validarNomesOrdenados(direcao: 'crescente' | 'decrescente') {
    await test.step(`Validar nomes em ordem ${direcao}`, async () => {
      const nomes = await this.nomesProduto.allInnerTexts();
      const esperado = [...nomes].sort((a, b) =>
        direcao === 'crescente' ? a.localeCompare(b) : b.localeCompare(a),
      );
      expect(nomes).toEqual(esperado);
    }, { box: true });
  }
}
