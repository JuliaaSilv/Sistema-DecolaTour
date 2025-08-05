import React from 'react';
import { MapPin, Navigation, Clock, MapIcon } from 'lucide-react';
import GoogleMap from '../common/GoogleMap';
import Button from '../common/Button';

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
      <div className="detail-section accommodation-info-map bg-white rounded-2xl p-6 flex flex-col gap-8 mb-8 shadow-lg border border-gray-100">
        {/* Título da seção */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Localização</h3>
          </div>
          <Button
            variant="primary"
            size="large"
            className="rounded-lg font-semibold shadow hover:shadow-lg transition self-start sm:self-auto flex items-center gap-2"
            onClick={onMapClick}
          >
            <Navigation className="w-4 h-4" />
            Veja no Google Maps
          </Button>
        </div>
        
        {/* Mapa do Google Maps */}
        {location && (
          <div className="w-full">
            <GoogleMap 
              location={location}
              className="w-full h-64 sm:h-80 md:h-96 rounded-xl shadow-lg border border-gray-200"
              height={320}
            />
          </div>
        )}
        
        {/* Info da localização */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-200 rounded-lg">
              <MapIcon className="w-5 h-5 text-orange-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-800">Sobre a localização</h4>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-700 text-base leading-relaxed">
              {description}
            </p>
            
            {/* Destaques da localização */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-orange-100">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <Clock className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Acesso Rápido</p>
                  <p className="text-xs text-gray-600">Próximo às principais atrações</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-orange-100">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                  <Navigation className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Localização Estratégica</p>
                  <p className="text-xs text-gray-600">Fácil acesso ao transporte público</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
