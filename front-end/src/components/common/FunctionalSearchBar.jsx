/**
 * COMPONENTE SEARCH BAR - Versão Simplificada
 * 
 * Barra de busca com campos básicos:
 * - Origem e Destino (com hover e cursor)
 * - Datas de ida e volta (com seletor de calendário)
 * - Número de viajantes (com select)
 * - Botão de buscar (com componente Button)
 */

import React, { useState } from 'react';
import { FaCalendarAlt, FaUsers, FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import Button from './Button';

const FunctionalSearchBar = ({ onSearch }) => {
  // Estado simples para os dados da busca
  // const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');
  const [pessoas, setPessoas] = useState(2);

  // Data mínima (hoje)
  const hoje = new Date().toISOString().split('T')[0];

  // Função para realizar a busca
  const handleBuscar = () => {
    // Validação básica
    if (!destino.trim()) {
      return; // Remove o alert conforme solicitado anteriormente
    }

    const dadosBusca = {
      destino: destino.trim(),
      dataIda: dataIda || null,
      dataVolta: dataVolta || null,
      pessoas: parseInt(pessoas)
    };
    
    console.log('Realizando busca:', dadosBusca);
    if (onSearch) {
      onSearch(dadosBusca);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-100">
      <div className="p-3 sm:p-4 md:p-5 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Campo Destino */}
          <div className="relative md:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              <FaMapMarkerAlt className="inline w-3 h-3 mr-1" />
              Destino
            </label>
            <input
              type="text"
              placeholder="Para onde vamos?"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base placeholder-gray-400"
            />
          </div>
          
          {/* Campo Quantidade de Passageiros */}
          <div className="relative md:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              <FaUsers className="inline w-3 h-3 mr-1" />
              Passageiros
            </label>
            <select 
              value={pessoas}
              onChange={(e) => setPessoas(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value={1}>1 passageiro</option>
              <option value={2}>2 passageiros</option>
              <option value={3}>3 passageiros</option>
              <option value={4}>4 passageiros</option>
              <option value={5}>5 passageiros</option>
              <option value={6}>6 passageiros</option>
              <option value={7}>7 passageiros</option>
              <option value={8}>8 passageiros</option>
            </select>
          </div>
          
          {/* Botão de Busca */}
          <div className="flex items-end md:col-span-1">
            <button
              onClick={handleBuscar}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <FaSearch className="w-4 h-4" />
              <span className="hidden sm:inline">Buscar Pacotes</span>
              <span className="sm:hidden">Buscar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionalSearchBar;
