import React, { useState, useEffect } from 'react';
import useToast from '../../hooks/useToast';
import ToastContainer from '../common/ToastContainer';

const ReviewManagement = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    aprovadas: 0,
    rejeitadas: 0,
    sessaoIniciada: new Date().toLocaleString('pt-BR')
  });
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://localhost:5295/api/Avaliacao/pendentes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingReviews(data);
        setError('');
      } else {
        throw new Error('Erro ao carregar avaliações pendentes');
      }
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao carregar avaliações pendentes');
      setPendingReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Encontrar a avaliação antes de aprovar para mostrar os detalhes
      const review = pendingReviews.find(r => r.id === reviewId);
      const nomeUsuario = review?.usuario?.nome || 'Usuário não informado';
      
      // Confirmação antes de aprovar
      const confirmar = window.confirm(
        `Tem certeza que deseja APROVAR esta avaliação?\n\n` +
        `Usuário: ${nomeUsuario}\n` +
        `Nota: ${review?.nota}/5\n` +
        `Comentário: "${review?.comentario}"\n\n` +
        `A avaliação ficará visível publicamente.`
      );
      
      if (!confirmar) return;
      
      const response = await fetch(`https://localhost:5295/api/Avaliacao/aprovar/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove a avaliação da lista de pendentes
        setPendingReviews(prev => prev.filter(review => review.id !== reviewId));
        
        // Atualizar estatísticas
        setStats(prev => ({ ...prev, aprovadas: prev.aprovadas + 1 }));
        
        // Mostrar detalhes da aprovação
        const mensagem = `AVALIAÇÃO APROVADA COM SUCESSO! Usuario: ${nomeUsuario} - Nota: ${review?.nota}/5 - A avaliação agora está visível publicamente!`;
        
        showSuccess(mensagem, 5000);
        console.log('Avaliação aprovada:', { 
          id: reviewId,
          nomeUsuario, 
          nota: review?.nota, 
          comentario: review?.comentario,
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error('Erro ao aprovar avaliação');
      }
    } catch (err) {
      console.error('Erro ao aprovar:', err);
      showError('Erro ao aprovar avaliação. Tente novamente.');
    }
  };

  const handleReject = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Encontrar a avaliação antes de rejeitar para mostrar os detalhes
      const review = pendingReviews.find(r => r.id === reviewId);
      const nomeUsuario = review?.usuario?.nome || 'Usuário não informado';
      
      // Confirmação antes de rejeitar
      const confirmar = window.confirm(
        `Tem certeza que deseja REJEITAR esta avaliação?\n\n` +
        `Usuário: ${nomeUsuario}\n` +
        `Nota: ${review?.nota}/5\n` +
        `Comentário: "${review?.comentario}"\n\n` +
        `A avaliação será permanentemente rejeitada e não ficará visível.`
      );
      
      if (!confirmar) return;
      
      const response = await fetch(`https://localhost:5295/api/Avaliacao/rejeitar/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove a avaliação da lista de pendentes
        setPendingReviews(prev => prev.filter(review => review.id !== reviewId));
        
        // Atualizar estatísticas
        setStats(prev => ({ ...prev, rejeitadas: prev.rejeitadas + 1 }));
        
        // Mostrar detalhes da rejeição
        const mensagem = `AVALIAÇÃO REJEITADA! Usuario: ${nomeUsuario} - Nota: ${review?.nota}/5 - A avaliação foi rejeitada e não será exibida publicamente.`;
        
        showError(mensagem, 5000);
        console.log('Avaliação rejeitada:', { 
          id: reviewId,
          nomeUsuario, 
          nota: review?.nota, 
          comentario: review?.comentario,
          motivo: 'Rejeitada pelo administrador',
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error('Erro ao rejeitar avaliação');
      }
    } catch (err) {
      console.error('Erro ao rejeitar:', err);
      showError('Erro ao rejeitar avaliação. Tente novamente.');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-xl ${
          index < rating ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Moderação de Avaliações</h2>
        <button
          onClick={fetchPendingReviews}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Atualizar
        </button>
      </div>

      {/* Painel de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Pendentes</h3>
          <p className="text-2xl font-bold text-blue-900">{pendingReviews.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Aprovadas Hoje</h3>
          <p className="text-2xl font-bold text-green-900">{stats.aprovadas}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-800">Rejeitadas Hoje</h3>
          <p className="text-2xl font-bold text-red-900">{stats.rejeitadas}</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-800">Sessão Iniciada</h3>
          <p className="text-xs text-gray-600">{stats.sessaoIniciada}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {pendingReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Nenhuma avaliação pendente encontrada.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pendingReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Avaliação #{review.id}
                  </h3>
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-600 mr-4">
                      Avaliado por: {review.nomeUsuario || 'Usuário'}
                    </span>
                    <span className="text-sm text-gray-600">
                      Email: {review.usuario?.email || 'Email não informado'}
                    </span>
                  </div>
                  <div className="flex items-center mb-3">
                    {renderStars(review.nota)}
                    <span className="ml-2 text-sm text-gray-600">({review.nota}/5)</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(review.dataAvaliacao).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{review.comentario}</p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span> {review.status}
                  {review.reserva && (
                    <span className="ml-4">
                      <span className="font-medium">Reserva:</span> #{review.reserva.numeroReserva}
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReject(review.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Rejeitar
                  </button>
                  <button
                    onClick={() => handleApprove(review.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    Aprovar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ReviewManagement;