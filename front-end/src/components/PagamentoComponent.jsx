import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente principal para processar pagamentos
const PagamentoComponent = ({ reservaId, onPagamentoCompleto, onPagamentoErro }) => {
  const [formaPagamento, setFormaPagamento] = useState('');
  const [dadosPagamento, setDadosPagamento] = useState({});
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resposta, setResposta] = useState(null);
  const [comprovante, setComprovante] = useState(null);
  const [statusWebhook, setStatusWebhook] = useState(null);

  const API_BASE_URL = 'https://localhost:7042/api';

  // Mapear formas de pagamento para enum
  const formasPagamento = {
    'CartaoCredito': 0,
    'CartaoDebito': 1,
    'Pix': 2,
    'Boleto': 3
  };

  const processarPagamento = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResposta(null);
    setComprovante(null);

    try {
      const payload = {
        reservaId: reservaId,
        formaDePagamento: formasPagamento[formaPagamento],
        email: email,
        ...dadosPagamento
      };

      const response = await axios.post(`${API_BASE_URL}/Pagamento/processar`, payload);
      
      setResposta(response.data);
      
      if (response.data.sucesso) {
        setComprovante(response.data.comprovante);
        onPagamentoCompleto?.(response.data);
        
        // Se há webhook estimado, agendar verificação de status
        if (response.data.tempoEstimadoWebhook) {
          setTimeout(() => {
            verificarStatusPagamento(response.data.pagamentoId);
          }, (response.data.tempoEstimadoWebhook + 1) * 1000);
        }
      } else {
        onPagamentoErro?.(response.data);
      }
    } catch (error) {
      const errorData = {
        sucesso: false,
        mensagem: error.response?.data?.erro || 'Erro ao processar pagamento',
        codigoErro: 'NETWORK_ERROR'
      };
      setResposta(errorData);
      onPagamentoErro?.(errorData);
    } finally {
      setLoading(false);
    }
  };

  const verificarStatusPagamento = async (pagamentoId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Pagamento/${pagamentoId}`);
      const statusAtual = response.data.statusPagamento;
      
      setStatusWebhook({
        status: statusAtual,
        timestamp: new Date()
      });

      // Atualizar resposta com novo status
      setResposta(prev => ({
        ...prev,
        status: statusAtual
      }));
      
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    }
  };

  const renderFormaPagamento = () => {
    switch (formaPagamento) {
      case 'Pix':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Chave PIX</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Digite sua chave PIX"
                onChange={(e) => setDadosPagamento({
                  dadosPix: {
                    chavePix: e.target.value,
                    tipoChave: 'email'
                  }
                })}
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Use "teste@falha.com" para simular falha
              </p>
            </div>
          </div>
        );

      case 'CartaoCredito':
      case 'CartaoDebito':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Número do Cartão</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="1234 5678 9012 3456"
                onChange={(e) => setDadosPagamento(prev => ({
                  ...prev,
                  dadosCartao: {
                    ...prev.dadosCartao,
                    numeroCartao: e.target.value.replace(/\s/g, '')
                  }
                }))}
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 Cartões terminados em "0000" falham
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome no Cartão</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  onChange={(e) => setDadosPagamento(prev => ({
                    ...prev,
                    dadosCartao: {
                      ...prev.dadosCartao,
                      nomePortador: e.target.value
                    }
                  }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  maxLength="3"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="123"
                  onChange={(e) => setDadosPagamento(prev => ({
                    ...prev,
                    dadosCartao: {
                      ...prev.dadosCartao,
                      cvv: e.target.value
                    }
                  }))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 CVV "000" falha
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mês</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  onChange={(e) => setDadosPagamento(prev => ({
                    ...prev,
                    dadosCartao: {
                      ...prev.dadosCartao,
                      validadeMes: e.target.value
                    }
                  }))}
                >
                  <option value="">Mês</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Ano</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  onChange={(e) => setDadosPagamento(prev => ({
                    ...prev,
                    dadosCartao: {
                      ...prev.dadosCartao,
                      validadeAno: e.target.value
                    }
                  }))}
                >
                  <option value="">Ano</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={2024 + i} value={2024 + i}>
                      {2024 + i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formaPagamento === 'CartaoCredito' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Parcelas</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  onChange={(e) => setDadosPagamento(prev => ({
                    ...prev,
                    dadosCartao: {
                      ...prev.dadosCartao,
                      parcelas: parseInt(e.target.value)
                    }
                  }))}
                >
                  <option value="1">1x sem juros</option>
                  <option value="2">2x sem juros</option>
                  <option value="3">3x sem juros</option>
                  <option value="6">6x com juros</option>
                  <option value="12">12x com juros</option>
                </select>
              </div>
            )}
          </div>
        );

      case 'Boleto':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">CPF do Pagador</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="000.000.000-00"
                onChange={(e) => setDadosPagamento({
                  dadosBoleto: {
                    cpfPagador: e.target.value.replace(/\D/g, ''),
                    nomePagador: dadosPagamento.dadosBoleto?.nomePagador || '',
                    dataVencimento: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                  }
                })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome do Pagador</label>
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                onChange={(e) => setDadosPagamento(prev => ({
                  dadosBoleto: {
                    ...prev.dadosBoleto,
                    nomePagador: e.target.value
                  }
                }))}
              />
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                💡 O boleto será gerado instantaneamente e o pagamento será confirmado automaticamente em 10-15 segundos via webhook simulado.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderComprovante = () => {
    if (!comprovante) return null;

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">✅ Comprovante de Pagamento</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">ID Comprovante:</span>
            <p className="text-gray-600">{comprovante.idComprovante}</p>
          </div>
          
          <div>
            <span className="font-medium">Forma de Pagamento:</span>
            <p className="text-gray-600">{comprovante.formaPagamento}</p>
          </div>
          
          <div>
            <span className="font-medium">Valor:</span>
            <p className="text-gray-600">R$ {comprovante.valor.toFixed(2)}</p>
          </div>
          
          <div>
            <span className="font-medium">Data:</span>
            <p className="text-gray-600">{new Date(comprovante.dataPagamento).toLocaleString()}</p>
          </div>
          
          <div>
            <span className="font-medium">Código Transação:</span>
            <p className="text-gray-600">{comprovante.codigoTransacao}</p>
          </div>
          
          <div>
            <span className="font-medium">Status:</span>
            <p className="text-gray-600">{comprovante.status}</p>
          </div>
        </div>

        {comprovante.qrCodePix && (
          <div className="mt-4">
            <span className="font-medium">QR Code PIX:</span>
            <p className="text-xs text-gray-600 break-all bg-gray-100 p-2 rounded mt-1">
              {comprovante.qrCodePix}
            </p>
          </div>
        )}

        {comprovante.codigoBarras && (
          <div className="mt-4">
            <span className="font-medium">Código de Barras:</span>
            <p className="font-mono text-xs text-gray-600 break-all bg-gray-100 p-2 rounded mt-1">
              {comprovante.codigoBarras}
            </p>
          </div>
        )}

        {comprovante.autorizacaoCartao && (
          <div className="mt-4">
            <span className="font-medium">Autorização:</span>
            <p className="text-gray-600">{comprovante.autorizacaoCartao}</p>
          </div>
        )}
      </div>
    );
  };

  const renderStatusWebhook = () => {
    if (!statusWebhook) return null;

    const isAprovado = statusWebhook.status === 'Pago';
    const bgColor = isAprovado ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
    const textColor = isAprovado ? 'text-green-800' : 'text-red-800';

    return (
      <div className={`${bgColor} border rounded-lg p-4 mt-4`}>
        <h4 className={`font-semibold ${textColor}`}>
          🔄 Atualização via Webhook
        </h4>
        <p className={`text-sm ${textColor}`}>
          Status atualizado para: <strong>{statusWebhook.status}</strong>
        </p>
        <p className="text-xs text-gray-600">
          Atualizado em: {statusWebhook.timestamp.toLocaleString()}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">💳 Processar Pagamento</h2>
      
      <form onSubmit={processarPagamento} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email para Comprovante</label>
          <input
            type="email"
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Forma de Pagamento</label>
          <select
            required
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            value={formaPagamento}
            onChange={(e) => setFormaPagamento(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="Pix">PIX</option>
            <option value="CartaoCredito">Cartão de Crédito</option>
            <option value="CartaoDebito">Cartão de Débito</option>
            <option value="Boleto">Boleto</option>
          </select>
        </div>

        {renderFormaPagamento()}

        <button
          type="submit"
          disabled={loading || !formaPagamento}
          className={`w-full py-3 px-4 rounded-md font-medium ${
            loading || !formaPagamento
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {loading ? '⏳ Processando...' : '💳 Processar Pagamento'}
        </button>
      </form>

      {/* Resposta do pagamento */}
      {resposta && (
        <div className={`mt-6 p-4 rounded-lg border ${
          resposta.sucesso 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <h3 className="font-semibold">
            {resposta.sucesso ? '✅ Sucesso' : '❌ Erro'}
          </h3>
          <p className="mt-1">{resposta.mensagem}</p>
          
          {resposta.pagamentoId && (
            <p className="text-sm mt-2">ID do Pagamento: {resposta.pagamentoId}</p>
          )}
          
          {resposta.tempoEstimadoWebhook && (
            <p className="text-sm mt-2">
              ⏱️ Webhook estimado em {resposta.tempoEstimadoWebhook} segundos
            </p>
          )}
        </div>
      )}

      {renderComprovante()}
      {renderStatusWebhook()}

      {/* Instruções de teste */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">📋 Cenários de Teste</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>PIX:</strong> Use "teste@falha.com" para simular falha</p>
          <p><strong>Cartão:</strong> Números terminados em "0000" ou CVV "000" falham</p>
          <p><strong>Débito:</strong> Valores acima de R$ 5000 também falham</p>
          <p><strong>Boleto:</strong> Sempre gera com sucesso, pagamento confirmado via webhook</p>
        </div>
      </div>
    </div>
  );
};

export default PagamentoComponent;
