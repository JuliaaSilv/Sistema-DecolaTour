// Componente de galeria de imagens reutilizável
import React from 'react';
import Icon from './Icon';

const ImageGallery = ({ 
  imagensGaleria, 
  galeriaAberta, 
  setGaleriaAberta, 
  fotoIndex, 
  setFotoIndex 
}) => {
  const nextImage = () => setFotoIndex(prev => prev === imagensGaleria.length - 1 ? 0 : prev + 1);
  const prevImage = () => setFotoIndex(prev => prev === 0 ? imagensGaleria.length - 1 : prev - 1);
  const closeGallery = () => { setGaleriaAberta(false); setFotoIndex(0); };

  if (!galeriaAberta) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Botão anterior */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-blue-900 rounded-full p-2 hover:bg-blue-100 transition"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
          onClick={prevImage}
          aria-label="Foto anterior"
        >
          <Icon name="chevronLeft" className="w-6 h-6" />
        </button>

        {/* Imagem */}
        <img
          src={imagensGaleria[fotoIndex]}
          alt={`Foto ${fotoIndex + 1} da hospedagem`}
          className="object-contain max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl"
        />

        {/* Botão próximo */}
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 text-blue-900 rounded-full p-2 hover:bg-blue-100 transition"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
          onClick={nextImage}
          aria-label="Próxima foto"
        >
          <Icon name="chevronRight" className="w-6 h-6" />
        </button>

        {/* Botão fechar */}
        <button
          className="absolute top-6 right-6 bg-white bg-opacity-70 text-blue-900 rounded-full p-2 hover:bg-blue-100 transition"
          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
          onClick={closeGallery}
          aria-label="Fechar galeria"
        >
          <Icon name="close" className="w-6 h-6" />
        </button>

        {/* Contador */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-semibold bg-blue-900 bg-opacity-60 px-3 py-1 rounded-full">
          {fotoIndex + 1} / {imagensGaleria.length}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;
