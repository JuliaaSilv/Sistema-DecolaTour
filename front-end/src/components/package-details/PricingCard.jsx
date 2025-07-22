import React from 'react';
import Button from '../common/Button';

/**
 * Card de preços e informações de reserva
 * @param {object} pacote - Dados do pacote (preco, etc)
 * @param {object} hotelInfo - Info do hotel (nota, comentarios, resumoIA)
 * @param {string} savings - Valor da economia (ex: "R$650")
 * @param {string} bonusPoints - Pontos de bonus (ex: "2.442 Milhas LATAM Pass")
 */
const PricingCard = ({ pacote, hotelInfo, savings = "R$650", bonusPoints = "2.442 Milhas LATAM Pass" }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-blue-50/80 rounded-xl p-6 mt-8 md:mt-0">
      {/* Seção de economia */}
      <span className="text-green-700 font-semibold mb-1">Economize {savings}</span>
      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded mb-2 text-xs font-bold">
        Oferta imbatível
      </span>
      
      {/* Preços */}
      <div className="text-blue-900 text-xl font-bold mb-1">{pacote.preco}</div>
      <div className="text-blue-700 text-sm mb-2">Preço final por pessoa</div>
      <div className="text-blue-900 text-base mb-1">
        Final 2 pessoas <span className="font-bold">R$ 1.952</span>
      </div>
      <div className="text-gray-500 text-xs mb-4">Taxas e impostos incluídos</div>
      
      {/* Botão de reserva */}
      <Button
        variant="primary"
        size="large"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-semibold rounded-xl shadow-lg transition-all duration-300"
      >
        Reservar agora
      </Button>
      
      {/* Milhas */}
      <div className="text-purple-700 text-xs mt-3">Ganhe {bonusPoints}</div>
      
      {/* Box de avaliação */}
      <div className="bg-blue-50 rounded-lg p-4 mt-6 w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-900 font-bold text-lg">{hotelInfo.nota}</span>
          <span className="text-blue-800 text-sm">Muito bom</span>
          <span className="text-blue-700 underline cursor-pointer text-sm ml-2">
            Ver {hotelInfo.comentarios} comentários
          </span>
        </div>
        <p className="text-blue-900 text-sm">{hotelInfo.resumoIA}</p>
        <div className="flex items-center gap-2 mt-2 text-gray-500 text-xs">
          <i className="eva-3-icon-artificial-intelligence" />
          <span>Resumo de comentários gerados por IA</span>
        </div>
      </div>
    </div>
  );
};

export default PricingCard;
