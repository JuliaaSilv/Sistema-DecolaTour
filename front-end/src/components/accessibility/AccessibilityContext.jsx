import React, { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(1); // 1 = normal, 1.2 = maior, etc
  // contrastMode: 'none' | 'high' | 'yellow' | 'yellowwhite'
  const [contrastMode, setContrastMode] = useState('none');

  // Aplicar font-size diretamente no elemento root da aplicação
  useEffect(() => {
    console.log('Aplicando fontSize:', fontSize);
    
    // CSS custom property - esta é a chave para funcionar
    document.documentElement.style.setProperty('--accessibility-font-size', `${fontSize}rem`);
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.style.fontSize = `${fontSize}rem`;
      console.log('Root element font-size:', rootElement.style.fontSize);
    }
    
    console.log('CSS custom property definida:', `${fontSize}rem`);
  }, [fontSize]);

  const value = {
    fontSize,
    setFontSize,
    contrastMode,
    setContrastMode,
  };

  let contrastClass = '';
  if (contrastMode === 'high') contrastClass = 'contrast-high';
  if (contrastMode === 'yellow') contrastClass = 'contrast-yellow';
  if (contrastMode === 'yellowwhite') contrastClass = 'contrast-yellowwhite';

  return (
    <AccessibilityContext.Provider value={value}>
      <div 
        className={contrastClass}
        data-accessibility-wrapper="true"
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
