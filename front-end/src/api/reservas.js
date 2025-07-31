/**
 * API SIMPLES - DecolaTour
 * Funções para gerenciamento de reservas
 */

const API_URL = 'http://localhost:5295/api/Reserva/lista-completa';

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
 * Busca todas as reservas do sistema
 */
export const fetchReservas = async () => {
  try {
    const response = await fetch(API_URL, {
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
 * Normaliza os dados da API para o formato esperado pelo frontend
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
 * Função auxiliar para formatar datas
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};