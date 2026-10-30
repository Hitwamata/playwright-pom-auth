/**
 * Credenciais lidas do .env, com os valores públicos do Sauce Demo como fallback.
 * Nunca coloques credenciais reais neste ficheiro.
 */
export const utilizadorPadrao = {
  nome: process.env.UTILIZADOR ?? 'standard_user',
  palavraPasse: process.env.PALAVRA_PASSE ?? 'secret_sauce',
};

export const utilizadorBloqueado = {
  nome: 'locked_out_user',
  palavraPasse: 'secret_sauce',
};

export const dadosCheckout = {
  primeiroNome: 'Eliazel',
  ultimoNome: 'QA',
  codigoPostal: '1000',
};
