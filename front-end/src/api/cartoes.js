/**
 * API para gerenciamento de cartões do usuário
 */

const API_URL = 'http://localhost:5295/api/Cartao';

/**
 * Função auxiliar para obter o token JWT do localStorage e configurar os headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

/**
 * Busca todos os cartões do usuário logado
 */
export const fetchCartoes = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(`Erro ao buscar cartões: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição de cartões:', error);
    throw error;
  }
};

/**
 * Cria um novo cartão
 */
export const createCartao = async (cartaoData) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cartaoData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar cartão: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar cartão:', error);
    throw error;
  }
};

/**
 * Atualiza um cartão existente
 */
export const updateCartao = async (cartaoId, cartaoData) => {
  try {
    const response = await fetch(`${API_URL}/${cartaoId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...cartaoData, id: cartaoId })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao atualizar cartão: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar cartão:', error);
    throw error;
  }
};

/**
 * Remove um cartão
 */
export const deleteCartao = async (cartaoId) => {
  try {
    const response = await fetch(`${API_URL}/${cartaoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao remover cartão: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao remover cartão:', error);
    throw error;
  }
};
