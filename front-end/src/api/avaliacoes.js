const API_BASE_URL = 'http://localhost:5295/api/Avaliacao';

// Importar função de validação do auth
import { estaLogado } from './auth.js';

/**
 * Função auxiliar para obter headers de autenticação
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Verifica se o usuário logado pode avaliar um pacote específico
 */
export const verificarSeUsuarioPodeAvaliar = async (pacoteId) => {
  try {
    // Primeiro verificar se está realmente logado com token válido
    if (!estaLogado()) {
      return { podeAvaliar: false, motivo: 'Usuário não está logado ou token expirado' };
    }

    const token = localStorage.getItem('token');
    
    console.log('🔍 Verificando se pode avaliar pacote:', pacoteId);
    console.log('🎫 Token presente:', !!token);
    console.log('🎫 Token (primeiros 50 chars):', token?.substring(0, 50) + '...');

    const response = await fetch(`${API_BASE_URL}/pode-avaliar/${pacoteId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    console.log('📡 Status da resposta:', response.status);
    console.log('📡 Headers enviados:', getAuthHeaders());

    if (!response.ok) {
      if (response.status === 401) {
        console.error('❌ Token expirado ou inválido');
        // Limpar token inválido
        localStorage.removeItem('token');
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Resposta da verificação:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao verificar se pode avaliar:', error);
    throw error;
  }
};
/**
 * Busca avaliações de um pacote específico
 */
export const buscarAvaliacoesPorPacote = async (pacoteId) => {
  try {
    console.log('🔍 Buscando avaliações para pacote:', pacoteId);
    
    const response = await fetch(`${API_BASE_URL}/pacote/${pacoteId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📝 Resposta da API:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar avaliações:', error);
    throw error;
  }
};

/**
 * Cria uma nova avaliação
 */
export const criarAvaliacao = async (avaliacaoData) => {
  try {
    console.log('✏️ Criando avaliação:', avaliacaoData);
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(avaliacaoData)
    });

    console.log('📡 Status da resposta:', response.status);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      
      // Tentar obter mensagem de erro da resposta
      const errorData = await response.text();
      throw new Error(`Erro ${response.status}: ${errorData || response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ Avaliação criada com sucesso:', data);
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao criar avaliação:', error);
    throw error;
  }
};

/**
 * Formata uma avaliação do backend para o frontend
 */
export const formatarAvaliacaoParaFrontend = (avaliacaoBackend) => {
  return {
    id: avaliacaoBackend.id || Math.random(),
    name: avaliacaoBackend.viajante?.nome || avaliacaoBackend.nomeUsuario || 'Usuário Anônimo',
    rating: avaliacaoBackend.nota || 0,
    comment: avaliacaoBackend.comentario || '',
    date: avaliacaoBackend.dataAvaliacao || avaliacaoBackend.data || new Date().toISOString(),
    verified: true, // Já que passou pela moderação
    helpful: 0
  };
};

/**
 * Formata múltiplas avaliações do backend para o frontend
 */
export const formatarAvaliacoesParaFrontend = (avaliacoesBackend) => {
  if (!Array.isArray(avaliacoesBackend)) {
    return [];
  }

  return avaliacoesBackend.map(formatarAvaliacaoParaFrontend);
};
