import { test as setup } from '../../src/fixtures/paginas.fixture';
import { utilizadorPadrao } from '../../src/data/utilizadores';
import { FICHEIRO_SESSAO } from '../../src/config/sessao';

/**
 * Corre UMA vez antes dos testes autenticados.
 * Faz login pela interface e guarda cookies + localStorage em .auth/utilizador.json.
 * Os restantes testes carregam esse ficheiro e já começam com sessão iniciada.
 */
setup('autenticar utilizador padrão', async ({ page, loginPage, inventarioPage }) => {
  await loginPage.abrir();
  await loginPage.fazerLogin(utilizadorPadrao.nome, utilizadorPadrao.palavraPasse);
  await inventarioPage.validarPaginaCarregada();

  await page.context().storageState({ path: FICHEIRO_SESSAO });
});
