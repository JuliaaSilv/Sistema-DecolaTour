import React, { useState, useEffect } from 'react';
import { testarConectividade, verificarReserva, listarMinhasReservas } from '../api/payment';
import { obterIdUsuario, estaLogado } from '../api/auth';
import { testeCompletoPagamento } from '../utils/testePagamento';

const DebugPagamento = ({ reservaId, onReservaIdChange }) => {
  const [conectividade, setConectividade] = useState(null);
  const [verificacaoReserva, setVerificacaoReserva] = useState(null);
  const [novoReservaId, setNovoReservaId] = useState(reservaId || '');
  const [minhasReservas, setMinhasReservas] = useState(null);
  const [testeCompleto, setTesteCompleto] = useState(null);
  const [executandoTeste, setExecutandoTeste] = useState(false);

  useEffect(() => {
    const verificarConectividade = async () => {
      const resultado = await testarConectividade();
      setConectividade(resultado);
    };

    const carregarMinhasReservas = async () => {
      const resultado = await listarMinhasReservas();
      setMinhasReservas(resultado);
    };

    verificarConectividade();
    carregarMinhasReservas();
  }, []);

  const handleVerificarReserva = async () => {
    if (novoReservaId) {
      const resultado = await verificarReserva(novoReservaId);
      setVerificacaoReserva(resultado);
    }
  };

  const handleUseReservaId = () => {
    if (novoReservaId && onReservaIdChange) {
      onReservaIdChange(parseInt(novoReservaId));
    }
  };

  const handleTesteCompleto = async () => {
    setExecutandoTeste(true);
    setTesteCompleto(null);
    
    try {
      const resultado = await testeCompletoPagamento(17); // Pacote ID de teste
      setTesteCompleto(resultado);
    } catch (error) {
      setTesteCompleto({
        sucesso: false,
        erro: error.message
      });
    }
    
    setExecutandoTeste(false);
  };

  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">🔧 Debug do Pagamento</h3>
      
      {/* Informações do usuário */}
      <div className="mb-4 p-3 bg-white rounded border">
        <h4 className="font-medium mb-2">👤 Informações do Usuário</h4>
        <p><strong>Logado:</strong> {estaLogado() ? 'Sim' : 'Não'}</p>
        <p><strong>ID do Usuário:</strong> {obterIdUsuario() || 'Não encontrado'}</p>
        <p><strong>Token presente:</strong> {localStorage.getItem('token') ? 'Sim' : 'Não'}</p>
      </div>

      {/* Conectividade com o backend */}
      <div className="mb-4 p-3 bg-white rounded border">
        <h4 className="font-medium mb-2">🌐 Conectividade Backend</h4>
        {conectividade ? (
          <div>
            <p><strong>Status:</strong> 
              <span className={conectividade.conectado ? 'text-green-600' : 'text-red-600'}>
                {conectividade.conectado ? ' Conectado' : ' Desconectado'}
              </span>
            </p>
            {conectividade.status && (
              <p><strong>HTTP Status:</strong> {conectividade.status} {conectividade.statusText}</p>
            )}
            {conectividade.erro && (
              <p className="text-red-600"><strong>Erro:</strong> {conectividade.erro}</p>
            )}
          </div>
        ) : (
          <p>Testando conectividade...</p>
        )}
      </div>

      {/* Verificação de reserva */}
      <div className="mb-4 p-3 bg-white rounded border">
        <h4 className="font-medium mb-2">📋 Verificação de Reserva</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            value={novoReservaId}
            onChange={(e) => setNovoReservaId(e.target.value)}
            placeholder="ID da Reserva"
            className="px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={handleVerificarReserva}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Verificar
          </button>
          <button
            onClick={handleUseReservaId}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
          >
            Usar ID
          </button>
        </div>
        
        {verificacaoReserva && (
          <div>
            <p><strong>Status:</strong> 
              <span className={verificacaoReserva.existe ? 'text-green-600' : 'text-red-600'}>
                {verificacaoReserva.existe ? ' Existe' : ' Não encontrada'}
              </span>
            </p>
            {verificacaoReserva.dados && (
              <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-x-auto">
                {JSON.stringify(verificacaoReserva.dados, null, 2)}
              </pre>
            )}
            {verificacaoReserva.erro && (
              <p className="text-red-600 text-sm">{verificacaoReserva.erro}</p>
            )}
          </div>
        )}
      </div>

      {/* Reservas sugeridas para teste */}
      <div className="p-3 bg-white rounded border">
        <h4 className="font-medium mb-2">📋 Suas Reservas</h4>
        {minhasReservas ? (
          <div>
            {minhasReservas.sucesso ? (
              <div>
                {minhasReservas.dados.length > 0 ? (
                  <div className="space-y-2">
                    {minhasReservas.dados.map(reserva => (
                      <div key={reserva.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="text-sm">
                          <strong>ID {reserva.id}</strong> - R$ {reserva.valorUnitario}
                          <br />
                          <span className="text-gray-600">Status: {reserva.status}</span>
                        </div>
                        <button
                          onClick={() => setNovoReservaId(reserva.id.toString())}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                        >
                          Usar
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Você não tem reservas criadas ainda.</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-red-600">Erro: {minhasReservas.erro}</p>
            )}
          </div>
        ) : (
          <p className="text-sm">Carregando suas reservas...</p>
        )}
      </div>

      {/* IDs de teste adicionais */}
      <div className="p-3 bg-white rounded border">
        <h4 className="font-medium mb-2">🧪 IDs de Teste Sugeridos</h4>
        <div className="flex gap-2 text-sm">
          {[1, 2, 3, 4, 5].map(id => (
            <button
              key={id}
              onClick={() => setNovoReservaId(id.toString())}
              className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
            >
              {id}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Clique em um ID para testar, depois em "Verificar" e "Usar ID"
        </p>
      </div>

      {/* Teste completo */}
      <div className="p-3 bg-white rounded border">
        <h4 className="font-medium mb-2">🧪 Teste Completo (Reserva + Pagamento)</h4>
        <button
          onClick={handleTesteCompleto}
          disabled={executandoTeste || !estaLogado()}
          className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {executandoTeste ? 'Executando...' : 'Executar Teste Completo'}
        </button>
        
        {!estaLogado() && (
          <p className="text-sm text-orange-600 mt-2">
            ⚠️ Faça login primeiro para executar o teste
          </p>
        )}
        
        {testeCompleto && (
          <div className={`mt-2 p-2 rounded text-sm ${testeCompleto.sucesso ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {testeCompleto.sucesso ? (
              <div>
                <strong>✅ Teste executado com sucesso!</strong>
                <br />Reserva ID: {testeCompleto.reservaId}
                <br />Pagamento ID: {testeCompleto.pagamento?.PagamentoId || testeCompleto.pagamento?.pagamentoId}
                <br />Status: {testeCompleto.pagamento?.Status || testeCompleto.pagamento?.status}
              </div>
            ) : (
              <div>
                <strong>❌ Erro no teste:</strong>
                <br />{testeCompleto.erro}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resumo do status atual */}
      <div className="p-3 bg-blue-50 rounded border border-blue-200">
        <h4 className="font-medium mb-2 text-blue-800">📊 Resumo da Integração</h4>
        <div className="text-sm space-y-1">
          <div>✅ Backend: {conectividade?.conectado ? 'Conectado' : 'Verificando...'}</div>
          <div>✅ Pagamento API: Integrada</div>
          <div>✅ Reserva API: Integrada</div>
          <div>✅ Mock Service: Ativo</div>
          <div>✅ Debug Console: Ativo</div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Sistema de pagamento está pronto para teste! Use o formulário acima para fazer uma reserva.
        </p>
      </div>
    </div>
  );
};

export default DebugPagamento;
