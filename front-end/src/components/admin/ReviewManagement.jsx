import React, { useState, useEffect } from 'react';

const ReviewManagement = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        alert('Avaliação aprovada com sucesso!');
      } else {
        throw new Error('Erro ao aprovar avaliação');
      }
    } catch (err) {
      console.error('Erro ao aprovar:', err);
      alert('Erro ao aprovar avaliação');
    }
  };

  const handleReject = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      
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
        alert('Avaliação rejeitada com sucesso!');
      } else {
        throw new Error('Erro ao rejeitar avaliação');
      }
    } catch (err) {
      console.error('Erro ao rejeitar:', err);
      alert('Erro ao rejeitar avaliação');
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
                    {review.pacote?.titulo || 'Pacote não informado'}
                  </h3>
                  <div className="flex items-center mb-2">
                    <span className="text-sm text-gray-600 mr-4">
                      Avaliado por: {review.usuario?.nome || 'Usuário não informado'}
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
    </div>
  );
};

export default ReviewManagement;
