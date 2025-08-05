import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

/**
 * Componente Tooltip simples
 * @param {string} content - Texto do tooltip
 * @param {ReactNode} children - Elemento que ativa o tooltip
 * @param {string} position - Posição do tooltip ('right', 'left', 'top', 'bottom')
 */
const Tooltip = ({ content, children, position = 'right' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      let top, left;

      switch (position) {
        case 'right':
          top = rect.top + rect.height / 2 - 16; // Ajustar para centralizar
          left = rect.right + 8;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - 16;
          left = rect.left - 8;
          break;
        case 'top':
          top = rect.top - 8;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 8;
          left = rect.left + rect.width / 2;
          break;
        default:
          top = rect.top + rect.height / 2 - 16;
          left = rect.right + 8;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  const getTooltipTransform = () => {
    switch (position) {
      case 'left':
        return 'translateX(-100%)';
      case 'top':
        return 'translateX(-50%) translateY(-100%)';
      case 'bottom':
        return 'translateX(-50%)';
      default:
        return '';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'right':
        return "-left-1 top-1/2 -translate-y-1/2";
      case 'left':
        return "-right-1 top-1/2 -translate-y-1/2";
      case 'top':
        return "-bottom-1 left-1/2 -translate-x-1/2";
      case 'bottom':
        return "-top-1 left-1/2 -translate-x-1/2";
      default:
        return "-left-1 top-1/2 -translate-y-1/2";
    }
  };

  const tooltipElement = isVisible ? (
    <div 
      className="fixed z-[9999] px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap pointer-events-none"
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
        transform: getTooltipTransform()
      }}
    >
      {content}
      <div className={cn(
        "absolute w-2 h-2 bg-gray-900 transform rotate-45",
        getArrowClasses()
      )} />
    </div>
  ) : null;

  return (
    <>
      <div 
        ref={triggerRef}
        className="relative inline-block"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {tooltipElement && createPortal(tooltipElement, document.body)}
    </>
  );
};

export default Tooltip;
