/**
 * API para integração com sistema de pagamentos
 */

const API_URL = 'http://localhost:5295/api';

/**
 * Processa um pagamento completo
 */
export async function processarPagamento(dadosPagamento) {
  try {
    const token = localStorage.getItem('token');
    
    console.log('Dados originais recebidos:', dadosPagamento);
    
    // Converte para o formato esperado pelo backend
    const dadosFormatados = {
      reservaId: dadosPagamento.reservaId,
      formaDePagamento: dadosPagamento.formaDePagamento,
      email: dadosPagamento.email
    };

    // Adiciona dados específicos baseado na forma de pagamento
    if (dadosPagamento.formaDePagamento === 0 || dadosPagamento.formaDePagamento === 1) {
      // Cartão de crédito ou débito
      dadosFormatados.dadosCartao = {
        numeroCartao: dadosPagamento.dadosCartao?.numeroCartao || '',
        nomePortador: dadosPagamento.dadosCartao?.nomePortador || '',
        validadeMes: dadosPagamento.dadosCartao?.validadeMes || '',
        validadeAno: dadosPagamento.dadosCartao?.validadeAno || '',
        cvv: dadosPagamento.dadosCartao?.cvv || '',
        parcelas: dadosPagamento.dadosCartao?.parcelas || 1
      };
    } else if (dadosPagamento.formaDePagamento === 2) {
      // PIX
      dadosFormatados.dadosPix = {
        chavePix: dadosPagamento.dadosPix?.chavePix || dadosPagamento.email,
        tipoChave: 'email'
      };
    } else if (dadosPagamento.formaDePagamento === 3) {
      // Boleto
      dadosFormatados.dadosBoleto = {
        cpfPagador: dadosPagamento.dadosBoleto?.cpfPagador || '',
        nomePagador: dadosPagamento.dadosBoleto?.nomePagador || '',
        dataVencimento: dadosPagamento.dadosBoleto?.dataVencimento || null
      };
    }
    
    console.log('Enviando dados formatados para pagamento:', dadosFormatados);
    
    const response = await fetch(`${API_URL}/Pagamento/processar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(dadosFormatados),
    });

    const data = await response.json();
    
    console.log('Resposta do servidor:', { status: response.status, data });
    
    if (response.ok) {
      return { sucesso: true, dados: data };
    } else {
      return { 
        sucesso: false, 
        erro: data.erro || data.mensagem || data.message || 'Erro ao processar pagamento' 
      };
    }
  } catch (error) {
    console.error('Erro na requisição de pagamento:', error);
    return { 
      sucesso: false, 
      erro: 'Erro de conexão com o servidor' 
    };
  }
}

/**
 * Cria uma nova reserva
 */
export async function criarReserva(dadosReserva) {
  try {
    const token = localStorage.getItem('token');
    
    // Calcular valores antes de enviar
    const quantidadeViajantes = dadosReserva.viajantes ? dadosReserva.viajantes.length : 1;
    const valorTotal = dadosReserva.valorUnitario * quantidadeViajantes;
    
    // Incluir campos calculados na requisição
    const dadosCompletos = {
      ...dadosReserva,
      quantidadeViajantes: quantidadeViajantes,
      valorTotal: valorTotal
    };
    
    console.log('Criando reserva com dados completos:', dadosCompletos);
    console.log('Data da viagem enviada:', dadosCompletos.dataViagem);
    console.log('Tipo da data:', typeof dadosCompletos.dataViagem);
    
    const response = await fetch(`${API_URL}/Reserva`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify(dadosCompletos),
    });

    let data;
    try {
      data = await response.json();
    } catch (error) {
      // Se não conseguir fazer parse do JSON, provavelmente é uma página de erro HTML
      const textResponse = await response.text();
      console.error('Resposta não é JSON válido:', textResponse);
      return { 
        sucesso: false, 
        erro: `Erro do servidor (${response.status}): ${response.statusText}` 
      };
    }
    
    if (response.ok) {
      // O backend pode retornar diferentes estruturas:
      // { data: { id: ... }, error: null, statusCode: 201 }
      // { mensagem: '...', reserva: { id: ... } }
      // { id: ... } (direto)
      let reservaData = data;
      
      if (data.data) {
        reservaData = data.data;
      } else if (data.reserva) {
        reservaData = data.reserva;
      }
      
      console.log('Reserva criada com sucesso:', reservaData);
      
      // Agora criar os viajantes para a reserva
      if (dadosReserva.viajantes && dadosReserva.viajantes.length > 0) {
        console.log('Criando viajantes para a reserva...');
        
        for (const viajante of dadosReserva.viajantes) {
          const viajanteData = {
            nome: viajante.nome,
            documento: viajante.documento || viajante.cpf || '11111111111',
            passaporte: viajante.passaporte || 'BR123456789',
            reservaId: reservaData.id
          };
          
          try {
            const viajanteResponse = await fetch(`${API_URL}/Viajante`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
              },
              body: JSON.stringify(viajanteData),
            });
            
            if (viajanteResponse.ok) {
              console.log('Viajante criado:', viajante.nome);
            } else {
              const errorData = await viajanteResponse.json();
              console.warn('Erro ao criar viajante:', viajante.nome, errorData);
            }
          } catch (error) {
            console.warn('Erro ao criar viajante:', error);
          }
        }
        
        // Calcular valor total correto: valor unitário × quantidade de viajantes
        const quantidadeViajantes = dadosReserva.viajantes.length;
        const valorTotal = dadosReserva.valorUnitario * quantidadeViajantes;
        
        console.log(`Valor calculado: ${dadosReserva.valorUnitario} × ${quantidadeViajantes} = ${valorTotal}`);
        
        // Tentar atualizar a reserva com os valores corretos se o backend permitir
        try {
          const atualizacaoReserva = {
            id: reservaData.id,
            quantidadeViajantes: quantidadeViajantes,
            valorTotal: valorTotal
          };
          
          const updateResponse = await fetch(`${API_URL}/Reserva/${reservaData.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify(atualizacaoReserva),
          });
          
          if (updateResponse.ok) {
            console.log('Reserva atualizada com valores corretos');
          } else {
            console.warn('Não foi possível atualizar a reserva com os valores corretos');
          }
        } catch (error) {
          console.warn('Erro ao tentar atualizar reserva:', error);
        }
        
        // Adicionar informações de cálculo à resposta
        reservaData.quantidadeViajantes = quantidadeViajantes;
        reservaData.valorTotal = valorTotal;
        reservaData.valorUnitarioOriginal = dadosReserva.valorUnitario;
      }
      
      return { sucesso: true, dados: reservaData };
    } else {
      return { 
        sucesso: false, 
        erro: data.error?.message || data.message || 'Erro ao criar reserva' 
      };
    }
  } catch (error) {
    console.error('Erro na criação da reserva:', error);
    return { 
      sucesso: false, 
      erro: 'Erro de conexão com o servidor' 
    };
  }
}

