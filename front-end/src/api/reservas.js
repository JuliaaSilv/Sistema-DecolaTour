/**
 * API SIMPLES - DecolaTour
 * Funções para gerenciamento de reservas
 */

const API_BASE_URL = 'http://localhost:5295/api/Reserva';

/**
 * Função auxiliar para obter o token JWT do localStorage e configurar os headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('Nenhum token JWT encontrado no localStorage');
  }
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

/**
 * Busca todas as reservas do sistema (apenas para administradores)
 */
export const fetchReservas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/lista-completa`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      // Se a resposta for 401 (Não autorizado), pode ser um token inválido/expirado
      if (response.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(`Erro ao buscar reservas: ${response.statusText}`);
    }

    const resultado_da_api = await response.json();
    console.log(resultado_da_api.data);
    return resultado_da_api.data;

  } catch (error) {
    console.error('Erro na requisição de reservas:', error);
    throw error;
  }
};

/**
 * Busca apenas as reservas do usuário logado
 */
export const fetchMinhasReservas = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/minhas`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      // Se a resposta for 401 (Não autorizado), pode ser um token inválido/expirado
      if (response.status === 401) {
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
      throw new Error(`Erro ao buscar suas reservas: ${response.statusText}`);
    }

    const resultado_da_api = await response.json();
    console.log('Minhas reservas:', resultado_da_api);
    
    // O endpoint /minhas pode retornar diretamente um array ou um objeto com data
    const reservas = Array.isArray(resultado_da_api) ? resultado_da_api : (resultado_da_api.data || []);
    return reservas;

  } catch (error) {
    console.error('Erro na requisição de minhas reservas:', error);
    throw error;
  }
};

/**
 * Normaliza os dados da API para o formato esperado pelo frontend (lista completa - admin)
 */
export const normalizeReservaData = (reserva) => ({
  id: reserva.id,
  codigo: reserva.codigo,
  cliente: reserva.cliente,
  email: reserva.email,
  pacote: reserva.pacote,
  destino: reserva.destino,
  dataViagem: formatDate(reserva.dataViagem),
  dataReserva: formatDate(reserva.dataReserva),
  valor: reserva.valor,
  status: reserva.status.toLowerCase(),
  pessoas: reserva.pessoas,
  pagamento: (reserva.pagamento ?? 'pendente').toLowerCase()
});

/**
 * Normaliza os dados das reservas do usuário (estrutura simplificada)
 */
export const normalizeMinhaReservaData = (reserva) => ({
  id: reserva.id,
  codigo: `RES-${reserva.id.toString().padStart(6, '0')}`, // Gera código baseado no ID
  cliente: 'Você', // Como é do próprio usuário
  email: '', // Não disponível neste DTO
  pacote: reserva.tituloPacote || 'Pacote de Viagem',
  destino: reserva.tituloPacote || 'Destino não informado', // Usando título como destino temporariamente
  dataViagem: formatDate(reserva.dataReserva), // Usando data da reserva como referência
  dataReserva: formatDate(reserva.dataReserva),
  valor: reserva.valorTotal,
  status: 'confirmada', // Status padrão, pois não está no DTO
  pessoas: reserva.quantidadeViajantes,
  pagamento: 'pendente', // Status padrão, pois não está no DTO
  imagemUrl: reserva.imagemPacoteUrl // Campo adicional para imagem
});
    


/**
 * Função auxiliar para formatar datas
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};