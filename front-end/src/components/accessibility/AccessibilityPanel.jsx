

import React, { useEffect } from "react";
import { useAccessibility } from "./AccessibilityContext";
import ScreenReaderPanel from "./ScreenReaderButton";

export default function AccessibilityPanel({ onClose }) {
  const { fontSize, setFontSize, contrastMode, setContrastMode } = useAccessibility();

  // Aplicar classe de contraste diretamente no modal
  let contrastClass = '';
  if (contrastMode === 'high') contrastClass = 'contrast-high';
  if (contrastMode === 'yellow') contrastClass = 'contrast-yellow';
  if (contrastMode === 'yellowwhite') contrastClass = 'contrast-yellowwhite';

  // Fechar com ESC
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    // Prevenir scroll da página quando o modal está aberto
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <>
      {/* Overlay invisível que cobre toda a tela para capturar cliques */}
      <div 
        className={`fixed inset-0 z-[9998] ${contrastClass}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Painel de acessibilidade - próximo ao botão no canto inferior esquerdo */}
      <div
        className={`fixed bottom-20 left-4 z-[9999] bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-6 w-80 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)] overflow-y-auto flex flex-col gap-4 border border-gray-200 dark:border-gray-700 ${contrastClass}`}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        data-accessibility-panel="true"
      >
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-gray-800 dark:text-gray-100">Acessibilidade</span>
        <button
          onClick={onClose}
          aria-label="Fechar painel"
          className="text-gray-500 hover:text-orange-500 text-xl font-bold"
        >×</button>
      </div>
      <div>
        <span className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Tamanho da fonte</span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-orange-900"
            onClick={() => {
              setFontSize(f => {
                const newSize = Math.max(0.8, f - 0.1);
                console.log('Diminuindo fonte:', f, '->', newSize);
                return newSize;
              });
            }}
            aria-label="Diminuir fonte"
          >A-</button>
          <button
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-orange-900"
            onClick={() => {
              console.log('Resetando fonte para:', 1);
              setFontSize(1);
            }}
            aria-label="Fonte normal"
          >A</button>
          <button
            className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-orange-900"
            onClick={() => {
              setFontSize(f => {
                const newSize = Math.min(1.5, f + 0.1);
                console.log('Aumentando fonte:', f, '->', newSize);
                return newSize;
              });
            }}
            aria-label="Aumentar fonte"
          >A+</button>
        </div>
      </div>
      <div>
        <span className="block text-sm mb-1 text-gray-700 dark:text-gray-200">Contraste</span>
        <div className="flex flex-col gap-2">
          <button
            className={`w-full px-3 py-2 rounded ${contrastMode === 'high' ? "bg-orange-500 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"} hover:bg-orange-100 dark:hover:bg-orange-900`}
            onClick={() => setContrastMode(contrastMode === 'high' ? 'none' : 'high')}
            aria-pressed={contrastMode === 'high'}
          >
            {contrastMode === 'high' ? "Desativar contraste branco/preto" : "Ativar contraste branco/preto"}
          </button>
          <button
            className={`w-full px-3 py-2 rounded ${contrastMode === 'yellow' ? "bg-yellow-400 text-black" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"} hover:bg-yellow-200 dark:hover:bg-yellow-700`}
            onClick={() => setContrastMode(contrastMode === 'yellow' ? 'none' : 'yellow')}
            aria-pressed={contrastMode === 'yellow'}
          >
            {contrastMode === 'yellow' ? "Desativar contraste amarelo/preto" : "Ativar contraste amarelo/preto"}
          </button>
          <button
            className={`w-full px-3 py-2 rounded ${contrastMode === 'yellowwhite' ? "bg-yellow-200 text-yellow-900 border-yellow-400" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"} hover:bg-yellow-100 dark:hover:bg-yellow-300`}
            onClick={() => setContrastMode(contrastMode === 'yellowwhite' ? 'none' : 'yellowwhite')}
            aria-pressed={contrastMode === 'yellowwhite'}
          >
            {contrastMode === 'yellowwhite' ? "Desativar contraste branco/amarelo" : "Ativar contraste branco/amarelo"}
          </button>
        </div>
      </div>
      <div>
        <span className="block text-sm mb-1 text-gray-700 dark:text-gray-200 mt-2">Leitor de tela</span>
        <ScreenReaderPanel />
      </div>
    </div>
    </>
  );
}
