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
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');
  const [pessoas, setPessoas] = useState(2);

  // Função para realizar a busca
  const handleBuscar = () => {
    const dadosBusca = {
      origem,
      destino,
      dataIda,
      dataVolta,
      pessoas
    };
    
    console.log('Realizando busca:', dadosBusca);
    if (onSearch) {
      onSearch(dadosBusca);
    }
  };

  return (
    <div className="bg-blue-400 bg-opacity-90 rounded-xl p-6 shadow-2xl border border-white border-opacity-20">
      {/* Título */}
      <h2 className="text-white text-xl font-semibold mb-4 text-center">
        Busque seu destino
      </h2>
      
      {/* Campos de busca */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        
        {/* Origem */}
        <div className="flex-1">
          <div className="bg-white rounded-lg p-3 flex items-center border border-gray-200 hover:border-blue-400 transition-colors cursor-text hover:shadow-md">
            <FaMapMarkerAlt className="text-gray-400 mr-2" />
            <div className="flex-1">
              <label className="block text-xs text-gray-600 font-medium mb-1">
                Origem
              </label>
              <input
                type="text"
                placeholder="De onde você sai?"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                className="w-full text-sm text-black bg-transparent focus:outline-none cursor-text"
              />
            </div>
          </div>
        </div>
        
        {/* Destino */}
        <div className="flex-1">
          <div className="bg-white rounded-lg p-3 flex items-center border border-gray-200 hover:border-blue-400 transition-colors cursor-text hover:shadow-md">
            <FaMapMarkerAlt className="text-gray-400 mr-2" />
            <div className="flex-1">
              <label className="block text-xs text-gray-600 font-medium mb-1">
                Destino
              </label>
              <input
                type="text"
                placeholder="Para onde quer ir?"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className="w-full text-sm text-black bg-transparent focus:outline-none cursor-text"
              />
            </div>
          </div>
        </div>
        
        {/* Data de Ida */}
        <div className="flex-1">
          <div className="bg-white rounded-lg p-3 flex items-center border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer hover:shadow-md">
            <FaCalendarAlt className="text-gray-400 mr-2" />
            <div className="flex-1">
              <label className="block text-xs text-gray-600 font-medium mb-1">
                Data de Ida
              </label>
              <input
                type="date"
                value={dataIda}
                onChange={(e) => setDataIda(e.target.value)}
                className="w-full text-sm text-black bg-transparent focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        {/* Data de Volta */}
        <div className="flex-1">
          <div className="bg-white rounded-lg p-3 flex items-center border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer hover:shadow-md">
            <FaCalendarAlt className="text-gray-400 mr-2" />
            <div className="flex-1">
              <label className="block text-xs text-gray-600 font-medium mb-1">
                Data de Volta
              </label>
              <input
                type="date"
                value={dataVolta}
                onChange={(e) => setDataVolta(e.target.value)}
                min={dataIda}
                className="w-full text-sm text-black bg-transparent focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        {/* Número de Pessoas */}
        <div className="w-full md:w-40">
          <div className="bg-white rounded-lg p-3 flex items-center border border-gray-200 hover:border-blue-400 transition-colors cursor-pointer hover:shadow-md">
            <FaUsers className="text-gray-400 mr-2" />
            <div className="flex-1">
              <label className="block text-xs text-gray-600 font-medium mb-1">
                Viajantes
              </label>
              <select
                value={pessoas}
                onChange={(e) => setPessoas(e.target.value)}
                className="w-full text-sm text-black bg-transparent focus:outline-none cursor-pointer"
              >
                <option value={1}>1 pessoa</option>
                <option value={2}>2 pessoas</option>
                <option value={3}>3 pessoas</option>
                <option value={4}>4 pessoas</option>
                <option value={5}>5 pessoas</option>
                <option value={6}>6 pessoas</option>
                <option value={7}>7 pessoas</option>
                <option value={8}>8 pessoas</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {/* Botão de Buscar */}
      <div className="flex justify-center md:justify-end">
        <Button
          onClick={handleBuscar}
          variant="primary"
          size="medium"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-lg hover:shadow-xl"
        >
          <FaSearch className="text-sm" />
          Buscar
        </Button>
      </div>
    </div>
  );
};

export default FunctionalSearchBar;
