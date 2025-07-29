import React, { useState } from "react";
import { MdAccessibilityNew } from "react-icons/md";
import AccessibilityPanel from "./AccessibilityPanel";

export default function AccessibilityButton() {
  const [open, setOpen] = useState(false);

  // Left side, vertically centered, responsive
  return (
    <>
      <button
        className="fixed top-24 left-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 opacity-80 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
        aria-label="Acessibilidade"
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && setOpen((v) => !v)}
      >
        <MdAccessibilityNew className="w-6 h-6 text-gray-700 dark:text-gray-200" />
      </button>
      {open && <AccessibilityPanel onClose={() => setOpen(false)} />}
    </>
  );
}
