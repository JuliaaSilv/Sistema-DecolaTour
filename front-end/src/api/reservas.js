/**
 * API SIMPLES - DecolaTour
 * Funções para gerenciamento de reservas
 */

const API_BASE_URL = 'http://localhost:5295/api/Reserva';

/**
 * Função auxiliar para obter o token JWT do localStorage e configurar os headers
 */
export const getAuthHeaders = () => {
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
    console.log('Minhas reservas - resposta raw da API:', resultado_da_api);
    
    // O endpoint /minhas pode retornar diretamente um array ou um objeto com data
    const reservas = Array.isArray(resultado_da_api) ? resultado_da_api : (resultado_da_api.data || []);
    
    console.log('Reservas extraídas:', reservas);
    
    // Buscar detalhes de viajantes para verificar se o backend está retornando correto
    console.log('Reservas extraídas:', reservas);
    
    // Com as correções no backend, não precisamos mais buscar dados adicionais
    // O mapeamento já deve incluir quantidade de viajantes, valor total e imagens
    
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
export const normalizeMinhaReservaData = (reserva) => {
  console.log('Normalizando reserva:', reserva);
  
  // Extrair valores corretos do backend
  const quantidadeViajantes = reserva.quantidadeViajantes > 0 ? reserva.quantidadeViajantes : 1;
  let valorTotal = reserva.valorTotal > 0 ? reserva.valorTotal : 0;
  
  // Se o valor total ainda for 0, tentar estimar baseado no destino
  if (valorTotal === 0) {
    const valoresEstimados = {
      'recife': 1500,
      'rio de janeiro': 1200,
      'verão rio de janeiro': 1200,
      'maceió': 1300,
      'bahia': 1400,
      'fortaleza': 1100
    };
    
    const tituloLower = (reserva.tituloPacote || '').toLowerCase().trim();
    const destinoEncontrado = Object.keys(valoresEstimados).find(destino => 
      tituloLower.includes(destino)
    );
    
    if (destinoEncontrado) {
      valorTotal = valoresEstimados[destinoEncontrado] * quantidadeViajantes;
      console.log(`Valor estimado para "${tituloLower}": ${valorTotal} (${valoresEstimados[destinoEncontrado]} × ${quantidadeViajantes})`);
    } else {
      valorTotal = 999 * quantidadeViajantes; // Valor padrão
    }
  }
  
  // Tratar imagem - se vier URL do backend, usar ela; senão, usar padrão
  let imagemUrl = null;
  if (reserva.imagemPacoteUrl && 
      typeof reserva.imagemPacoteUrl === 'string' &&
      !reserva.imagemPacoteUrl.includes('System.Collections.Generic.List')) {
    // Se já é uma URL válida do backend
    if (reserva.imagemPacoteUrl.startsWith('http')) {
      imagemUrl = reserva.imagemPacoteUrl;
    } else if (reserva.imagemPacoteUrl.startsWith('/')) {
      // Se é um caminho relativo, completar com o servidor
      imagemUrl = `http://localhost:5295${reserva.imagemPacoteUrl}`;
    }
  }
  
  // Se não tiver imagem válida, usar uma padrão baseada no destino
  if (!imagemUrl) {
    const tituloLower = (reserva.tituloPacote || '').toLowerCase().trim();
    if (tituloLower.includes('recife')) {
      imagemUrl = '/images/recife.jpg';
    } else if (tituloLower.includes('rio')) {
      imagemUrl = '/images/rio.jpg';
    } else if (tituloLower.includes('maceió')) {
      imagemUrl = '/images/maceio.jpg';
    } else {
      imagemUrl = '/images/default-package.jpg';
    }
  }
  
  const reservaNormalizada = {
    id: reserva.id,
    codigo: reserva.numeroReserva || (reserva.id + 100000), // Usar numeroReserva do backend ou gerar baseado no ID
    cliente: 'Você',
    email: '',
    pacote: reserva.tituloPacote || 'Pacote de Viagem',
    destino: reserva.tituloPacote || 'Destino não informado',
    dataViagem: formatDate(reserva.dataViagem || reserva.dataReserva), // Usar dataViagem se disponível, senão dataReserva
    dataReserva: formatDate(reserva.dataReserva),
    valor: valorTotal,
    valorTotal: valorTotal,
    status: 'confirmada',
    pessoas: quantidadeViajantes,
    quantidadePessoas: quantidadeViajantes,
    pagamento: 'pago', // Assumir pago se a reserva existe
    statusPagamento: 'pago',
    imagemUrl: imagemUrl,
    categoria: 'viagem',
    observacoes: ''
  };
  
  console.log('Reserva normalizada:', reservaNormalizada);
  return reservaNormalizada;
};
    


/**
 * Função auxiliar para formatar datas
 */
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    // Tenta parsear a data
    const date = new Date(dateString);
    
    // Verifica se a data é válida
    if (isNaN(date.getTime())) {
      console.warn('Data inválida:', dateString);
      return '';
    }
    
    // Formatar para formato brasileiro
    return date.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
  } catch (error) {
    console.error('Erro ao formatar data:', dateString, error);
    return '';
  }
};

