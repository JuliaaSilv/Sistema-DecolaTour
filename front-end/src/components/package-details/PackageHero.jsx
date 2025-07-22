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
          className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500 opacity-60"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/30 via-blue-400/10 to-transparent"></div>
      </div>
      <div className="absolute top-1/2 left-0 right-0 flex flex-col items-center justify-center px-4 transform -translate-y-1/2">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center font-standard drop-shadow-lg">
          {title}
        </h1>
        <p className="text-white text-lg sm:text-2xl font-medium text-center mt-2 drop-shadow">
          {subtitle}
        </p>
      </div>
    </section>
  );
};

export default PackageHero;
