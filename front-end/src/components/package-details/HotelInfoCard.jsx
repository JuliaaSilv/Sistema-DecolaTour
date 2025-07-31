import React from 'react';
import Button from '../common/Button';
import Icon from '../common/Icon';
import { Star } from 'lucide-react';

/**
 * Card com informações básicas do hotel
 * @param {object} pacote - Dados do pacote (nome)
 * @param {object} hotelInfo - Info do hotel (estrelas, localizacao)
 */
const HotelInfoCard = ({ pacote }) => {
  return (
    <div className="flex-1">
      <h3 className="text-xl font-bold text-blue-900 mb-2">{pacote.titulo}</h3>
      
      {/* Estrelas */}
      <div className="flex items-center gap-1 text-yellow-500">
        {[...Array(Number(pacote?.estrelas) || 0)].map((_, i) => (
          <Star key={i} className='w-4 h-4 fill-yellow-400 stroke-yellow-500' />
        ))}
        <span className="text-blue-900 font-medium">{Number(pacote?.estrelas) || 0} estrela{Number(pacote?.estrelas) > 1 ? 's' : ''}</span>
      </div>
      
      {/* Descrição */}
      <p className="text-blue-800 mb-4">
        Hotel confortável, ótima localização e café da manhã incluso.
      </p>
    </div>
  );
};

export default HotelInfoCard;
