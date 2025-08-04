import React, { useState } from 'react';
import PagamentoComponent from '../components/PagamentoComponent';
import PagamentosList from '../components/PagamentosList';

const PagamentosPage = () => {
  const [activeTab, setActiveTab] = useState('processar');
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const [ultimoPagamento, setUltimoPagamento] = useState(null);

  const handlePagamentoCompleto = (resposta) => {
    setUltimoPagamento(resposta);
    
    // Mostrar notificação de sucesso
    if (resposta.sucesso) {
      // Você pode usar uma biblioteca de notificação aqui
      console.log('Pagamento processado com sucesso!', resposta);
      
      // Mudar para aba de listagem após 3 segundos
      setTimeout(() => {
        setActiveTab('listar');
      }, 3000);
    }
  };

  const handlePagamentoErro = (erro) => {
    console.error('Erro no pagamento:', erro);
    // Aqui você pode mostrar uma notificação de erro
  };

  const tabs = [
    { id: 'processar', label: '💳 Processar Pagamento', icon: '💳' },
    { id: 'listar', label: '📋 Listar Pagamentos', icon: '📋' },
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Pagamentos</h1>
          <p className="mt-2 text-gray-600">
            Gerencie pagamentos de reservas turísticas com simulação completa
          </p>
        </div>

        {/* Notificação do último pagamento */}
        {ultimoPagamento && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            ultimoPagamento.sucesso 
              ? 'bg-green-50 border-green-400' 
              : 'bg-red-50 border-red-400'
          }`}>
            <div className="flex">
              <div className={`text-2xl ${ultimoPagamento.sucesso ? 'text-green-400' : 'text-red-400'}`}>
                {ultimoPagamento.sucesso ? '✅' : '❌'}
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${
                  ultimoPagamento.sucesso ? 'text-green-800' : 'text-red-800'
                }`}>
                  {ultimoPagamento.sucesso ? 'Pagamento Processado!' : 'Erro no Pagamento'}
                </h3>
                <p className={`text-sm mt-1 ${
                  ultimoPagamento.sucesso ? 'text-green-700' : 'text-red-700'
                }`}>
                  {ultimoPagamento.mensagem}
                </p>
                {ultimoPagamento.pagamentoId && (
                  <p className="text-xs text-gray-600 mt-1">
                    ID do Pagamento: #{ultimoPagamento.pagamentoId}
                  </p>
                )}
              </div>
              <button
                onClick={() => setUltimoPagamento(null)}
                className="ml-auto text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Seletor de Reserva */}
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">🎒 Selecionar Reserva</h3>
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">ID da Reserva</label>
              <input
                type="number"
                min="1"
                className="mt-1 block w-32 border border-gray-300 rounded-md px-3 py-2"
                value={reservaSelecionada || ''}
                onChange={(e) => setReservaSelecionada(parseInt(e.target.value) || null)}
                placeholder="Ex: 1"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Reserva Selecionada</label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md text-sm text-gray-600">
                {reservaSelecionada 
                  ? `Reserva #${reservaSelecionada} selecionada` 
                  : 'Nenhuma reserva selecionada'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group relative min-w-0 flex-1 overflow-hidden py-4 px-6 text-sm font-medium text-center hover:bg-gray-50 focus:z-10 ${
                    activeTab === tab.id
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                  {activeTab === tab.id && (
                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'processar' && (
              <div>
                {reservaSelecionada ? (
                  <PagamentoComponent
                    reservaId={reservaSelecionada}
                    onPagamentoCompleto={handlePagamentoCompleto}
                    onPagamentoErro={handlePagamentoErro}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎒</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Selecione uma Reserva
                    </h3>
                    <p className="text-gray-600">
                      Para processar um pagamento, primeiro selecione uma reserva válida acima.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'listar' && (
              <div>
                <PagamentosList
                  reservaId={reservaSelecionada}
                  showActions={true}
                />
              </div>
            )}

            {activeTab === 'dashboard' && (
              <div>
                <PagamentoDashboard />
              </div>
            )}
          </div>
        </div>

        {/* Footer com informações */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">🧪 Sistema de Pagamento Simulado</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-blue-700">
            <div>
              <h4 className="font-medium mb-2">✅ Funcionalidades Implementadas:</h4>
              <ul className="space-y-1">
                <li>• Mock completo para PIX, Cartão e Boleto</li>
                <li>• Webhook automático simulado</li>
                <li>• Geração de comprovantes</li>
                <li>• Validação de dados de pagamento</li>
                <li>• Envio de emails (simulado)</li>
                <li>• Monitoramento de status em tempo real</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">🧪 Cenários de Teste:</h4>
              <ul className="space-y-1">
                <li>• <strong>PIX:</strong> "teste@falha.com" → Falha</li>
                <li>• <strong>Cartão:</strong> Terminados em "0000" → Falha</li>
                <li>• <strong>CVV:</strong> "000" → Falha</li>
                <li>• <strong>Débito:</strong> Valor &gt; R$ 5.000 → Falha</li>
                <li>• <strong>Boleto:</strong> Sempre aprovado</li>
                <li>• <strong>Webhook:</strong> 1-15s para confirmação</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Dashboard simples
const PagamentoDashboard = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-3xl text-green-600">✅</div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-green-800">Pagamentos Aprovados</h3>
            <p className="text-2xl font-bold text-green-600">R$ 12.450,00</p>
            <p className="text-sm text-green-600">23 transações</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-3xl text-yellow-600">⏳</div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-yellow-800">Pagamentos Pendentes</h3>
            <p className="text-2xl font-bold text-yellow-600">R$ 3.200,00</p>
            <p className="text-sm text-yellow-600">8 transações</p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="text-3xl text-red-600">❌</div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-red-800">Pagamentos Rejeitados</h3>
            <p className="text-2xl font-bold text-red-600">R$ 1.800,00</p>
            <p className="text-sm text-red-600">4 transações</p>
          </div>
        </div>
      </div>

      <div className="md:col-span-3 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">📊 Resumo por Forma de Pagamento</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">💳</div>
            <p className="text-sm text-blue-700">Cartão de Crédito</p>
            <p className="font-bold text-blue-800">45%</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🔄</div>
            <p className="text-sm text-blue-700">PIX</p>
            <p className="font-bold text-blue-800">30%</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💳</div>
            <p className="text-sm text-blue-700">Cartão de Débito</p>
            <p className="font-bold text-blue-800">15%</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📄</div>
            <p className="text-sm text-blue-700">Boleto</p>
            <p className="font-bold text-blue-800">10%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagamentosPage;
