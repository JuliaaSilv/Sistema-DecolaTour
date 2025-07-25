import React, { useState } from 'react';
import { cn } from '../../lib/utils';

/**
 * Componente Tooltip simples
 * @param {string} content - Texto do tooltip
 * @param {ReactNode} children - Elemento que ativa o tooltip
 * @param {string} position - Posição do tooltip ('right', 'left', 'top', 'bottom')
 */
const Tooltip = ({ content, children, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={cn(
          "absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap",
          positionClasses[position]
        )}>
          {content}
          <div className={cn(
            "absolute w-2 h-2 bg-gray-900 transform rotate-45",
            position === 'right' && "-left-1 top-1/2 -translate-y-1/2",
            position === 'left' && "-right-1 top-1/2 -translate-y-1/2",
            position === 'top' && "-bottom-1 left-1/2 -translate-x-1/2",
            position === 'bottom' && "-top-1 left-1/2 -translate-x-1/2"
          )} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
