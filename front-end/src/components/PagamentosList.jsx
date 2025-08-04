import React, { useState, useEffect } from 'react';
import { usePagamento, usePagamentoUtils } from '../hooks/usePagamento';

const PagamentosList = ({ reservaId = null, showActions = true }) => {
  const {
    pagamentos,
    loading,
    error,
    buscarPagamentos,
    buscarPagamentosPorReserva,
    simularWebhook,
    monitorarStatusPagamento
  } = usePagamento();

  const {
    formatarMoeda,
    formatarStatusPagamento,
    formatarFormaPagamento,
    obterClassesStatusPagamento
  } = usePagamentoUtils();

  const [pagamentosFiltrados, setPagamentosFiltrados] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('');
  const [monitorandoPagamentos, setMonitorandoPagamentos] = useState(new Set());

  useEffect(() => {
    const carregarPagamentos = async () => {
      if (reservaId) {
        const resultado = await buscarPagamentosPorReserva(reservaId);
        setPagamentosFiltrados(resultado);
      } else {
        await buscarPagamentos();
      }
    };

    carregarPagamentos();
  }, [reservaId, buscarPagamentos, buscarPagamentosPorReserva]);

  useEffect(() => {
    if (!reservaId) {
      const filtered = filtroStatus 
        ? pagamentos.filter(p => p.statusPagamento === filtroStatus)
        : pagamentos;
      setPagamentosFiltrados(filtered);
    }
  }, [pagamentos, filtroStatus, reservaId]);

  const handleSimularWebhook = async (pagamentoId, novoStatus) => {
    try {
      await simularWebhook(pagamentoId, novoStatus);
      
      // Recarregar lista após webhook
      setTimeout(() => {
        if (reservaId) {
          buscarPagamentosPorReserva(reservaId).then(setPagamentosFiltrados);
        } else {
          buscarPagamentos();
        }
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao simular webhook:', error);
    }
  };

  const iniciarMonitoramento = (pagamentoId) => {
    if (monitorandoPagamentos.has(pagamentoId)) return;

    setMonitorandoPagamentos(prev => new Set([...prev, pagamentoId]));

    const pararMonitoramento = monitorarStatusPagamento(
      pagamentoId,
      (pagamentoAtualizado) => {
        // Atualizar lista com novo status
        setPagamentosFiltrados(prev => 
          prev.map(p => 
            p.id === pagamentoId 
              ? { ...p, statusPagamento: pagamentoAtualizado.statusPagamento }
              : p
          )
        );

        // Se status for final, parar monitoramento
        if (['Pago', 'Rejeitado', 'Reembolsado'].includes(pagamentoAtualizado.statusPagamento)) {
          setMonitorandoPagamentos(prev => {
            const newSet = new Set(prev);
            newSet.delete(pagamentoId);
            return newSet;
          });
        }
      }
    );

    // Limpar monitoramento após 2 minutos
    setTimeout(() => {
      pararMonitoramento();
      setMonitorandoPagamentos(prev => {
        const newSet = new Set(prev);
        newSet.delete(pagamentoId);
        return newSet;
      });
    }, 120000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Carregando pagamentos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="text-red-400">❌</div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Erro</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            💳 Pagamentos {reservaId ? `- Reserva #${reservaId}` : ''}
          </h3>
          
          {!reservaId && (
            <div className="flex items-center space-x-4">
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="">Todos os status</option>
                <option value="Pendente">Pendente</option>
                <option value="Pago">Pago</option>
                <option value="Rejeitado">Rejeitado</option>
                <option value="Reembolsado">Reembolsado</option>
              </select>
              
              <button
                onClick={() => reservaId ? buscarPagamentosPorReserva(reservaId).then(setPagamentosFiltrados) : buscarPagamentos()}
                className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700"
              >
                🔄 Atualizar
              </button>
            </div>
          )}
        </div>
      </div>

      {pagamentosFiltrados.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <div className="text-4xl mb-4">💳</div>
          <p>Nenhum pagamento encontrado</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forma de Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                {showActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagamentosFiltrados.map((pagamento) => {
                const statusInfo = formatarStatusPagamento(pagamento.statusPagamento);
                const formaInfo = formatarFormaPagamento(pagamento.formaDePagamento);
                const isMonitorando = monitorandoPagamentos.has(pagamento.id);

                return (
                  <tr key={pagamento.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{pagamento.id}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="mr-2">{formaInfo.icon}</span>
                        {formaInfo.label}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatarMoeda(pagamento.valor)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${obterClassesStatusPagamento(pagamento.statusPagamento)}`}
                        >
                          <span className="mr-1">{statusInfo.icon}</span>
                          {statusInfo.label}
                        </span>
                        
                        {isMonitorando && (
                          <div className="ml-2 flex items-center text-blue-600">
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                          </div>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pagamento.dataPagamento).toLocaleString('pt-BR')}
                    </td>
                    
                    {showActions && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          {pagamento.statusPagamento === 'Pendente' && (
                            <>
                              <button
                                onClick={() => handleSimularWebhook(pagamento.id, 'Pago')}
                                className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                                title="Simular pagamento aprovado"
                              >
                                ✅ Aprovar
                              </button>
                              
                              <button
                                onClick={() => handleSimularWebhook(pagamento.id, 'Rejeitado')}
                                className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                                title="Simular pagamento rejeitado"
                              >
                                ❌ Rejeitar
                              </button>
                            </>
                          )}
                          
                          {pagamento.statusPagamento === 'Pago' && (
                            <button
                              onClick={() => handleSimularWebhook(pagamento.id, 'Reembolsado')}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                              title="Simular reembolso"
                            >
                              ↩️ Reembolsar
                            </button>
                          )}
                          
                          {pagamento.statusPagamento === 'Pendente' && !isMonitorando && (
                            <button
                              onClick={() => iniciarMonitoramento(pagamento.id)}
                              className="bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700"
                              title="Monitorar status automaticamente"
                            >
                              👁️ Monitorar
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Resumo dos pagamentos */}
      {pagamentosFiltrados.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Total de pagamentos:</span>
              <p className="font-medium">{pagamentosFiltrados.length}</p>
            </div>
            
            <div>
              <span className="text-gray-500">Valor total:</span>
              <p className="font-medium">
                {formatarMoeda(
                  pagamentosFiltrados.reduce((sum, p) => sum + p.valor, 0)
                )}
              </p>
            </div>
            
            <div>
              <span className="text-gray-500">Aprovados:</span>
              <p className="font-medium text-green-600">
                {pagamentosFiltrados.filter(p => p.statusPagamento === 'Pago').length}
              </p>
            </div>
            
            <div>
              <span className="text-gray-500">Pendentes:</span>
              <p className="font-medium text-yellow-600">
                {pagamentosFiltrados.filter(p => p.statusPagamento === 'Pendente').length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagamentosList;