/**
 * Busca uma reserva por ID
 */
export async function buscarReservaPorId(id) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/Reserva/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { sucesso: true, dados: data.data };
    } else {
      return { 
        sucesso: false, 
        erro: 'Reserva não encontrada' 
      };
    }
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    return { 
      sucesso: false, 
      erro: 'Erro de conexão com o servidor' 
    };
  }
}

/**
 * Monitora o status de um pagamento
 */
export async function monitorarStatusPagamento(pagamentoId, callback, maxTentativas = 10) {
  let tentativas = 0;
  
  const verificarStatus = async () => {
    if (tentativas >= maxTentativas) {
      callback({ erro: 'Timeout ao monitorar pagamento' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/Pagamento/${pagamentoId}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        callback({ sucesso: true, dados: data });

        // Se status é final, para o monitoramento
        if (!['Pendente'].includes(data.statusPagamento)) {
          return;
        }
      }

      tentativas++;
      // Tenta novamente em 500ms para ser mais responsivo
      setTimeout(verificarStatus, 500);
    } catch (error) {
      console.error('Erro ao monitorar status:', error);
      tentativas++;
      if (tentativas < maxTentativas) {
        setTimeout(verificarStatus, 500);
      } else {
        callback({ erro: 'Erro ao monitorar pagamento' });
      }
    }
  };

  verificarStatus();
}

/**
 * Converte forma de pagamento do frontend para backend
 */
export function converterFormaPagamento(metodo) {
  const mapeamento = {
    'credito': 0,  // CartaoCredito
    'debito': 1,   // CartaoDebito  
    'pix': 2,      // Pix
    'boleto': 3    // Boleto
  };
  
  return mapeamento[metodo] ?? 0;
}

/**
 * Formata dados do cartão para o backend
 */
export function formatarDadosCartao(dadosCartao, parcelas = 1) {
  return {
    numeroCartao: dadosCartao.number?.replace(/\s/g, '') || '',
    nomePortador: dadosCartao.name || '',
    validadeMes: dadosCartao.expiry?.split('/')[0]?.padStart(2, '0') || '',
    validadeAno: '20' + (dadosCartao.expiry?.split('/')[1] || ''),
    cvv: dadosCartao.cvv || '',
    parcelas: parcelas
  };
}

/**
 * Formata dados do PIX para o backend
 */
export function formatarDadosPix(chavePix) {
  return {
    chavePix: chavePix || '',
    tipoChave: 'email' // Pode ser 'cpf', 'email', 'telefone', 'aleatoria'
  };
}

/**
 * Formata dados do boleto para o backend
 */
export function formatarDadosBoleto(dadosBoleto = {}) {
  return {
    cpfPagador: dadosBoleto.cpf || '',
    nomePagador: dadosBoleto.nome || '',
    dataVencimento: dadosBoleto.dataVencimento || null
  };
}

/**
 * Testa a conectividade com o backend
 */
export async function testarConectividade() {
  try {
    // Usa o endpoint de auth que sempre existe
    const response = await fetch(`${API_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: '', password: '' })
    });
    
    // Se retornou 400, significa que o endpoint existe e o servidor está funcionando
    return {
      conectado: true,
      status: response.status,
      statusText: response.status === 400 ? 'Conectado - Servidor funcionando' : response.statusText
    };
  } catch (error) {
    return {
      conectado: false,
      erro: error.message || 'Erro de conexão'
    };
  }
}

/**
 * Verifica se uma reserva existe
 */
export async function verificarReserva(reservaId) {
  try {
    const token = localStorage.getItem('token');
    
    // Primeiro tenta o endpoint direto (pode falhar se não tiver permissão)
    try {
      const response = await fetch(`${API_URL}/Reserva/${reservaId}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return { existe: true, dados: data.data || data };
      } else if (response.status === 403) {
        // Se der 403, tenta usar o endpoint de minhas reservas
        return await verificarReservaViaMinhasReservas(reservaId);
      } else {
        return { existe: false, erro: `Reserva ${reservaId} não encontrada` };
      }
    } catch (error) {
      // Se falhar, tenta método alternativo
      return await verificarReservaViaMinhasReservas(reservaId);
    }
  } catch (error) {
    return { existe: false, erro: error.message };
  }
}

