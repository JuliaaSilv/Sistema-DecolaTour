import React, { useState, useEffect } from 'react';
import { Check, X, Star, Calendar, User, Package, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const ReviewManagement = () => {
  const [avaliacoesPendentes, setAvaliacoesPendentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState(null);

  useEffect(() => {
    carregarAvaliacoesPendentes();
  }, []);

  const carregarAvaliacoesPendentes = async () => {
    try {
      setCarregando(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Token de acesso não encontrado');
        return;
      }

      const response = await fetch('http://localhost:5295/api/Avaliacao/pendentes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvaliacoesPendentes(data);
      } else if (response.status === 401) {
        toast.error('Acesso não autorizado');
      } else {
        toast.error('Erro ao carregar avaliações pendentes');
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error.message || error.toString());
      toast.error('Erro de conexão');
    } finally {
      setCarregando(false);
    }
  };

  const aprovarAvaliacao = async (avaliacaoId) => {
    try {
      setProcessandoId(avaliacaoId);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5295/api/Avaliacao/aprovar/${avaliacaoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Avaliação aprovada com sucesso!');
        // Remove a avaliação da lista de pendentes
        setAvaliacoesPendentes(prev => prev.filter(av => av.id !== avaliacaoId));
      } else {
        toast.error('Erro ao aprovar avaliação');
      }
    } catch (error) {
      console.error('Erro ao aprovar avaliação:', error.message || error.toString());
      toast.error('Erro de conexão');
    } finally {
      setProcessandoId(null);
    }
  };

  const rejeitarAvaliacao = async (avaliacaoId) => {
    try {
      setProcessandoId(avaliacaoId);
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5295/api/Avaliacao/rejeitar/${avaliacaoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Avaliação rejeitada');
        // Remove a avaliação da lista de pendentes
        setAvaliacoesPendentes(prev => prev.filter(av => av.id !== avaliacaoId));
      } else {
        toast.error('Erro ao rejeitar avaliação');
      }
    } catch (error) {
      console.error('Erro ao rejeitar avaliação:', error.message || error.toString());
      toast.error('Erro de conexão');
    } finally {
      setProcessandoId(null);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (carregando) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 md:p-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Carregando avaliações pendentes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Star className="text-blue-500" size={24} />
            Moderação de Avaliações
          </h2>
          <p className="text-gray-600 mt-1">
            Gerencie e modere as avaliações de clientes
          </p>
        </div>
        <button
          onClick={carregarAvaliacoesPendentes}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      {avaliacoesPendentes.length === 0 ? (
        <div className="text-center py-12">
          <Star className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Nenhuma avaliação pendente
          </h3>
          <p className="text-gray-500">
            Todas as avaliações foram moderadas
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Package size={16} />
            <span>{avaliacoesPendentes.length} avaliações aguardando moderação</span>
          </div>

          {avaliacoesPendentes.map((avaliacao) => (
            <div key={avaliacao.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">
                          {avaliacao.viajante?.nome || 'Usuário'}
                        </h4>
                        <div className="flex">{renderStars(avaliacao.nota)}</div>
                        <span className="text-sm text-gray-500">
                          ({avaliacao.nota}/5)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Calendar size={14} />
                        {formatDate(avaliacao.dataAvaliacao)}
                        <span>•</span>
                        <Package size={14} />
                        {avaliacao.pacote?.nome || 'Pacote não encontrado'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-100 rounded-lg p-3 mb-3">
                    <p className="text-gray-700 leading-relaxed">
                      {avaliacao.comentario}
                    </p>
                  </div>

                  {avaliacao.reserva && (
                    <div className="text-xs text-gray-500">
                      Reserva: #{avaliacao.reserva.numeroReserva}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 lg:flex-col lg:min-w-[120px]">
                  <button
                    onClick={() => aprovarAvaliacao(avaliacao.id)}
                    disabled={processandoId === avaliacao.id}
                    className="flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 lg:flex-initial"
                  >
                    {processandoId === avaliacao.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Check size={16} />
                    )}
                    Aprovar
                  </button>
                  
                  <button
                    onClick={() => rejeitarAvaliacao(avaliacao.id)}
                    disabled={processandoId === avaliacao.id}
                    className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 lg:flex-initial"
                  >
                    {processandoId === avaliacao.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <X size={16} />
                    )}
                    Rejeitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
