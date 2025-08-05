import React from 'react';

/**
 * Componente de banner hero para páginas de produto
 * @param {string} backgroundImage - URL da imagem de fundo
 * @param {string} title - Título principal
 * @param {string} subtitle - Subtítulo/descrição
 */
const PackageHero = ({ backgroundImage, title, subtitle }) => {
  return (
    <section className="relative w-full min-h-[40vh] sm:min-h-[50vh] lg:min-h-[60vh] mb-10">
      <div className="w-full h-[40vh] sm:h-[50vh] lg:h-[60vh] overflow-hidden bg-blue-400">
        <img
          src={backgroundImage}
          alt={`Banner ${title} - Decola Tour`}
          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500 opacity-70"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40"></div>
      </div>
      <div className="absolute top-1/2 left-0 right-0 flex flex-col items-center justify-center px-4 transform -translate-y-1/2">
        <div className="text-center">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-standard mb-2 drop-shadow-2xl shadow-black/80 [text-shadow:_2px_2px_8px_rgba(0,0,0,0.8)]">
            {title}
          </h1>
          <div className="bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
            <p className="text-white text-lg sm:text-xl md:text-2xl font-semibold drop-shadow-xl [text-shadow:_1px_1px_4px_rgba(0,0,0,0.9)]">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageHero;
