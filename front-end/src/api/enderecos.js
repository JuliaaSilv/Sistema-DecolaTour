/**
 * API para gerenciamento de endereços do usuário
 */

const API_URL = 'http://localhost:5295/api/Endereco';

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
 * Busca todos os endereços do usuário logado
 */
export const fetchEnderecos = async () => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(`Erro ao buscar endereços: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição de endereços:', error);
    throw error;
  }
};

/**
 * Cria um novo endereço
 */
export const createEndereco = async (enderecoData) => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(enderecoData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar endereço: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar endereço:', error);
    throw error;
  }
};

/**
 * Atualiza um endereço existente
 */
export const updateEndereco = async (enderecoId, enderecoData) => {
  try {
    const response = await fetch(`${API_URL}/${enderecoId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ...enderecoData, id: enderecoId })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao atualizar endereço: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar endereço:', error);
    throw error;
  }
};

/**
 * Remove um endereço
 */
export const deleteEndereco = async (enderecoId) => {
  try {
    const response = await fetch(`${API_URL}/${enderecoId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao remover endereço: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao remover endereço:', error);
    throw error;
  }
};
