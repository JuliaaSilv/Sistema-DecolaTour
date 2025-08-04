import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Users, Star, Package, DollarSign, History, Clock, User } from 'lucide-react';

const PackageViewModal = ({ isOpen, onClose, packageData }) => {
  const [historico, setHistorico] = useState([]);
  const [isLoadingHistorico, setIsLoadingHistorico] = useState(false);
  const [historicoError, setHistoricoError] = useState(null);

  // Busca o histórico quando o modal abre
  useEffect(() => {
    if (isOpen && packageData?.id) {
      fetchHistorico();
    }
  }, [isOpen, packageData?.id]);

  const fetchHistorico = async () => {
    try {
      setIsLoadingHistorico(true);
      setHistoricoError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5295/api/Pacote/historico/${packageData.id}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });

      if (response.ok) {
        const data = await response.json();
        setHistorico(data);
      } else {
        throw new Error('Erro ao buscar histórico');
      }
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      setHistoricoError('Erro ao carregar histórico de alterações');
    } finally {
      setIsLoadingHistorico(false);
    }
  };

  if (!isOpen || !packageData) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Detalhes do Pacote
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Image and Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image */}
            <div className="space-y-4">
              <div className="h-64 rounded-lg overflow-hidden bg-gray-100">
                {packageData.imagem ? (
                  <img 
                    src={packageData.imagem} 
                    alt={packageData.nome}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${
                    packageData.imagem ? 'hidden' : 'flex'
                  }`}
                >
                  <Package className="w-16 h-16 text-white/50" />
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-2">{packageData.nome}</h3>
                <div className="flex items-center gap-2 text-blue-700 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{packageData.destino}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{packageData.estrelas || 4} estrelas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{packageData.duracao || 'N/A'} dias</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Até {packageData.quantidadeMaximaPessoas || 'N/A'} pessoas</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Preço</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(packageData.preco)}
                </p>
                <p className="text-sm text-green-700">por pessoa</p>
              </div>

              {/* Category and Status */}
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  packageData.categoria === 'completo' ? 'bg-blue-100 text-blue-800' :
                  packageData.categoria === 'hospedagem' ? 'bg-purple-100 text-purple-800' :
                  packageData.categoria === 'aereo' ? 'bg-orange-100 text-orange-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {packageData.categoria}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  packageData.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {packageData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {packageData.descricao && (
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Descrição</h4>
              <p className="text-gray-700 leading-relaxed">{packageData.descricao}</p>
            </div>
          )}

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{packageData.reservas}</div>
              <div className="text-sm text-blue-700">Total de Reservas</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {formatPrice(packageData.preco * packageData.reservas)}
              </div>
              <div className="text-sm text-orange-700">Receita Total</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatDate(packageData.dataUltimaReserva)}
              </div>
              <div className="text-sm text-green-700">Última Reserva</div>
            </div>
          </div>

          {/* Additional Details */}
          {packageData.detalhes && (
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Detalhes Adicionais</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                  {typeof packageData.detalhes === 'string' 
                    ? packageData.detalhes 
                    : JSON.stringify(packageData.detalhes, null, 2)
                  }
                </pre>
              </div>
            </div>
          )}

          {/* Policies */}
          {packageData.politicas && (
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Políticas</h4>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-yellow-800">{packageData.politicas}</p>
              </div>
            </div>
          )}

          {/* Histórico de Alterações */}
          <div>
            <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico de Alterações
            </h4>
            
            {isLoadingHistorico ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Carregando histórico...</p>
              </div>
            ) : historicoError ? (
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-sm text-red-600">{historicoError}</p>
              </div>
            ) : historico.length === 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600">Nenhum histórico encontrado</p>
              </div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                <div className="space-y-3">
                  {historico.map((item, index) => (
                    <div key={item.id || index} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            Versão {item.versao || item.VERSAO}
                          </span>
                          {index === 0 && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                              Última Atualização
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(item.atualizadoEm)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <p><strong>Título:</strong> {item.titulo}</p>
                          <p><strong>Destino:</strong> {item.destino}</p>
                          <p><strong>Valor:</strong> {formatPrice(item.valorTotal)}</p>
                        </div>
                        <div>
                          <p><strong>Duração:</strong> {item.duracao} dias</p>
                          <p><strong>Max. Pessoas:</strong> {item.quantidadeMaximaPessoas}</p>
                          <p><strong>Estrelas:</strong> {item.estrelas}</p>
                        </div>
                      </div>
                      
                      {item.descricao && (
                        <div className="mt-2 text-sm">
                          <p><strong>Descrição:</strong></p>
                          <p className="text-gray-700 text-xs mt-1 overflow-hidden" style={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>{item.descricao}</p>
                        </div>
                      )}
                      
                      <div className="mt-2 flex flex-col space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>
                            {item.criadoPor ? (
                              <>Criado por: <strong>{item.criadoPor}</strong> em {formatDateTime(item.criadoEm)}</>
                            ) : (
                              'Criador não informado'
                            )}
                          </span>
                        </div>
                        
                        {/* Mostrar informação de atualização se houver data de atualização e for diferente da criação */}
                        {item.atualizadoEm && item.atualizadoEm !== item.criadoEm && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>Atualizado por: <strong>{item.atualizadoPor || 'Sistema'}</strong> em {formatDateTime(item.atualizadoEm)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center gap-3 p-6 border-t border-gray-200">
          <button
            onClick={fetchHistorico}
            disabled={isLoadingHistorico}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
          >
            <History className="w-4 h-4" />
            {isLoadingHistorico ? 'Carregando...' : 'Atualizar Histórico'}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageViewModal;