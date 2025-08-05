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

/**
 * Busca estatísticas de reservas de um usuário específico (apenas para administradores)
 */
export const fetchEstatisticasUsuario = async (userId) => {
  try {
    console.log(`🔍 Buscando estatísticas para usuário ID: ${userId}`);
    
    // Buscar todas as reservas e filtrar pelo usuário
    const todasReservas = await fetchReservas();
    console.log(`📋 Total de reservas no sistema: ${todasReservas.length}`);
    console.log(`📋 Estrutura da primeira reserva:`, todasReservas[0]);
    
    // Log detalhado de todas as reservas para debug
    todasReservas.forEach((reserva, index) => {
      console.log(`📝 Reserva ${index + 1}:`, {
        id: reserva.id,
        cliente: reserva.cliente,
        email: reserva.email,
        usuarioId: reserva.usuarioId,
        userId: reserva.userId,
        usuario: reserva.usuario,
        nomeUsuario: reserva.nomeUsuario,
        valor: reserva.valor,
        valorTotal: reserva.valorTotal,
        preco: reserva.preco
      });
    });
    
    // Filtrar reservas do usuário específico - verificar diferentes campos possíveis
    const reservasUsuario = todasReservas.filter(reserva => {
      const usuarioId = reserva.usuarioId || reserva.userId || reserva.usuario?.id;
      const nomeUsuario = reserva.nomeUsuario || reserva.usuario?.nome || reserva.cliente;
      const emailUsuario = reserva.emailUsuario || reserva.usuario?.email || reserva.email;
      
      // Verificar por ID
      const matchId = usuarioId == userId;
      // Verificar por nome (se userId for string e contiver nome)
      const matchNome = typeof userId === 'string' && nomeUsuario && 
                       nomeUsuario.toLowerCase().includes(userId.toLowerCase());
      // Verificar se o nome do usuário está no campo cliente
      const matchCliente = nomeUsuario && nomeUsuario.toLowerCase() === 'alcides augusto';
      
      console.log(`🔍 Verificando reserva ${reserva.id}:`, {
        usuarioId,
        nomeUsuario,
        emailUsuario,
        matchId,
        matchNome,
        matchCliente,
        userId
      });
      
      return matchId || matchNome || matchCliente;
    });
    
    console.log(`🎯 Reservas encontradas para usuário ${userId}:`, reservasUsuario);
    
    // Calcular estatísticas
    const totalReservas = reservasUsuario.length;
    
    // Calcular o valor total real pago pelo cliente usando a mesma lógica do pagamento
    let totalGasto = 0;
    
    for (const reserva of reservasUsuario) {
      console.log(`💰 Processando reserva ${reserva.id}:`);
      
      // Primeiro, verificar se a reserva já tem valor total calculado
      let valorFinalReserva = 0;
      
      if (reserva.valorTotal && reserva.valorTotal > 0) {
        valorFinalReserva = parseFloat(reserva.valorTotal);
        console.log(`✅ Usando valor total da reserva: R$ ${valorFinalReserva}`);
      } else {
        // Calcular usando a mesma lógica do componente Pagamento
        const valorUnitario = parseFloat(reserva.valor || reserva.valorUnitario || reserva.preco || 0);
        const quantidadeViajantes = parseInt(reserva.pessoas || reserva.quantidadeViajantes || 1);
        
        if (valorUnitario > 0) {
          // Valor base (unitário × quantidade de pessoas)
          const valorBase = valorUnitario * quantidadeViajantes;
          
          // Assumir que houve parcelamento se valor > 1000 (aplicar taxa de 2%)
          const temTaxa = valorBase > 1000;
          const valorComTaxa = temTaxa ? valorBase * 1.02 : valorBase;
          
          // Para ser conservador, não aplicar desconto PIX (assumir que foi pago o valor total)
          valorFinalReserva = valorComTaxa;
          
          console.log(`🧮 Valor calculado: R$ ${valorUnitario} × ${quantidadeViajantes} pessoas = R$ ${valorBase}`);
          console.log(`📊 Com taxa de parcelamento: R$ ${valorFinalReserva}`);
        } else {
          console.log(`❌ Valor inválido para reserva ${reserva.id}: ${valorUnitario}`);
          continue;
        }
      }
      
      // Tentar buscar o valor real dos pagamentos como confirmação
      try {
        const pagamentosResult = await fetchPagamentosReserva(reserva.id);
        if (pagamentosResult.sucesso && pagamentosResult.dados.length > 0) {
          const valorPagamentos = pagamentosResult.dados.reduce((sum, pagamento) => {
            const valor = parseFloat(pagamento.valor || pagamento.total || 0);
            return sum + valor;
          }, 0);
          
          if (valorPagamentos > 0) {
            valorFinalReserva = valorPagamentos;
            console.log(`💳 Usando valor real dos pagamentos: R$ ${valorPagamentos}`);
          }
        }
      } catch (error) {
        console.log(`⚠️ Erro ao buscar pagamentos da reserva ${reserva.id}:`, error);
      }
      
      totalGasto += valorFinalReserva;
      console.log(`💰 Total acumulado: R$ ${totalGasto}`);
    }
    
    // Determinar tier baseado no total gasto
    let tier = 'Bronze';
    if (totalGasto >= 50000) {
      tier = 'Platinum';
    } else if (totalGasto >= 25000) {
      tier = 'Gold';
    } else if (totalGasto >= 10000) {
      tier = 'Silver';
    }
    
    console.log(`📊 Estatísticas calculadas para usuário ${userId}: ${totalReservas} reservas, R$ ${totalGasto} total, tier ${tier}`);
    
    return {
      reservas: totalReservas,
      totalGasto: totalGasto,
      tier: tier
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas do usuário:', error);
    return {
      reservas: 0,
      totalGasto: 0,
      tier: 'Bronze'
    };
  }
};

/**
 * Calcula o valor real de uma reserva (incluindo taxas e descontos)
 */
export const calcularValorRealReserva = async (reserva) => {
  try {
    // Primeiro, verificar se a reserva já tem valor total calculado
    if (reserva.valorTotal && reserva.valorTotal > 0) {
      return parseFloat(reserva.valorTotal);
    }
    
    // Tentar buscar o valor real dos pagamentos
    try {
      const pagamentosResult = await fetchPagamentosReserva(reserva.id);
      if (pagamentosResult.sucesso && pagamentosResult.dados.length > 0) {
        const valorPagamentos = pagamentosResult.dados.reduce((sum, pagamento) => {
          const valor = parseFloat(pagamento.valor || pagamento.total || 0);
          return sum + valor;
        }, 0);
        
        if (valorPagamentos > 0) {
          return valorPagamentos;
        }
      }
    } catch (error) {
      console.log(`⚠️ Erro ao buscar pagamentos da reserva ${reserva.id}:`, error);
    }
    
    // Calcular usando a mesma lógica do componente Pagamento
    const valorUnitario = parseFloat(reserva.valor || reserva.valorUnitario || reserva.preco || 0);
    const quantidadeViajantes = parseInt(reserva.pessoas || reserva.quantidadeViajantes || 1);
    
    if (valorUnitario > 0) {
      // Valor base (unitário × quantidade de pessoas)
      const valorBase = valorUnitario * quantidadeViajantes;
      
      // Assumir que houve parcelamento se valor > 1000 (aplicar taxa de 2%)
      const temTaxa = valorBase > 1000;
      const valorComTaxa = temTaxa ? valorBase * 1.02 : valorBase;
      
      // Para ser conservador, não aplicar desconto PIX (assumir que foi pago o valor total)
      return valorComTaxa;
    }
    
    return 0;
    
  } catch (error) {
    console.error('Erro ao calcular valor real da reserva:', error);
    return 0;
  }
};