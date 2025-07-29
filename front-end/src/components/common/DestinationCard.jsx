/**
 * COMPONENTE CARD DE DESTINO - Versão Simplificada
 * 
 * Card para exibir destinos de viagem com:
 * - Imagem do destino
 * - Nome da cidade
 * - Preço da viagem
 * - Botão "Ver Mais"
 */

import React from 'react';
import Button from './Button';

import { useNavigate } from 'react-router-dom';

const DestinationCard = ({ nome, imagem, preco }) => {
  const navigate = useNavigate();
  return (
    <article className="group bg-white/95 backdrop-blur-sm w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:max-w-[300px] xl:max-w-[320px] 2xl:max-w-[360px] rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] lg:hover:scale-105 overflow-hidden border border-white/30">
      {/* Imagem do destino */}
      <div className="relative w-full h-[180px] sm:h-[200px] md:h-[220px] lg:h-[200px] xl:h-[220px] overflow-hidden bg-gray-100">
        <img
          src={imagem}
          alt={`Pacote de viagem para ${nome} - Decola Tour`}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Badge "A partir de" */}
        <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-sm border border-white/20">
          A partir de
        </div>
      </div>
      {/* Conteúdo do card */}
      <div className="p-3 sm:p-4 md:p-5 lg:p-4 xl:p-5">
        {/* Nome da cidade */}
        <h2 className="text-blue-600 text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-bold mb-2 sm:mb-3 leading-tight">
          {nome}
        </h2>
        {/* Preço e botão */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row justify-between items-start sm:items-center md:items-start lg:items-center gap-3 sm:gap-2 md:gap-3">
          {/* Preço */}
          <div className="flex flex-col">
            <h3 className="text-blue-600 text-lg sm:text-xl md:text-2xl lg:text-xl xl:text-2xl font-bold leading-tight">
              R$ {preco}
            </h3>
            <span className="text-blue-400 text-xs sm:text-sm font-medium">
              por pessoa
            </span>
          </div>
          {/* Botão Ver Mais */}
          <Button 
            variant="primary" 
            size="medium" 
            className="w-full sm:w-auto md:w-full lg:w-auto text-xs sm:text-sm md:text-base lg:text-sm xl:text-base px-3 sm:px-4 md:px-6 lg:px-4 xl:px-6 py-2 sm:py-2.5 md:py-3 lg:py-2 xl:py-2.5 rounded-lg font-semibold transition-all duration-200 bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => navigate(`/packages/${encodeURIComponent(nome)}`)}
          >
            VER MAIS
          </Button>
        </div>
      </div>
    </article>
  );
};

export default DestinationCard;
