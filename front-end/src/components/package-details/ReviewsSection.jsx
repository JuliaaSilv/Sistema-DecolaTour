import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Calendar, User } from 'lucide-react';
import AvaliacaoModal from './AvaliacaoModal';
import { 
  verificarSeUsuarioPodeAvaliar, 
  buscarAvaliacoesPorPacote, 
  formatarAvaliacoesParaFrontend 
} from '../../api/avaliacoes';
import { estaLogado } from '../../api/auth';
import useToast from '../../hooks/useToast';
import ToastContainer from '../common/ToastContainer';

const ReviewsSection = ({ pacoteId }) => {
  const [filter, setFilter] = useState('all');
  const [reviewHelpful, setReviewHelpful] = useState({});
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [podeAvaliar, setPodeAvaliar] = useState(false);
  const [dadosParaAvaliacao, setDadosParaAvaliacao] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const { toasts, showError, showWarning, removeToast } = useToast();

  // Verifica se o usuário está logado
  useEffect(() => {
    setIsUserLoggedIn(estaLogado());
  }, []);

  // Verifica se o usuário pode avaliar este pacote
  useEffect(() => {
    const verificarPermissaoAvaliacao = async () => {
      if (!isUserLoggedIn || !pacoteId) {
        setPodeAvaliar(false);
        return;
      }

      try {
        const resultado = await verificarSeUsuarioPodeAvaliar(pacoteId);
        setPodeAvaliar(resultado.podeAvaliar);
        
        if (resultado.podeAvaliar) {
          setDadosParaAvaliacao({
            reservaId: resultado.reservaId,
            numeroReserva: resultado.numeroReserva
          });
        }
      } catch (error) {
        console.error('Erro ao verificar se pode avaliar:', error.message || error.toString());
        setPodeAvaliar(false);
      }
    };

    verificarPermissaoAvaliacao();
  }, [pacoteId, isUserLoggedIn]);

  // Busca avaliações do backend
  useEffect(() => {
    const carregarAvaliacoes = async () => {
      if (!pacoteId) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('Buscando avaliações para pacote:', pacoteId);
        const avaliacoesData = await buscarAvaliacoesPorPacote(pacoteId);
        console.log('Avaliações encontradas:', avaliacoesData);
        
        const formattedReviews = formatarAvaliacoesParaFrontend(avaliacoesData);
        setReviews(formattedReviews);
        
        // Calcula média
        if (formattedReviews.length > 0) {
          const avg = formattedReviews.reduce((acc, review) => acc + review.rating, 0) / formattedReviews.length;
          setAverageRating(avg);
        }
      } catch (error) {
        console.error('Erro ao buscar avaliações:', error.message || error.toString());
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    carregarAvaliacoes();
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

  const handleAvaliacaoSuccess = () => {
    // Recarregar as avaliações após sucesso
    const carregarAvaliacoes = async () => {
      try {
        const avaliacoesData = await buscarAvaliacoesPorPacote(pacoteId);
        const formattedReviews = formatarAvaliacoesParaFrontend(avaliacoesData);
        setReviews(formattedReviews);
        
        // Recalcula média
        if (formattedReviews.length > 0) {
          const avg = formattedReviews.reduce((acc, review) => acc + review.rating, 0) / formattedReviews.length;
          setAverageRating(avg);
        }
        
        // Atualiza o estado de avaliação (agora o usuário não pode mais avaliar)
        setPodeAvaliar(false);
        setDadosParaAvaliacao(null);
      } catch (error) {
        console.error('Erro ao recarregar avaliações:', error.message || error.toString());
      }
    };
    
    carregarAvaliacoes();
  };

  const handleAbrirModal = () => {
    if (!isUserLoggedIn) {
      showWarning('Você precisa estar logado para avaliar um pacote. Por favor, faça login.');
      // Redirecionar para login seria ideal
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      return;
    }
    
    if (!podeAvaliar) {
      showError('Você só pode avaliar pacotes que já reservou e ainda não avaliou.');
      return;
    }
    
    setIsModalOpen(true);
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
            <h3 className="text-xl font-semibold mb-2">Seja o primeiro a avaliar!</h3>
            <p className="mb-4 opacity-90">Você já se hospedou conosco? Compartilhe sua experiência!</p>
            <button 
              onClick={handleAbrirModal}
              disabled={!isUserLoggedIn || !podeAvaliar}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors duration-300 ${
                !isUserLoggedIn || !podeAvaliar 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-[#F28C38] hover:bg-gray-100 cursor-pointer'
              }`}
            >
              {!isUserLoggedIn ? 'Faça Login para Avaliar' : 
               !podeAvaliar ? 'Reserve para Avaliar' : 
               'Deixar Primeira Avaliação'}
            </button>
          </div>
        </div>

        {/* Modal de Avaliação */}
        <AvaliacaoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pacoteId={pacoteId}
          reservaId={dadosParaAvaliacao?.reservaId}
          numeroReserva={dadosParaAvaliacao?.numeroReserva}
          onSuccess={handleAvaliacaoSuccess}
        />
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
                {rating} estrelas ({count})
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
            <button 
              onClick={handleAbrirModal}
              disabled={!isUserLoggedIn || !podeAvaliar}
              className={`px-6 py-3 rounded-xl font-semibold transition-colors duration-300 ${
                !isUserLoggedIn || !podeAvaliar 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-white text-[#F28C38] hover:bg-gray-100 cursor-pointer'
              }`}
            >
              {!isUserLoggedIn ? 'Faça Login para Avaliar' : 
               !podeAvaliar ? 'Reserve para Avaliar' : 
               'Deixar Avaliação'}
            </button>
          </div>
        </div>

        {/* Modal de Avaliação */}
        <AvaliacaoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          pacoteId={pacoteId}
          reservaId={dadosParaAvaliacao?.reservaId}
          numeroReserva={dadosParaAvaliacao?.numeroReserva}
          onSuccess={handleAvaliacaoSuccess}
        />
      </div>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </section>
  );
};

export default ReviewsSection;
