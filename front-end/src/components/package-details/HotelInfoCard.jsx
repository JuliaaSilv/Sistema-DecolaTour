import React from 'react';
import Button from '../common/Button';
import Icon from '../common/Icon';

/**
 * Card com informações básicas do hotel
 * @param {object} pacote - Dados do pacote (nome)
 * @param {object} hotelInfo - Info do hotel (estrelas, localizacao)
 */
const HotelInfoCard = ({ pacote, hotelInfo }) => {
  return (
    <div className="flex-1">
      <h3 className="text-xl font-bold text-blue-900 mb-2">{pacote.nome} Resort</h3>
      
      {/* Estrelas */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-yellow-400 text-lg">★ ★ ★ ★</span>
        <span className="text-blue-900 font-medium">{hotelInfo.estrelas} estrelas</span>
      </div>
      
      {/* Localização */}
      <div className="flex items-center gap-2 mb-2">
        <Icon name="location" className="h-5 w-5 text-blue-700" />
        <span className="text-gray-700 text-sm">{hotelInfo.localizacao}</span>
      </div>
      
      {/* Descrição */}
      <p className="text-blue-800 mb-4">
        Hotel confortável, ótima localização e café da manhã incluso.
      </p>
      
      {/* Botão ver quartos */}
      <Button
        variant="primary"
        size="large"
        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-semibold rounded-xl shadow-lg transition-all duration-300"
      >
        Ver quartos
      </Button>
    </div>
  );
};

export default HotelInfoCard;
