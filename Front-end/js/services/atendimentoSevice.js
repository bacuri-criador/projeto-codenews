// Define a URL base da nossa API
const API_URL = 'http://localhost:8080/api/atendimentos';

/**
 * Busca todos os atendimentos da API.
 * @returns {Promise<Array>} Uma lista de atendimentos.
 */
async function listarAtendimentos() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Falha ao listar atendimentos:', error);
    return []; // Retorna lista vazia em caso de erro
  }
}

/**
 * Busca um único atendimento por ID.
 * @param {number} id - O ID do atendimento.
 * @returns {Promise<Object|null>} O objeto do atendimento ou null.
 */
async function buscarAtendimentoPorId(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Falha ao buscar atendimento ${id}:`, error);
        return null;
    }
}

/**
 * Salva um novo atendimento.
 * @param {Object} atendimento - O objeto de atendimento (sem ID).
 * @returns {Promise<Object|null>} O atendimento salvo (com ID).
 */
async function criarAtendimento(atendimento) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(atendimento),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Falha ao criar atendimento:', error);
    return null;
  }
}

/**
 * Atualiza um atendimento existente.
 * @param {number} id - O ID do atendimento a atualizar.
 * @param {Object} atendimento - O objeto com os dados atualizados.
 * @returns {Promise<Object|null>} O atendimento atualizado.
 */
async function atualizarAtendimento(id, atendimento) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(atendimento),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Falha ao atualizar atendimento ${id}:`, error);
    return null;
  }
}

/**
 * Deleta um atendimento.
 * @param {number} id - O ID do atendimento a deletar.
 * @returns {Promise<boolean>} True se foi bem-sucedido.
 */
async function deletarAtendimento(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch (error) {
    console.error(`Falha ao deletar atendimento ${id}:`, error);
    return false;
  }
}