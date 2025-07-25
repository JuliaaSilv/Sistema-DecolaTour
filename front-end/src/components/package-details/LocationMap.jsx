import React from 'react';
import GoogleMap from '../common/GoogleMap';

/**
 * Componente de localização com mapa integrado ao Google Maps
 * @param {string} location - Localização/cidade do pacote
 * @param {function} onMapClick - Callback quando clica em "Veja no mapa"
 * @param {string} description - Descrição da localização
 */
const LocationMap = ({ 
  location,
  onMapClick = () => window.open(`https://www.google.com/maps/search/${encodeURIComponent(location)}`, '_blank'), 
  description = "Localizado estrategicamente, o hotel está a poucos passos da entrada principal, facilitando o acesso às principais atrações e ao transporte da cidade." 
}) => {
  return (
    <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-10">
      <div className="detail-section accommodation-info-map bg-white rounded-2xl p-4 flex flex-col gap-6 mb-8">
        {/* Título da seção */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl sm:text-2xl font-bold text-blue-900">Localização</h3>
          <button 
            className="eva-3-btn bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-orange-600 transition self-start sm:self-auto"
            onClick={onMapClick}
          >
            Veja no Google Maps
          </button>
        </div>
        
        {/* Mapa do Google Maps */}
        {location && (
          <div className="w-full">
            <GoogleMap 
              location={location}
              className="w-full h-64 sm:h-80 md:h-96 rounded-lg shadow-md"
              height={320}
            />
          </div>
        )}
        
        {/* Info da localização */}
        <div className="flex-1">
          <h4 className="text-lg font-bold text-blue-900 mb-2">Sobre a localização</h4>
          <p className="text-blue-800 text-base mb-1">
            {description}
          </p>
          {location && (
            <p className="text-blue-600 text-sm font-medium mt-2">
              📍 {location}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
