import React from 'react';

/**
 * Componente que exibe o que está incluso no pacote
 * @param {object} pacote - Dados do pacote (descricao, detalhes, politicas)
 */
const PackageInclusions = ({ pacote }) => {
  return (
    <section className="max-w-full md:max-w-6xl mx-auto px-2 sm:px-4 md:px-8">
      <div>
        {/* Descrição do pacote */}
        <h2 className="text-xl font-semibold text-blue-900 mb-3">Descrição do pacote</h2>
        <p className="text-blue-800 mb-6">{pacote.descricao}</p>
        
        {/* O que está incluso */}
        <h3 className="text-lg font-semibold text-blue-900">O que está incluso:</h3>
        <ul className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 p-6">
          {pacote.detalhes.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-blue-700 font-medium">{item.label}:</span>
              <span className="text-blue-900">{item.valor}</span>
            </li>
          ))}
        </ul>
        
        {/* Política de cancelamento */}
        <div className="mb-6">
          <h4 className="text-blue-800 font-semibold mb-1">Política de cancelamento</h4>
          <p className="text-blue-700 text-sm">{pacote.politicas}</p>
        </div>
      </div>
    </section>
  );
};

export default PackageInclusions;
