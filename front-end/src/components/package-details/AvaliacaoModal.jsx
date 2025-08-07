import React, { useState } from 'react';
import { Star, X, Send } from 'lucide-react';
import { criarAvaliacao } from '../../api/avaliacoes';
import useToast from '../../hooks/useToast';
import ToastContainer from '../common/ToastContainer';

const AvaliacaoModal = ({ isOpen, onClose, pacoteId, reservaId, numeroReserva, onSuccess }) => {
  const [nota, setNota] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (nota === 0) {
      setError('Por favor, selecione uma avaliação de 1 a 5 estrelas');
      return;
    }

    if (!comentario.trim()) {
      setError('Por favor, escreva um comentário sobre sua experiência');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await criarAvaliacao({
        nota: nota,
        comentario: comentario.trim(),
        reservaId: reservaId
      });

      // Sucesso - mostrar mensagem e chamar callback
      showSuccess('Avaliação enviada com sucesso! Ela será analisada pela moderação antes de aparecer no site.', 5000);
      onSuccess();
      handleClose();
      
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      setError(error.message || 'Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNota(0);
    setHoverNota(0);
    setComentario('');
    setError('');
    onClose();
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      const isFilled = starNumber <= (hoverNota || nota);
      
      return (
        <Star
          key={starNumber}
          size={32}
          className={`cursor-pointer transition-colors duration-200 ${
            isFilled 
              ? 'text-yellow-400 fill-current' 
              : 'text-gray-300 hover:text-yellow-200'
          }`}
          onClick={() => setNota(starNumber)}
          onMouseEnter={() => setHoverNota(starNumber)}
          onMouseLeave={() => setHoverNota(0)}
        />
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Avaliar Pacote</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 cursor-pointer"
            disabled={isLoading}
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Info da Reserva */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-600">
              Avaliando sua experiência na reserva #{numeroReserva}
            </p>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Como foi sua experiência? *
            </label>
            <div className="flex items-center justify-center gap-2 mb-2">
              {renderStars()}
            </div>
            <div className="text-center text-sm text-gray-500">
              {nota === 0 && 'Clique nas estrelas para avaliar'}
              {nota === 1 && 'Muito ruim'}
              {nota === 2 && 'Ruim'}
              {nota === 3 && 'Regular'}
              {nota === 4 && 'Bom'}
              {nota === 5 && 'Excelente'}
            </div>
          </div>

          {/* Comentário */}
          <div className="mb-6">
            <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-2">
              Conte-nos sobre sua experiência *
            </label>
            <textarea
              id="comentario"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Descreva sua experiência com o pacote, serviços, hospedagem, passeios..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F28C38] focus:border-transparent transition-all duration-200 resize-none"
              disabled={isLoading}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-500">Máximo 500 caracteres</span>
              <span className="text-xs text-gray-500">{comentario.length}/500</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || nota === 0 || !comentario.trim()}
              className="flex-1 px-4 py-3 bg-[#F28C38] text-white rounded-xl hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Enviar Avaliação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default AvaliacaoModal;
