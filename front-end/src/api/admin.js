/**
 * API para dados administrativos - DecolaTour
 */

const API_URL = 'http://localhost:5295/api';

/**
 * Função auxiliar para fazer requisições autenticadas
 */
async function fazerRequisicaoAutenticada(url, opcoes = {}) {
  const token = localStorage.getItem('token');
  
  const opcoesCompletas = {
    ...opcoes,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...opcoes.headers,
    },
  };

  const response = await fetch(`${API_URL}${url}`, opcoesCompletas);
  
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Buscar métricas gerais do dashboard
 */
export async function buscarMetricasGerais() {
  return fazerRequisicaoAutenticada('/AdminDashboard/metricas-gerais');
}

/**
 * Buscar faturamento mensal
 */
export async function buscarFaturamentoMensal() {
  return fazerRequisicaoAutenticada('/AdminDashboard/faturamento-mensal');
}

/**
 * Buscar destinos populares
 */
export async function buscarDestinosPopulares() {
  return fazerRequisicaoAutenticada('/AdminDashboard/destinos-populares');
}

/**
 * Buscar clientes frequentes
 */
export async function buscarClientesFrequentes() {
  return fazerRequisicaoAutenticada('/AdminDashboard/clientes-frequentes');
}

/**
 * Buscar promoções ativas
 */
export async function buscarPromocoesAtivas() {
  return fazerRequisicaoAutenticada('/AdminDashboard/promocoes-ativas');
}

/**
 * Buscar todos os pacotes
 */
export async function buscarTodosPacotes() {
  return fazerRequisicaoAutenticada('/Pacotes');
}

/**
 * Buscar todas as reservas
 */
export async function buscarTodasReservas() {
  return fazerRequisicaoAutenticada('/Reserva');
}

/**
 * Buscar todos os usuários
 */
export async function buscarTodosUsuarios() {
  return fazerRequisicaoAutenticada('/User');
}

/**
 * Buscar dados completos para relatório
 */
export async function buscarDadosCompletos() {
  try {
    const [metricas, faturamento, destinos, clientes, promocoes] = await Promise.all([
      buscarMetricasGerais(),
      buscarFaturamentoMensal(),
      buscarDestinosPopulares(),
      buscarClientesFrequentes(),
      buscarPromocoesAtivas()
    ]);

    return {
      metricas,
      faturamento,
      destinos,
      clientes,
      promocoes,
      dataGeracao: new Date().toLocaleString('pt-BR')
    };
  } catch (error) {
    console.error('Erro ao buscar dados completos:', error);
    throw error;
  }
}
