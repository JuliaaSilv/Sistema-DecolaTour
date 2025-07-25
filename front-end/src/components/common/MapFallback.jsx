import React from 'react';

/**
 * Componente de mapa alternativo/fallback quando o Google Maps não está disponível
 * @param {string} location - Nome da localização
 * @param {string} className - Classes CSS para estilização
 */
const MapFallback = ({ location, className = "w-full h-64 rounded-lg" }) => {
  const handleOpenMap = () => {
    const encodedLocation = encodeURIComponent(location);
    window.open(`https://www.google.com/maps/search/${encodedLocation}`, '_blank');
  };

  return (
    <div className={`${className} bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 flex flex-col items-center justify-center p-6`}>
      <div className="text-center">
        <div className="text-4xl mb-4">🗺️</div>
        <h4 className="text-lg font-bold text-blue-900 mb-2">Mapa Interativo</h4>
        <p className="text-blue-700 mb-4 text-sm">
          Localização: <span className="font-medium">{location}</span>
        </p>
        <button
          onClick={handleOpenMap}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-colors duration-200 flex items-center gap-2 mx-auto"
        >
          <span>📍</span>
          Ver no Google Maps
        </button>
        <p className="text-blue-600 text-xs mt-3">
          Clique para abrir o mapa em uma nova aba
        </p>
      </div>
    </div>
  );
};

export default MapFallback;
