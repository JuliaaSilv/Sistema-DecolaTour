/**
 * COMPONENTE SEARCH BAR - Versão Simplificada
 * 
 * Barra de busca com campos básicos:
 * - Origem e Destino (com hover e cursor)
 * - Datas de ida e volta (com seletor de calendário)
 * - Número de viajantes (com select)
 * - Botão de buscar (com componente Button)
 */

import React, { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaUsers, FaSearch, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import Button from './Button';
import { getAllPackages } from '../../api/packages';

const FunctionalSearchBar = ({ onSearch }) => {
  // Estado simples para os dados da busca
  // const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [dataIda, setDataIda] = useState('');
  const [dataVolta, setDataVolta] = useState('');
  const [pessoas, setPessoas] = useState(2);
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(10000);
  
  // Estados para o dropdown de sugestões
  const [pacotes, setPacotes] = useState([]);
  const [sugestoes, setSugestoes] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [carregandoPacotes, setCarregandoPacotes] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Data mínima (hoje)
  const hoje = new Date().toISOString().split('T')[0];

  // Carregar pacotes na inicialização
  useEffect(() => {
    carregarPacotes();
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarSugestoes(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const carregarPacotes = async () => {
    try {
      setCarregandoPacotes(true);
      const todosPacotes = await getAllPackages();
      setPacotes(todosPacotes || []);
    } catch (error) {
      console.error('Erro ao carregar pacotes:', error);
    } finally {
      setCarregandoPacotes(false);
    }
  };

  // Filtrar sugestões baseadas no texto digitado
  const filtrarSugestoes = (texto) => {
    if (!texto || texto.length < 2) {
      setSugestoes([]);
      setMostrarSugestoes(false);
      return;
    }

    const textoLower = texto.toLowerCase();
    const sugestoesFiltradas = pacotes
      .filter(pacote => {
        const titulo = (pacote.titulo || '').toLowerCase();
        const destino = (pacote.destino || '').toLowerCase();
        const nome = (pacote.nome || '').toLowerCase();
        
        return titulo.includes(textoLower) || 
               destino.includes(textoLower) || 
               nome.includes(textoLower);
      })
      .slice(0, 5) // Limitar a 5 sugestões
      .map(pacote => ({
        id: pacote.id,
        texto: pacote.titulo || pacote.nome || pacote.destino,
        destino: pacote.destino || pacote.titulo || pacote.nome,
        preco: pacote.valorTotal || pacote.preco || 0
      }));

    setSugestoes(sugestoesFiltradas);
    setMostrarSugestoes(sugestoesFiltradas.length > 0);
  };

  // Lidar com mudanças no input de destino
  const handleDestinoChange = (e) => {
    const valor = e.target.value;
    setDestino(valor);
    filtrarSugestoes(valor);
  };

  // Selecionar uma sugestão
  const selecionarSugestao = (sugestao) => {
    setDestino(sugestao.destino);
    setMostrarSugestoes(false);
    inputRef.current?.focus();
  };

  // Função para formatar preço
  const formatarPreco = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  // Função para realizar a busca
  const handleBuscar = () => {
    // Fechar dropdown de sugestões quando buscar
    setMostrarSugestoes(false);
    
    // Verifica se pelo menos um campo foi preenchido
    const temDestino = destino.trim();
    const temPreco = precoMax > 0 && precoMax < 20000;
    const temViajantes = pessoas > 0;
    
    // Se nenhum filtro foi aplicado, não realiza a busca
    if (!temDestino && !temPreco && !temViajantes) {
      return;
    }

    const dadosBusca = {
      destino: destino.trim() || null,
      dataIda: dataIda || null,
      dataVolta: dataVolta || null,
      pessoas: parseInt(pessoas),
      precoMin: parseInt(precoMin),
      precoMax: parseInt(precoMax)
    };
    
    console.log('Realizando busca:', dadosBusca);
    if (onSearch) {
      onSearch(dadosBusca);
    }
  };

  return (
    <>
      <style>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
          background: linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(precoMax / 20000) * 100}%, #e5e7eb ${(precoMax / 20000) * 100}%, #e5e7eb 100%);
          outline: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-xl border border-gray-100">
        <div className="p-3 sm:p-4 md:p-5 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Campo Destino */}
          <div className="relative md:col-span-1" ref={dropdownRef}>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              <FaMapMarkerAlt className="inline w-3 h-3 mr-1" />
              Destino
            </label>
            <input
              ref={inputRef}
              type="text"
              placeholder="Para onde vamos?"
              value={destino}
              onChange={handleDestinoChange}
              onFocus={() => {
                if (destino.length >= 2) {
                  filtrarSugestoes(destino);
                }
              }}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base placeholder-gray-400"
            />
            
            {/* Dropdown de Sugestões */}
            {mostrarSugestoes && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1">
                {carregandoPacotes ? (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    Carregando sugestões...
                  </div>
                ) : sugestoes.length > 0 ? (
                  <div className="max-h-48 overflow-y-auto">
                    {sugestoes.map((sugestao) => (
                      <div
                        key={sugestao.id}
                        onClick={() => selecionarSugestao(sugestao)}
                        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-blue-500 w-3 h-3" />
                            <span className="text-sm font-medium text-gray-800">
                              {sugestao.texto}
                            </span>
                          </div>
                          {sugestao.preco > 0 && (
                            <span className="text-xs text-gray-500">
                              A partir de {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                                minimumFractionDigits: 0
                              }).format(sugestao.preco)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-gray-500 text-sm">
                    Nenhuma sugestão encontrada
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Campo Quantidade de Viajantes */}
          <div className="relative md:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              <FaUsers className="inline w-3 h-3 mr-1" />
              Viajantes
            </label>
            <select 
              value={pessoas}
              onChange={(e) => setPessoas(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value={1}>1 viajante</option>
              <option value={2}>2 viajantes</option>
              <option value={3}>3 viajantes</option>
              <option value={4}>4 viajantes</option>
              <option value={5}>5 viajantes</option>
              <option value={6}>6 viajantes</option>
              <option value={7}>7 viajantes</option>
              <option value={8}>8 viajantes</option>
            </select>
          </div>

          {/* Campo Faixa de Preço */}
          <div className="relative md:col-span-1">
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              <FaDollarSign className="inline w-3 h-3 mr-1" />
              Faixa de Preço
            </label>
            <div className="relative py-2.5">
              <input
                type="range"
                min="0"
                max="20000"
                step="500"
                value={precoMax}
                onChange={(e) => setPrecoMax(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="absolute top-full left-0 right-0 text-xs text-gray-500 text-center mt-1">
                Até {formatarPreco(precoMax)}
              </div>
            </div>
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
    </>
  );
};

export default FunctionalSearchBar;
