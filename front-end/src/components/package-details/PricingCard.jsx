import React from "react";
import Button from "../common/Button";

/**
 * Card de preços e informações de reserva
 * @param {object} pacote - Dados do pacote (preco, etc)
 * @param {string} savings - Valor da economia (ex: "R$650")
 * @param {function} onReserve - Função chamada ao clicar em Reservar
 */
const PricingCard = ({ pacote, onReserve }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-blue-50/80 rounded-xl p-6 mt-8 md:mt-0">
      {/* Seção de economia */}
      <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded mb-2 text-xs font-bold">
        Oferta imbatível
      </span>

      {/* Preços */}
      <div className="text-blue-900 text-xl font-bold mb-1">
        {pacote.valorTotal}
      </div>
      <div className="text-blue-700 text-sm mb-2">Preço final por pessoa</div>
      <div className="text-gray-500 text-xs mb-4">
        Taxas e impostos incluídos
      </div>

      {/* Botão de reserva */}
      <Button
        variant="primary"
        size="large"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base font-semibold rounded-xl shadow-lg transition-all duration-300"
        onClick={onReserve}
      >
        Reservar agora
      </Button>

      {/* Milhas */}
      <div className="text-purple-700 text-xs mt-3">
        Ganhe {pacote.valorTotal} milhas Avanade Pass
      </div>
    </div>
  );
};

export default PricingCard;
