import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import MapFallback from './MapFallback';

/**
 * Componente GoogleMap integrado com a API do Google Maps
 * @param {string} location - Nome da cidade/localização para buscar
 * @param {string} className - Classes CSS para estilização
 * @param {number} width - Largura do mapa
 * @param {number} height - Altura do mapa
 */
const GoogleMap = ({ 
  location, 
  className = "w-full h-64 rounded-lg",
  width = 400,
  height = 300
}) => {
  const mapRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verifica se a API key está configurada
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  useEffect(() => {
    if (!location) return;
    
    // Se não há API key, usa o fallback imediatamente
    if (!apiKey || apiKey === "your_google_maps_api_key_here") {
      setError("API_KEY_NOT_CONFIGURED");
      setIsLoading(false);
      return;
    }

    const initMap = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Configuração do loader do Google Maps
        const loader = new Loader({
          apiKey: apiKey,
          version: "weekly",
          libraries: ["places", "geocoding", "maps"]
        });

        const [{ Map }, { Geocoder }] = await Promise.all([
          loader.importLibrary("maps"),
          loader.importLibrary("geocoding")
        ]);

        // Inicializa o geocoder
        const geocoder = new Geocoder();

        // Busca a localização
        geocoder.geocode({ address: location }, async (results, status) => {
          if (status === "OK" && results[0]) {
            const position = results[0].geometry.location;

            // Cria o mapa
            const map = new Map(mapRef.current, {
              zoom: 12,
              center: position,
              mapTypeControl: true,
              streetViewControl: true,
              fullscreenControl: true,
              zoomControl: true,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "on" }]
                }
              ]
            });

            // Adiciona um marcador clássico (sem aviso no console)
            const { Marker } = google.maps;
            new Marker({
              map: map,
              position: position,
              title: location,
              animation: google.maps.Animation.DROP
            });

            setIsLoading(false);
          } else {
            setError(`Não foi possível encontrar a localização: ${location}`);
            setIsLoading(false);
          }
        });

      } catch (err) {
        console.error("Erro ao carregar o Google Maps:", err);
        setError("Erro ao carregar o mapa. Verifique a configuração da API.");
        setIsLoading(false);
      }
    };

    initMap();
  }, [location, apiKey]);

  // Se a API key não está configurada, usa o fallback
  if (error === "API_KEY_NOT_CONFIGURED") {
    return <MapFallback location={location} className={className} />;
  }

  if (error && error !== "API_KEY_NOT_CONFIGURED") {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center border border-gray-300`}>
        <div className="text-center p-4">
          <p className="text-red-600 font-medium mb-2">⚠️ Erro no mapa</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <p className="text-gray-500 text-xs mt-2">
            Verifique a configuração da VITE_GOOGLE_MAPS_API_KEY no arquivo .env
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`${className} bg-gray-100 flex items-center justify-center border border-gray-300`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ minHeight: `${height}px` }}
      />
    </div>
  );
};

export default GoogleMap;
