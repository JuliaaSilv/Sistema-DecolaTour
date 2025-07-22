import React from 'react';
import Icon from '../common/Icon';

/**
 * Componente de localização com mapa
 * @param {function} onMapClick - Callback quando clica em "Veja no mapa"
 * @param {string} description - Descrição da localização
 */
const LocationMap = ({ 
  onMapClick = () => console.log('Ver mapa clicado'), 
  description = "Localizado estrategicamente, o hotel está a poucos passos da entrada principal, facilitando o acesso às principais atrações e ao transporte da cidade." 
}) => {
  return (
    <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-10">
      <div className="detail-section accommodation-info-map bg-white rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 mb-8">
        {/* Imagem do mapa */}
        <div className="map-img-container flex-shrink-0">
          <img
            alt="map"
            width="320"
            height="80"
            className="map-img rounded-lg"
            src="https://s3.staticontent.com/67f50ade/2.22.20/assets/images/map-image-wide.svg"
          />
        </div>
        
        {/* Info da localização */}
        <div className="flex-1">
          <button 
            className="eva-3-btn bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition mb-2"
            onClick={onMapClick}
          >
            Veja no mapa
          </button>
          <h3 className="text-lg font-bold text-blue-900 mb-2 mt-2">Sobre a localização</h3>
          <p className="text-blue-800 text-base mb-1">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