/**
 * Lista reservas do usuário logado
 */
export async function listarMinhasReservas() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/Reserva/minhas`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return { sucesso: true, dados: Array.isArray(data) ? data : (data.data || []) };
    } else {
      return { sucesso: false, erro: 'Não foi possível carregar suas reservas' };
    }
  } catch (error) {
    return { sucesso: false, erro: `Erro ao carregar reservas: ${error.message}` };
  }
}

/**
 * Verifica se uma reserva tem viajantes associados
 */
export async function verificarViajantesReserva(reservaId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/Viajante`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const viajantes = Array.isArray(data) ? data : (data.data || []);
      const viagantesReserva = viajantes.filter(v => v.reservaId == reservaId);
      
      return {
        sucesso: true,
        temViajantes: viagantesReserva.length > 0,
        quantidade: viagantesReserva.length,
        viajantes: viagantesReserva
      };
    } else {
      return {
        sucesso: false,
        erro: 'Não foi possível verificar viajantes da reserva'
      };
    }
  } catch (error) {
    return {
      sucesso: false,
      erro: `Erro ao verificar viajantes: ${error.message}`
    };
  }
}

/**
 * Enriquece dados de uma reserva com informações adicionais
 */
export async function enriquecerDadosReserva(reserva) {
  try {
    const token = localStorage.getItem('token');
    
    // Buscar viajantes da reserva
    const viagantesResponse = await fetch(`${API_URL}/Viajante`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (viagantesResponse.ok) {
      const viagantesData = await viagantesResponse.json();
      const viajantesArray = Array.isArray(viagantesData) ? viagantesData : (viagantesData.data || []);
      const viagantesDaReserva = viajantesArray.filter(v => v.reservaId === reserva.id);
      
      // Atualizar dados da reserva
      reserva.quantidadeViajantes = viagantesDaReserva.length || 1;
      reserva.viajantes = viagantesDaReserva;
      
      console.log(`Reserva ${reserva.id} enriquecida: ${viagantesDaReserva.length} viajantes`);
    }
    
    // Buscar dados do pacote se possível
    if (reserva.pacoteId) {
      try {
        const pacoteResponse = await fetch(`${API_URL}/Pacotes/${reserva.pacoteId}`, {
          method: 'GET',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });
        
        if (pacoteResponse.ok) {
          const pacoteData = await pacoteResponse.json();
          const pacote = pacoteData.data || pacoteData;
          
          // Atualizar valor total se não estiver definido
          if (reserva.valorTotal === 0 && pacote.preco) {
            reserva.valorTotal = pacote.preco * (reserva.quantidadeViajantes || 1);
            reserva.valorUnitario = pacote.preco;
          }
          
          // Atualizar imagem se necessário
          if (!reserva.imagemPacoteUrl || reserva.imagemPacoteUrl.includes('System.Collections.Generic.List')) {
            if (pacote.imagens && pacote.imagens.length > 0) {
              reserva.imagemPacoteUrl = `http://localhost:5295${pacote.imagens[0].url}`;
            }
          }
          
          console.log(`Reserva ${reserva.id} enriquecida com dados do pacote`);
        }
      } catch (error) {
        console.warn(`Erro ao buscar dados do pacote ${reserva.pacoteId}:`, error);
      }
    }
    
    return reserva;
  } catch (error) {
    console.warn(`Erro ao enriquecer dados da reserva ${reserva.id}:`, error);
    return reserva;
  }
}

/**
 * Verifica reserva através do endpoint "minhas reservas"
 */
async function verificarReservaViaMinhasReservas(reservaId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/Reserva/minhas`, {
      method: 'GET',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const reservas = Array.isArray(data) ? data : (data.data || []);
      const reservaEncontrada = reservas.find(r => r.id == reservaId);
      
      if (reservaEncontrada) {
        return { existe: true, dados: reservaEncontrada };
      } else {
        return { 
          existe: false, 
          erro: `Reserva ${reservaId} não encontrada ou não pertence ao usuário`,
          sugestao: 'Tente com uma reserva que você criou'
        };
      }
    } else {
      return { existe: false, erro: 'Não foi possível verificar as reservas do usuário' };
    }
  } catch (error) {
    return { existe: false, erro: `Erro ao verificar via minhas reservas: ${error.message}` };
  }
}
