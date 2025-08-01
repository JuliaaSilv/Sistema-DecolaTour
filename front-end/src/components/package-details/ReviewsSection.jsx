import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Calendar, User } from 'lucide-react';

const ReviewsSection = ({ pacoteId }) => {
  const [filter, setFilter] = useState('all');
  const [reviewHelpful, setReviewHelpful] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  // Busca avaliações do backend
  useEffect(() => {
    const fetchReviews = async () => {
      if (!pacoteId) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Buscando avaliações para pacote:', pacoteId);
        const response = await fetch(`http://localhost:5295/api/Avaliacao/pacote/${pacoteId}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📝 Avaliações encontradas:', data);
          console.log('📝 Estrutura da primeira avaliação:', data[0]);
          
          // Transforma os dados do backend para o formato esperado
          const formattedReviews = data.map(avaliacao => {
            console.log('🔍 Processando avaliação:', {
              id: avaliacao.id,
              reserva: avaliacao.reserva,
              usuario: avaliacao.reserva?.usuario
            });
            
            return {
              id: avaliacao.id,
              name: avaliacao.reserva?.usuario?.nome || 'Usuário Anônimo',
              rating: avaliacao.nota,
              date: avaliacao.data,
              comment: avaliacao.comentario,
              helpful: 0, // Começamos com 0, pode ser implementado depois
              verified: true // Por enquanto todos são verificados
            };
          });
          
          setReviews(formattedReviews);
          
          // Calcula média
          if (formattedReviews.length > 0) {
            const avg = formattedReviews.reduce((acc, review) => acc + review.rating, 0) / formattedReviews.length;
            setAverageRating(avg);
          }
        } else {
          console.log('⚠️ Nenhuma avaliação encontrada para este pacote');
          setReviews([]);
        }
      } catch (error) {
        console.error('❌ Erro ao buscar avaliações:', error);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [pacoteId]);

  const totalReviews = reviews.length;
  const filteredReviews = filter === 'all' ? reviews : reviews.filter(review => review.rating === parseInt(filter));

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

  const handleHelpfulClick = (reviewId) => {
    setReviewHelpful(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  };

  const getHelpfulCount = (reviewId, originalCount) => {
    return originalCount + (reviewHelpful[reviewId] || 0);
  };

  // Se ainda está carregando
  if (isLoading) {
    return (
      <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C38] mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando avaliações...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Se não há avaliações, mostra apenas o CTA
  if (totalReviews === 0) {
    return (
      <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Avaliações dos Hóspedes</h2>
            <p className="text-gray-600">Seja o primeiro a avaliar este pacote!</p>
          </div>

          {/* CTA para deixar avaliação */}
          <div className="bg-gradient-to-r from-[#F28C38] to-orange-500 rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-semibold mb-2">Já se hospedou conosco?</h3>
            <p className="mb-4 opacity-90">Compartilhe sua experiência e ajude outros viajantes!</p>
            <button className="bg-white text-[#F28C38] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
              Deixar Primeira Avaliação
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-12">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Avaliações dos Hóspedes</h2>
            <p className="text-gray-600">Veja o que nossos clientes estão dizendo</p>
          </div>
          
          {/* Resumo das avaliações */}
          <div className="flex items-center gap-4 mt-4 lg:mt-0">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#F28C38]">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center mb-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-sm text-gray-600">{totalReviews} avaliações</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
              filter === 'all' 
                ? 'bg-[#F28C38] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todas ({totalReviews})
          </button>
          {[5, 4, 3, 2, 1].map(rating => {
            const count = reviews.filter(review => review.rating === rating).length;
            return (
              <button
                key={rating}
                onClick={() => setFilter(rating.toString())}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  filter === rating.toString() 
                    ? 'bg-[#F28C38] text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {rating} ⭐ ({count})
              </button>
            );
          })}
        </div>

        {/* Lista de avaliações */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#F28C38] rounded-full flex items-center justify-center">
                    <User className="text-white" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{review.name}</h3>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Verificado
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <span className="text-sm text-gray-500">•</span>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar size={14} />
                        {formatDate(review.date)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleHelpfulClick(review.id)}
                  className="flex items-center gap-2 text-gray-500 hover:text-[#F28C38] transition-colors duration-300 cursor-pointer"
                >
                  <ThumbsUp size={16} />
                  <span className="text-sm">Útil ({getHelpfulCount(review.id, review.helpful)})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA para deixar avaliação */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-[#F28C38] to-orange-500 rounded-xl p-6 text-white text-center">
            <h3 className="text-xl font-semibold mb-2">Já se hospedou conosco?</h3>
            <p className="mb-4 opacity-90">Compartilhe sua experiência e ajude outros viajantes!</p>
            <button className="bg-white text-[#F28C38] px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
              Deixar Avaliação
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
