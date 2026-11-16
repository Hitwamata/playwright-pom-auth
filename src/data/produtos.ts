/** Catálogo usado nos testes, com os preços tal como aparecem no Sauce Demo. */
export const produtos = {
  mochila: { nome: 'Sauce Labs Backpack', preco: 29.99 },
  luzBicicleta: { nome: 'Sauce Labs Bike Light', preco: 9.99 },
  tShirt: { nome: 'Sauce Labs Bolt T-Shirt', preco: 15.99 },
} as const;

export type Produto = (typeof produtos)[keyof typeof produtos];

/** Soma os preços, arredondada a 2 casas para evitar erros de vírgula flutuante. */
export function calcularSubtotal(lista: readonly Produto[]): number {
  const total = lista.reduce((soma, produto) => soma + produto.preco, 0);
  return Math.round(total * 100) / 100;
}
