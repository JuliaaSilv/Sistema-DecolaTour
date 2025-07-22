import React from 'react';

/**
 * Componente que destaca por que o hotel é escolhido por casais
 * @param {string} title - Título da seção (padrão: "Escolhido por quem viaja a dois")
 * @param {string} description - Descrição do por que é ideal para casais
 * @param {array} highlights - Array de destaques/amenidades
 */
const CouplesHighlights = ({ 
  title = "Escolhido por quem viaja a dois",
  description = "Se você procura desfrutar a dois, este é o lugar para você! Aqueles que viajam desta forma escolhem o Mabu Curitiba Business porque possui:",
  highlights = [
    { icon: "eva-3-icon-food", text: "Restaurante" },
    { icon: "eva-3-icon-swimming-pool", text: "Piscina coberta - o ano todo" },
    { icon: "eva-3-icon-gym", text: "Academia" }
  ]
}) => {
  return (
    <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-2">
      <div className="accommodation-for-families-container rounded-2xl">
        {/* Título */}
        <h3 className="text-xl font-bold text-blue-900 mb-4">{title}</h3>
        
        {/* Descrição */}
        <p className="text-blue-800 mb-4">{description}</p>
        
        {/* Highlights de amenidades */}
        <div className="flex flex-wrap gap-6 mb-4">
          {highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2">
              <i className={`${highlight.icon} text-blue-700 text-2xl`} />
              <span className="text-blue-900">{highlight.text}</span>
            </div>
          ))}
        </div>
        
        {/* Link para ver mais */}
        <div className="flex items-center gap-2 text-blue-700 font-semibold cursor-pointer hover:text-blue-800 transition-colors">
          <span>Ver todos os serviços</span>
          <i className="eva-3-icon-chevron-right" />
        </div>
      </div>
    </section>
  );
};

export default CouplesHighlights;
