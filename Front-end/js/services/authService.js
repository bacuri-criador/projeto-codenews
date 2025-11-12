// Define a URL base da nossa API
const API_URL = 'http://localhost:8080/api';

/**
 * Tenta autenticar um usuário no backend.
 * @param {string} login - O e-mail do usuário.
 * @param {string} senha - A senha do usuário.
 * @returns {Promise<boolean>} True se o login for bem-sucedido.
 */
async function login(login, senha) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, senha }),
    });

    return response.ok; // Retorna true se status for 200-299
  } catch (error) {
    console.error('Falha ao tentar fazer login:', error);
    return false; // Retorna false em caso de falha na rede
  }
}

/**
 * Envia um pedido de redefinição de senha (mockado).
 * @param {string} email - O e-mail para recuperação.
 * @returns {Promise<boolean>} True se o e-mail for "enviado".
 */
async function esqueciSenha(email) {
  try {
    // Simula uma chamada de API
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Pedido de redefinição enviado para: ${email}`);
    return true;
  } catch (error) {
    console.error('Falha ao pedir redefinição:', error);
    return false;
  }
}