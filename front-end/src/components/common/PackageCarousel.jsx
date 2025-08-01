import React, { useState, useRef, useEffect } from 'react';
import SimplePackageCard from './SimplePackageCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PackageCarousel = ({ packages}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(4);

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

    // Atualiza o número de cards visíveis ao carregar e ao redimensionar a tela
    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  if (!packages || packages.length === 0) {
    console.log('⚠️ PackageCarousel: Nenhum pacote fornecido');
    return null;
  }

  console.log('🎠 Renderizando carrossel com', packages.length, 'pacotes');

  // Lógica de navegação do carrossel
  // maxIndex limita o índice máximo para garantir que sempre haja o número correto de cards visíveis
  const maxIndex = Math.max(0, packages.length - visibleCards);
  // handlePrev e handleNext mudam o índice atual do carrossel, navegando entre os grupos de cards
  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0)); // Volta uma página, sem passar do início
  };
  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex)); // Avança uma página, sem passar do final
  };

  return (
    <div className="max-w-7xl mx-auto relative">
      {/* Botão esquerdo */}
      {packages.length > visibleCards && (
        <button
          className="absolute left-[-32px] top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-blue-100 transition disabled:opacity-40 cursor-pointer"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          aria-label="Anterior"
        >
          <ChevronLeft size={32} />
        </button>
      )}
      {/* Carrossel animado */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
        >
          {packages.map((pkg, index) => (
            <div
              key={`package-${pkg.id || index}`}
              className="flex justify-center"
              style={{ minWidth: `${100 / visibleCards}%`, transition: 'min-width 0.3s' }}
            >
              <SimplePackageCard
                id={pkg.id}
                imagem={pkg.imagem}
                titulo={pkg.titulo}
                preco={pkg.preco}
                duracao={pkg.duracao}
                destino={pkg.destino}
                categoria={pkg.categoria}
                inclusions={pkg.inclusions}
                estrelas={pkg.estrelas}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Botão direito */}
      {packages.length > visibleCards && (
        <button
          className="absolute right-[-32px] top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-blue-100 transition disabled:opacity-40 cursor-pointer"
          onClick={handleNext}
          disabled={currentIndex === maxIndex}
          aria-label="Próximo"
        >
          <ChevronRight size={32} />
        </button>
      )}
    </div>
  );
};

export default PackageCarousel;