/**
 * Busca uma reserva específica por ID (do usuário logado)
 */
export const fetchMinhaReservaPorId = async (reservaId) => {
  try {
    console.log('Buscando reserva por ID:', reservaId);
    
    // Busca todas as reservas do usuário através do endpoint permitido
    const response = await fetch(`${API_BASE_URL}/minhas`, {
      method: 'GET',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Resposta da API (minhas reservas):', data);
    
    // Encontrar a reserva específica
    const reservas = Array.isArray(data) ? data : (data.data || []);
    const reservaEncontrada = reservas.find(r => r.id == reservaId);
    
    if (!reservaEncontrada) {
      return {
        sucesso: false,
        erro: 'Reserva não encontrada ou não pertence ao usuário'
      };
    }
    
    // Normalizar os dados da reserva
    const reservaNormalizada = normalizeMinhaReservaData(reservaEncontrada);
    
    return {
      sucesso: true,
      dados: reservaNormalizada
    };

  } catch (error) {
    console.error('Erro ao buscar reserva por ID:', error);
    return {
      sucesso: false,
      erro: error.message || 'Erro interno do servidor'
    };
  }
};

/**
 * Busca viajantes de uma reserva específica
 */
export const fetchViajantesReserva = async (reservaId) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return {
        sucesso: false,
        erro: 'Token de autenticação não encontrado'
      };
    }
    
    const response = await fetch(`http://localhost:5295/api/Viajante`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (response.status === 403) {
      return {
        sucesso: false,
        erro: 'Acesso negado - sem permissão para visualizar viajantes'
      };
    }

    if (response.status === 401) {
      return {
        sucesso: false,
        erro: 'Sessão expirada - faça login novamente'
      };
    }

    if (response.ok) {
      const data = await response.json();
      const viajantes = Array.isArray(data) ? data : (data.data || []);
      
      // Filtrar viajantes da reserva específica
      const viagantesDaReserva = viajantes.filter(v => v.reservaId == reservaId);
      
      return {
        sucesso: true,
        dados: viagantesDaReserva
      };
    } else {
      return {
        sucesso: false,
        erro: `Erro ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    console.error('Erro ao buscar viajantes da reserva:', error);
    return {
      sucesso: false,
      erro: 'Erro de conexão com o servidor'
    };
  }
};

/**
 * Busca detalhes completos de um pacote
 */
export const fetchPacoteDetalhes = async (pacoteId) => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`http://localhost:5295/api/Pacotes/${pacoteId}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
    });

    if (response.status === 403) {
      return {
        sucesso: false,
        erro: 'Acesso negado - sem permissão para visualizar detalhes do pacote'
      };
    }

    if (response.status === 401) {
      return {
        sucesso: false,
        erro: 'Sessão expirada - faça login novamente'
      };
    }

    if (response.ok) {
      const data = await response.json();
      return {
        sucesso: true,
        dados: data.data || data
      };
    } else {
      return {
        sucesso: false,
        erro: `Erro ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    console.error('Erro ao buscar detalhes do pacote:', error);
    return {
      sucesso: false,
      erro: 'Erro de conexão com o servidor'
    };
  }
};

/**
 * Busca pagamentos de uma reserva específica
 */
export const fetchPagamentosReserva = async (reservaId) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      return {
        sucesso: false,
        erro: 'Token de autenticação não encontrado'
      };
    }
    
    const response = await fetch(`http://localhost:5295/api/Pagamento`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    if (response.status === 403) {
      return {
        sucesso: false,
        erro: 'Acesso negado - sem permissão para visualizar pagamentos'
      };
    }

    if (response.status === 401) {
      return {
        sucesso: false,
        erro: 'Sessão expirada - faça login novamente'
      };
    }

    if (response.ok) {
      const data = await response.json();
      const pagamentos = Array.isArray(data) ? data : (data.data || []);
      
      // Filtrar pagamentos da reserva específica
      const pagamentosDaReserva = pagamentos.filter(p => p.reservaId == reservaId);
      
      return {
        sucesso: true,
        dados: pagamentosDaReserva
      };
    } else {
      return {
        sucesso: false,
        erro: `Erro ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    console.error('Erro ao buscar pagamentos da reserva:', error);
    return {
      sucesso: false,
      erro: 'Erro de conexão com o servidor'
    };
  }
};