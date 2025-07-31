import React from 'react';
import { Clock, Calendar, Coffee, MapPin, Star, Users, Car, Wifi } from 'lucide-react';

const PackageHighlights = ({ pacote }) => {
  const highlights = [
    {
      icon: <MapPin className="text-[#F28C38]" size={24} />,
      title: "Localização",
      description: "Centro da cidade, próximo a principais atrações"
    },
    {
      icon: <Calendar className="text-[#F28C38]" size={24} />,
      title: "Duração",
      description: `${pacote.duracao} dias e ${pacote.duracao - 1} noites de experiência única `
    },
    {
      icon: <Users className="text-[#F28C38]" size={24} />,
      title: "Ideal para",
      description: "Casais, famílias e grupos de amigos"
    },
    {
      icon: <Star className="text-[#F28C38]" size={24} />,
      title: "Experiência",
      description: "Guia especializado e roteiro personalizado"
    }
  ];

  const amenities = [
    { icon: <Wifi size={20} />, name: "Wi-Fi gratuito" },
    { icon: <Car size={20} />, name: "Estacionamento" },
    { icon: <Coffee size={20} />, name: "Café da manhã" },
    { icon: <Clock size={20} />, name: "Check-in 24h" }
  ];

  return (
    <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-12">
      <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Por que escolher este pacote?
        </h2>
        
        {/* Principais destaques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-3">
                {highlight.icon}
                <h3 className="font-semibold text-gray-800 ml-3">{highlight.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{highlight.description}</p>
            </div>
          ))}
        </div>

        {/* Comodidades */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 text-center">Comodidades Incluídas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-700">
                <div className="text-[#F28C38]">{amenity.icon}</div>
                <span className="text-sm">{amenity.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Informações rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Clock className="text-[#F28C38] mx-auto mb-2" size={24} />
            <h4 className="font-semibold text-gray-800 mb-1">Check-in</h4>
            <p className="text-gray-600 text-sm">A partir das 14:00</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Clock className="text-[#F28C38] mx-auto mb-2" size={24} />
            <h4 className="font-semibold text-gray-800 mb-1">Check-out</h4>
            <p className="text-gray-600 text-sm">Até às 12:00</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <Coffee className="text-[#F28C38] mx-auto mb-2" size={24} />
            <h4 className="font-semibold text-gray-800 mb-1">Café da manhã</h4>
            <p className="text-gray-600 text-sm">06:30 às 10:00</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageHighlights;
