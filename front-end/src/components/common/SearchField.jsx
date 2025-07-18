/**
 * COMPONENTE SEARCH FIELD - Campo de busca simples e funcional
 */

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const SearchField = ({ 
  type,
  label,
  placeholder,
  value,
  onChange,
  width = 'w-[236px]'
}) => {
  // Para campos que precisam de estado interno
  const [internalValue, setInternalValue] = useState(value || '');

  const handleChange = (newValue) => {
    setInternalValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Ícones para cada tipo
  const icons = {
    location: <FaMapMarkerAlt className="text-gray-400 text-sm" />,
    date: <FaCalendarAlt className="text-gray-400 text-sm" />,
    people: <FaUsers className="text-gray-400 text-sm" />
  };

  // Renderizar campo baseado no tipo
  const renderInput = () => {
    if (type === 'people') {
      return (
        <select
          value={internalValue || '2'}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full bg-transparent text-sm text-black font-normal focus:outline-none cursor-pointer"
        >
          {[1,2,3,4,5,6,7,8].map(num => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'pessoa' : 'pessoas'}
            </option>
          ))}
        </select>
      );
    }

    if (type === 'date') {
      return (
        <input
          type="date"
          value={internalValue}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full bg-transparent text-sm text-black font-normal focus:outline-none"
        />
      );
    }

    return (
      <input
        type="text"
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-black font-normal focus:outline-none placeholder-gray-400"
      />
    );
  };

  return (
    <div className={`${width} h-[42px] bg-white rounded-lg flex items-center px-3 gap-3 shadow-sm border border-gray-200 hover:border-gray-300 transition-colors`}>
      {icons[type] && (
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
      )}
      
      <div className="flex-1 flex flex-col justify-center">
        {label && (
          <label className="text-xs text-gray-600 font-medium">{label}</label>
        )}
        {renderInput()}
      </div>
    </div>
  );
};

export default SearchField;
