import React, { useState } from "react";
import { MdAccessibilityNew } from "react-icons/md";
import AccessibilityPanel from "./AccessibilityPanel";

export default function AccessibilityButton() {
  const [open, setOpen] = useState(false);

  // Bottom left corner, following chatbot pattern
  return (
    <>
      <button
        className="fixed bottom-4 left-4 z-[9999] bg-white dark:bg-gray-800 shadow-xl rounded-full p-3 opacity-90 hover:opacity-100 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all duration-200 border border-gray-200 dark:border-gray-600"
        aria-label="Acessibilidade"
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && setOpen((v) => !v)}
        style={{ position: 'fixed', bottom: '1rem', left: '1rem' }}
        data-accessibility-panel="true"
      >
        <MdAccessibilityNew className="w-6 h-6 text-orange-600 dark:text-orange-400" />
      </button>
      {open && <AccessibilityPanel onClose={() => setOpen(false)} />}
    </>
  );
}
