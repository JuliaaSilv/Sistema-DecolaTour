import React from 'react';

/**
 * Componente com informações de check-in/out e horários
 * @param {string} checkIn - Horário de check-in (padrão: "14:00")
 * @param {string} checkOut - Horário de check-out (padrão: "12:00") 
 * @param {string} breakfast - Horário do café (padrão: "De 06:30 às 10:00")
 */
const CheckInOutInfo = ({ 
  checkIn = "14:00", 
  checkOut = "12:00", 
  breakfast = "De 06:30 às 10:00" 
}) => {
  return (
    <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8 mt-8">
      <div className="pt-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Condições da hospedagem</h2>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">Horários</h3>
            
            {/* Check-in */}
            <div className="flex items-center mb-4">
              <i className="eva-3-icon-check-in text-blue-700 text-xl mr-2" />
              <span className="text-blue-900">
                Horário de Check in: <span className="font-medium">{checkIn}</span>
              </span>
            </div>
            
            {/* Check-out */}
            <div className="flex items-center mb-4">
              <i className="eva-3-icon-check-out text-blue-700 text-xl mr-2" />
              <span className="text-blue-900">
                Horário de Check out: <span className="font-medium">{checkOut}</span>
              </span>
            </div>
            
            {/* Café da manhã */}
            <div className="flex items-center mb-4">
              <i className="eva-3-icon-breakfast text-blue-700 text-xl mr-2" />
              <span className="text-blue-900">
                Café da manhã: <span className="font-medium">{breakfast}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckInOutInfo;
