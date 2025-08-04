/**
 * API para gerenciamento de usuários
 */

const API_URL = 'http://localhost:5295/api/User';

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
 * Busca todos os usuários
 */
export const fetchUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/Listar Todos Usuário`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(`Erro ao buscar usuários: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na requisição de usuários:', error);
    throw error;
  }
};

/**
 * Busca um usuário por ID
 */
export const fetchUserById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar usuário: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
};

/**
 * Busca o perfil do usuário logado
 */
export const fetchCurrentUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/perfil`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(`Erro ao buscar perfil: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
};

/**
 * Atualiza o perfil do usuário logado
 */
export const updateCurrentUserProfile = async (userData) => {
  try {
    // Primeiro, buscar o perfil atual para obter o ID
    const currentProfile = await fetchCurrentUserProfile();
    
    const updateUserData = {
      id: currentProfile.id,
      nome: userData.nome,
      email: userData.email,
      cpf: userData.cpf,
      telefone: userData.telefone,
      dataNascimento: userData.dataNascimento ? 
        new Date(userData.dataNascimento).toISOString() : 
        new Date().toISOString(),
      tipoUsuarioId: currentProfile.tipoUsuarioId || 3 // Mantém o tipo atual ou padrão cliente
    };

    const response = await fetch(`${API_URL}/${currentProfile.id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateUserData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao atualizar perfil: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

/**
 * Cria um novo usuário
 */
export const createUser = async (userData) => {
  try {
    // Preparar os dados no formato esperado pelo backend
    const createUserData = {
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha,
      cpf: userData.cpf,
      telefone: userData.telefone,
      // Converter data de nascimento para formato ISO
      dataNascimento: userData.dataNascimento ? 
        new Date(userData.dataNascimento).toISOString() : 
        new Date().toISOString(), // Data padrão se não fornecida
      tipoUsuarioId: parseInt(userData.tipoUsuarioId)
    };

    console.log('Dados enviados para criação:', createUserData);

    // Usar o endpoint de registro para criar usuários
    const response = await fetch('http://localhost:5295/api/Auth/registrar', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(createUserData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro do backend ao criar:', errorText);
      throw new Error(`Erro ao criar usuário: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

/**
 * Atualiza um usuário
 */
export const updateUser = async (id, userData) => {
  try {
    // Preparar os dados no formato esperado pelo backend
    const usuarioDTO = {
      id: parseInt(id),
      nome: userData.nome,
      email: userData.email,
      telefone: userData.telefone,
      cpf: userData.cpf,
      tipoUsuarioId: parseInt(userData.tipoUsuarioId),
      // Converter data de nascimento para formato ISO se fornecida
      dataNascimento: userData.dataNascimento ? 
        new Date(userData.dataNascimento).toISOString() : 
        new Date().toISOString(), // Data padrão se não fornecida
      // Incluir senha apenas se fornecida
      ...(userData.senha && { senha: userData.senha })
    };

    console.log('Dados enviados para o backend:', usuarioDTO);

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(usuarioDTO)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro do backend:', errorText);
      throw new Error(`Erro ao atualizar usuário: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

/**
 * Deleta um usuário
 */
export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao deletar usuário: ${errorText}`);
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};

/**
 * Normaliza os dados do usuário vindos da API
 */
export const normalizeUserData = (user) => {
  // Mapear tipo de usuário para nome legível
  const getTipoNome = (tipoId) => {
    switch(tipoId) {
      case 1: return 'Administrador';
      case 2: return 'Atendente';
      case 3: return 'Cliente';
      default: return 'Desconhecido';
    }
  };

  // Calcular tier baseado em gastos (você pode ajustar os valores)
  const getTier = (totalGasto) => {
    if (totalGasto >= 50000) return 'Platinum';
    if (totalGasto >= 30000) return 'Gold';
    if (totalGasto >= 10000) return 'Silver';
    return null;
  };

  return {
    id: user.id,
    nome: user.nome || '',
    email: user.email || '',
    telefone: user.telefone || '',
    cpf: user.cpf || '',
    tipo: getTipoNome(user.tipoUsuarioId),
    tipoId: user.tipoUsuarioId,
    status: user.ativo ? 'ativo' : 'inativo',
    dataRegistro: user.dataCadastro ? new Date(user.dataCadastro).toLocaleDateString('pt-BR') : '',
    ultimoLogin: user.ultimoLogin ? new Date(user.ultimoLogin).toLocaleDateString('pt-BR') : 'Nunca',
    reservas: user.totalReservas || 0,
    totalGasto: user.totalGasto || 0,
    tier: getTier(user.totalGasto || 0)
  };
};
