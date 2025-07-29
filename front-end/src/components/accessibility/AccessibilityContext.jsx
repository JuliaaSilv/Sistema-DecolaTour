import React, { createContext, useContext, useState } from "react";

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [fontSize, setFontSize] = useState(1); // 1 = normal, 1.2 = maior, etc
  // contrastMode: 'none' | 'high' | 'yellow' | 'yellowwhite'
  const [contrastMode, setContrastMode] = useState('none');

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
      <div className={contrastClass} style={{ fontSize: `${fontSize}em` }}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
