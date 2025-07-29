import React, { useState, useRef, useEffect } from 'react';
import ModernPackageCard from './ModernPackageCard';

const PackageCarousel = ({ packages, title = "Destinos Populares" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);
  const carouselRef = useRef(null);

  console.log('🎠 PackageCarousel renderizado com packages:', packages);

  // Determinar quantos cards mostrar baseado no tamanho da tela
  useEffect(() => {
    const updateVisibleCards = () => {
      const width = window.innerWidth;
      if (width < 640) setVisibleCards(1);      // mobile
      else if (width < 768) setVisibleCards(2); // tablet pequeno
      else if (width < 1024) setVisibleCards(3); // tablet
      else setVisibleCards(4);                   // desktop
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  if (!packages || packages.length === 0) {
    console.log('⚠️ PackageCarousel: Nenhum pacote fornecido');
    return (
      <div className="text-center py-12 bg-white m-4 rounded-lg">
        <p className="text-gray-500 text-lg">Nenhum pacote disponível no momento.</p>
        <p className="text-gray-400 text-sm mt-2">Verifique sua conexão ou tente novamente.</p>
      </div>
    );
  }

  console.log('🎠 Renderizando carrossel com', packages.length, 'pacotes');

  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 px-4 sm:px-6 lg:px-8 bg-[#E6E6EB]">
      {/* Título da seção */}
      <div className="max-w-7xl mx-auto mb-8 lg:mb-12">
        <h1 className="text-blue-900 text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-center lg:text-left lg:ml-[2%] leading-tight"> 
          {title}
        </h1>
        <p className="text-blue-700 text-sm sm:text-base md:text-lg mt-3 text-center lg:text-left lg:ml-[2%] max-w-2xl font-medium">
          Explore os melhores destinos selecionados especialmente para você
        </p>
      </div>

      {/* Container do carrossel - Versão simplificada para debug */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {packages.slice(0, 4).map((pkg, index) => {
            console.log('🎴 Renderizando card:', pkg);
            return (
              <div key={`package-${pkg.id || index}`} className="flex justify-center">
                <ModernPackageCard
                  id={pkg.id}
                  nome={pkg.nome}
                  destino={pkg.destino}
                  imagem={pkg.imagem}
                  preco={pkg.preco}
                  precoOriginal={pkg.precoOriginal}
                  duracao={pkg.duracao}
                  categoria={pkg.categoria?.toUpperCase() || "PACOTE"}
                  rating={pkg.rating || 8.0}
                  origem={pkg.origem || "Saindo de São Paulo"}
                  inclusions={pkg.inclusions || "Hotel + Aéreo"}
                  economia={pkg.economia}
                  ofertaEspecial={pkg.ofertaEspecial}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PackageCarousel;
