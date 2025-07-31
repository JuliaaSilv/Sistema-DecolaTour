import React from 'react';
import { CheckCircle, MapPin, Camera, Utensils, Car, Wifi, Dumbbell, Users } from 'lucide-react';

const PackageOverview = ({ pacote }) => {
  const highlights = [
    "Vista panorâmica da cidade",
    "Acesso fácil a pontos turísticos",
    "Café da manhã continental incluso"
  ];

  const included = [
    { icon: <Camera size={20} />, text: "City tour guiado" },
    { icon: <Utensils size={20} />, text: "Café da manhã completo" },
    { icon: <Car size={20} />, text: "Estacionamento gratuito" }
  ];

  const amenities = [
    { icon: <Wifi size={20} />, text: "Wi-Fi de alta velocidade" },
    { icon: <Dumbbell size={20} />, text: "Academia 24 horas" },
    { icon: <Users size={20} />, text: "Recepção 24 horas" },
  ];

  return (
    <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Destaques do Pacote */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-[#F28C38] rounded-full"></div>
            Destaques
          </h3>
          <ul className="space-y-3">
            {highlights.map((highlight, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={16} />
                <span className="text-gray-700 text-sm">{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* O que está incluído */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-[#F28C38] rounded-full"></div>
            Incluído no Pacote
          </h3>
          <ul className="space-y-3">
            {included.map((item, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="text-[#F28C38]">{item.icon}</div>
                <span className="text-gray-700 text-sm">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Comodidades */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-6 bg-[#F28C38] rounded-full"></div>
            Comodidades
          </h3>
          <ul className="space-y-3">
            {amenities.map((amenity, index) => (
              <li key={index} className="flex items-center gap-3">
                <div className="text-[#F28C38]">{amenity.icon}</div>
                <span className="text-gray-700 text-sm">{amenity.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Descrição resumida */}
      <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-2xl p-8 mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Sobre este Pacote
        </h3>
        <p className="text-gray-700 text-center leading-relaxed max-w-4xl mx-auto">
          {pacote?.descricao || "Descrição não disponível."}
        </p>
      </div>
    </section>
  );
};

export default PackageOverview;
