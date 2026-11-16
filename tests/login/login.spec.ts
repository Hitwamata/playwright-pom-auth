import { test } from '../../src/fixtures/paginas.fixture';
import { utilizadorBloqueado, utilizadorPadrao } from '../../src/data/utilizadores';

// Estes testes correm SEM sessão (projeto "sem-sessao"), porque testam o próprio login.
test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.abrir();
  });

  test('deve entrar com credenciais válidas', { tag: '@smoke' }, async ({ loginPage, inventarioPage }) => {
    await loginPage.fazerLogin(utilizadorPadrao.nome, utilizadorPadrao.palavraPasse);
    await inventarioPage.validarPaginaCarregada();
  });

  test('deve mostrar erro com palavra-passe inválida', async ({ loginPage }) => {
    await loginPage.fazerLogin(utilizadorPadrao.nome, 'palavra_errada');
    await loginPage.validarMensagemErro('Username and password do not match');
  });

  test('deve bloquear utilizador bloqueado', async ({ loginPage }) => {
    await loginPage.fazerLogin(utilizadorBloqueado.nome, utilizadorBloqueado.palavraPasse);
    await loginPage.validarMensagemErro('Sorry, this user has been locked out');
  });

  test('deve exigir o nome de utilizador', async ({ loginPage }) => {
    await loginPage.fazerLogin('', utilizadorPadrao.palavraPasse);
    await loginPage.validarMensagemErro('Username is required');
  });
});
