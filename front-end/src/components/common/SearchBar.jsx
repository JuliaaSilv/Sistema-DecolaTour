/**
 * COMPONENTE SEARCH BAR - Totalmente responsivo
 * 
 * Componente básico e funcional para a seção de busca
 * - Design mobile-first com breakpoints inteligentes
 * - Layout adaptativo para todos os tamanhos de tela
 * - Props simples para customização básica
 * - Reutiliza os componentes SearchField e Button
 */

import React from 'react';
import SearchField from './SearchField';
import Button from './Button';

const SearchBar = ({ 
  title = 'Busque seu destino',
  buttonText = 'Buscar',
  onSearch
}) => {
  // Configuração dos campos de busca funcionais
  const originDestinationFields = [
    // { label: 'Origem', placeholder: 'De onde você sai?' },
    { label: 'Destino', placeholder: 'Para onde quer ir?' }
  ];
  
  const calendarFields = [
    { label: 'Ida', placeholder: 'Data de ida' },
    { label: 'Volta', placeholder: 'Data de volta' }
  ];
  
  const peopleFields = [
    { label: 'Viajantes', placeholder: 'Quantas pessoas?' }
  ];

  const handleSearchClick = () => {
    // Aqui você pode coletar os valores dos campos e fazer a busca
    console.log('Realizando busca...');
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <div className="w-full bg-[#6A4C93] bg-opacity-95 backdrop-blur-sm relative mx-auto flex flex-col justify-center rounded-xl lg:rounded-2xl gap-3 sm:gap-4 p-4 sm:p-5 md:p-6 lg:p-8 shadow-2xl border border-white border-opacity-20">
      {/* Título responsivo */}
      <h1 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-semibold font-roboto text-center sm:text-left leading-tight">
        {title}
      </h1>
      
      {/* Container dos campos - Ultra responsivo */}
      <div className="flex flex-col sm:flex-col md:flex-row items-stretch justify-between w-full gap-3 sm:gap-4 md:gap-3 lg:gap-4">
        {/* Campo de origem/destino com ícone de mapa */}
        <div className="flex-1 min-w-0">
          <SearchField 
            width="w-full"
            fields={originDestinationFields}
            type="location"
            className="h-[45px] sm:h-[48px] md:h-[42px] lg:h-[45px]"
          />
        </div>
        
        {/* Campo de calendário com ícone de calendário */}
        <div className="flex-1 min-w-0">
          <SearchField 
            width="w-full"
            fields={calendarFields}
            type="date"
            className="h-[45px] sm:h-[48px] md:h-[42px] lg:h-[45px]"
          />
        </div>
        
        {/* Campo de pessoas com ícone de usuários */}
        <div className="flex-1 sm:flex-none sm:w-full md:w-[130px] lg:w-[140px] min-w-0">
          <SearchField 
            width="w-full"
            fields={peopleFields}
            type="people"
            className="h-[45px] sm:h-[48px] md:h-[42px] lg:h-[45px]"
          />
        </div>
      </div>
      
      {/* Botão de buscar - Totalmente responsivo */}
      <div className="flex justify-center sm:justify-center md:justify-end mt-2 sm:mt-3 md:mt-2">
        <Button 
          variant="primary"
          size="custom"
          className="w-full sm:w-full md:w-auto md:min-w-[100px] lg:min-w-[120px] h-[45px] sm:h-[48px] md:h-[35px] lg:h-[40px] text-sm sm:text-base md:text-sm lg:text-base font-semibold rounded-lg md:rounded-md lg:rounded-lg px-4 sm:px-6 md:px-4 lg:px-6 bg-[#F28C38] hover:bg-[#e07627] transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={handleSearchClick}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
