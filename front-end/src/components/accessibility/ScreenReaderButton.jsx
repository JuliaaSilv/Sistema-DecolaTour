import React, { useState, useEffect, useRef } from "react";
import { Volume2, Pause, Play, StopCircle } from "lucide-react";

const voicesMap = {
  "pt-BR": "Português",
  "en-US": "English",
  "es-ES": "Español"
};


export default function ScreenReaderPanel() {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [lang, setLang] = useState("pt-BR");

  // Coleta blocos visíveis da página
  const selectors = "h1,h2,h3,h4,h5,h6,p,li";
  const getBlocks = () => Array.from(document.querySelectorAll(selectors));
  const highlightClass = "sr-highlight";
  let lastBlock = null;
  let lastWordIdx = null;

  // Destaca palavra atual no bloco
  const highlightWord = (el, start, end) => {
    if (!el) return;
    // Remove highlight anterior
    if (lastBlock && lastBlock !== el) {
      lastBlock.innerHTML = lastBlock.innerText;
      lastWordIdx = null;
    }
    // Destaca palavra
    const text = el.innerText;
    const before = text.slice(0, start);
    const word = text.slice(start, end);
    const after = text.slice(end);
    el.innerHTML = `${before}<span class="${highlightClass}">${word}</span>${after}`;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    lastBlock = el;
    lastWordIdx = start;
  };

  const clearHighlight = () => {
    getBlocks().forEach(el => {
      el.innerHTML = el.innerText;
    });
    lastBlock = null;
    lastWordIdx = null;
  };

  const speak = () => {
    const blocks = getBlocks();
    if (!blocks.length) return;
    window.speechSynthesis.cancel();
    setSpeaking(true);
    setPaused(false);
    let idx = 0;

    const speakBlock = () => {
      if (idx >= blocks.length) {
        setSpeaking(false);
        clearHighlight();
        return;
      }
      const el = blocks[idx];
      const text = el.innerText;
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = lang;
      utter.onboundary = (event) => {
        if (event.name === "word" && event.charIndex !== undefined) {
          // Destaca palavra atual usando requestAnimationFrame para fluidez
          window.requestAnimationFrame(() => {
            const start = event.charIndex;
            // Busca fim da palavra
            const match = text.slice(start).match(/\b\w+\b/);
            const end = match ? start + match[0].length : start + 1;
            highlightWord(el, start, end);
          });
        }
      };
      utter.onend = () => {
        idx++;
        speakBlock();
      };
      window.speechSynthesis.speak(utter);
    };
    speakBlock();
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setPaused(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
    clearHighlight();
  };

  // Atalho de teclado: Alt+L
  useEffect(() => {
    const handler = (e) => {
      if (e.altKey && e.key.toLowerCase() === "l") {
        speak();
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      clearHighlight();
    };
    // eslint-disable-next-line
  }, [lang]);

  return (
    <div
      className="flex flex-col gap-2 mt-2"
      aria-label="Leitor de tela por voz"
      tabIndex={0}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={speaking ? stop : speak}
          aria-label={speaking ? "Parar leitura" : "Ouvir página"}
          className="bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <Volume2 />
        </button>
        <select
          value={lang}
          onChange={e => setLang(e.target.value)}
          aria-label="Selecionar idioma da leitura"
          className="rounded px-2 py-1 border border-gray-300 text-sm"
        >
          {Object.entries(voicesMap).map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
        {speaking && !paused && (
          <button onClick={pause} aria-label="Pausar leitura" className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 ml-1">
            <Pause />
          </button>
        )}
        {speaking && paused && (
          <button onClick={resume} aria-label="Retomar leitura" className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 ml-1">
            <Play />
          </button>
        )}
        {speaking && (
          <button onClick={stop} aria-label="Parar leitura" className="bg-gray-100 hover:bg-gray-200 rounded-full p-2 ml-1">
            <StopCircle />
          </button>
        )}
      </div>
      <span className="text-xs text-gray-500">Atalho: Alt+L</span>
    </div>
  );
}
