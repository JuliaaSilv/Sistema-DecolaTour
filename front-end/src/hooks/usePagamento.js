import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://localhost:7042/api';

// Hook personalizado para gerenciar pagamentos
export const usePagamento = () => {
  const [pagamentos, setPagamentos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Buscar todos os pagamentos
  const buscarPagamentos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/Pagamento`);
      setPagamentos(response.data);
    } catch (err) {
      setError('Erro ao buscar pagamentos');
      console.error('Erro ao buscar pagamentos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar pagamentos por reserva
  const buscarPagamentosPorReserva = useCallback(async (reservaId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/Pagamento/reserva/${reservaId}`);
      return response.data;
    } catch (err) {
      setError('Erro ao buscar pagamentos da reserva');
      console.error('Erro ao buscar pagamentos da reserva:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar pagamento por ID
  const buscarPagamentoPorId = useCallback(async (pagamentoId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Pagamento/${pagamentoId}`);
      return response.data;
    } catch (err) {
      console.error('Erro ao buscar pagamento:', err);
      return null;
    }
  }, []);

  // Processar pagamento completo
  const processarPagamento = useCallback(async (dadosPagamento) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/Pagamento/processar`, dadosPagamento);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.erro || 'Erro ao processar pagamento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Simular webhook manualmente
  const simularWebhook = useCallback(async (pagamentoId, status = 'Pago') => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Pagamento/webhook/simular/${pagamentoId}?status=${status}`
      );
      return response.data;
    } catch (err) {
      console.error('Erro ao simular webhook:', err);
      throw err;
    }
  }, []);

  // Monitorar status de pagamento (polling)
  const monitorarStatusPagamento = useCallback((pagamentoId, callback, interval = 2000) => {
    const intervalId = setInterval(async () => {
      try {
        const pagamento = await buscarPagamentoPorId(pagamentoId);
        if (pagamento) {
          callback(pagamento);
          
          // Parar o monitoramento se status for final
          if (['Pago', 'Rejeitado', 'Reembolsado'].includes(pagamento.statusPagamento)) {
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error('Erro ao monitorar status:', error);
      }
    }, interval);

    // Retornar função para limpar o interval
    return () => clearInterval(intervalId);
  }, [buscarPagamentoPorId]);

  return {
    pagamentos,
    loading,
    error,
    buscarPagamentos,
    buscarPagamentosPorReserva,
    buscarPagamentoPorId,
    processarPagamento,
    simularWebhook,
    monitorarStatusPagamento,
    setError // Para limpar erros manualmente
  };
};

// Hook para formatação e utilitários de pagamento
export const usePagamentoUtils = () => {
  const formatarMoeda = useCallback((valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  }, []);

  const formatarStatusPagamento = useCallback((status) => {
    const statusMap = {
      'Pendente': { label: 'Pendente', color: 'yellow', icon: '⏳' },
      'Pago': { label: 'Pago', color: 'green', icon: '✅' },
      'Rejeitado': { label: 'Rejeitado', color: 'red', icon: '❌' },
      'Reembolsado': { label: 'Reembolsado', color: 'blue', icon: '↩️' }
    };
    
    return statusMap[status] || { label: status, color: 'gray', icon: '❓' };
  }, []);

  const formatarFormaPagamento = useCallback((forma) => {
    const formaMap = {
      'CartaoCredito': { label: 'Cartão de Crédito', icon: '💳' },
      'CartaoDebito': { label: 'Cartão de Débito', icon: '💳' },
      'Pix': { label: 'PIX', icon: '🔄' },
      'Boleto': { label: 'Boleto', icon: '📄' }
    };
    
    return formaMap[forma] || { label: forma, icon: '💰' };
  }, []);

  const obterClassesStatusPagamento = useCallback((status) => {
    const classes = {
      'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Pago': 'bg-green-100 text-green-800 border-green-200',
      'Rejeitado': 'bg-red-100 text-red-800 border-red-200',
      'Reembolsado': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    
    return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  }, []);

  const validarDadosPagamento = useCallback((formaPagamento, dados) => {
    const erros = [];

    switch (formaPagamento) {
      case 'Pix':
        if (!dados.dadosPix?.chavePix) {
          erros.push('Chave PIX é obrigatória');
        }
        break;

      case 'CartaoCredito':
      case 'CartaoDebito':
        if (!dados.dadosCartao?.numeroCartao) {
          erros.push('Número do cartão é obrigatório');
        } else if (dados.dadosCartao.numeroCartao.replace(/\s/g, '').length < 13) {
          erros.push('Número do cartão inválido');
        }
        
        if (!dados.dadosCartao?.nomePortador) {
          erros.push('Nome do portador é obrigatório');
        }
        
        if (!dados.dadosCartao?.cvv) {
          erros.push('CVV é obrigatório');
        } else if (dados.dadosCartao.cvv.length < 3) {
          erros.push('CVV deve ter pelo menos 3 dígitos');
        }
        
        if (!dados.dadosCartao?.validadeMes || !dados.dadosCartao?.validadeAno) {
          erros.push('Validade do cartão é obrigatória');
        }
        break;

      case 'Boleto':
        if (!dados.dadosBoleto?.cpfPagador) {
          erros.push('CPF do pagador é obrigatório');
        }
        
        if (!dados.dadosBoleto?.nomePagador) {
          erros.push('Nome do pagador é obrigatório');
        }
        break;
    }

    if (!dados.email) {
      erros.push('Email é obrigatório');
    } else if (!/\S+@\S+\.\S+/.test(dados.email)) {
      erros.push('Email deve ter formato válido');
    }

    return {
      valido: erros.length === 0,
      erros
    };
  }, []);

  return {
    formatarMoeda,
    formatarStatusPagamento,
    formatarFormaPagamento,
    obterClassesStatusPagamento,
    validarDadosPagamento
  };
};

export default usePagamento;
