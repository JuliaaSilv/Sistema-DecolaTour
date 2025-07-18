/**
 * COMPONENTE BUTTON - Reutilizável
 * 
 * Componente de botão padronizado que pode ser usado em toda a aplicação
 * - Suporte a diferentes variantes (primary, secondary)
 * - Tamanhos personalizáveis
 * - Estados de hover e transições
 */

import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  ...props 
}) => {
  // Estilos base do botão
  const baseStyles = 'font-normal rounded-md transition-colors duration-300 cursor-pointer';
  
  // Variantes de estilo
  const variants = {
    primary: 'bg-[#F28C38E5] text-white hover:bg-[#5a3f7b]',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };
  
  // Tamanhos disponíveis
  const sizes = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
    custom: '' // Para casos especiais como o botão Buscar
  };
  
  // Combina todas as classes
  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
