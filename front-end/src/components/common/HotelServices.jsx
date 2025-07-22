// Componente para lista de serviços do hotel
import React from 'react';
import Icon from './Icon';

const ServiceItem = ({ icon, text }) => (
  <div className="flex flex-col items-center min-w-[90px] px-8 py-0">
    <Icon name={icon} className="h-8 w-8 text-blue-700 mb-2" />
    <span className="item-text text-center text-gray-700 text-sm whitespace-pre-line">
      {text}
    </span>
  </div>
);

const HotelServices = ({ services }) => (
  <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mb-10">
    <h2 className="text-blue-900 text-xl sm:text-2xl md:text-3xl font-bold mb-8 text-left sm:text-center">
      A hospedagem oferece
    </h2>
    <div className="flex flex-row items-start justify-center gap-x-2 gap-y-4 flex-wrap bg-transparent">
      {services.map((service, index) => (
        <ServiceItem key={index} icon={service.icon} text={service.text} />
      ))}
    </div>
  </section>
);

export default HotelServices;
