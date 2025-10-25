"use client";

import { useTheme } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative flex items-center justify-center
        w-12 h-12 rounded-full
        bg-gradient-to-r from-purple-600 via-purple-700 to-teal-400
        text-white shadow-lg shadow-purple-800/40
        hover:shadow-teal-500/40
        hover:scale-110 active:scale-95
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-teal-400/60
      `}
      aria-label="Toggle dark mode"
    >
      <span
        className={`
          absolute inset-0 rounded-full bg-black/20 blur-sm opacity-40
        `}
      ></span>

      {/* Icon transition */}
      <div
        className="relative z-10 flex items-center justify-center transition-transform duration-500"
      >
        {theme === "dark" ? (
          <Sun size={22} className="text-yellow-300" />
        ) : (
          <Moon size={22} className="text-blue-300" />
        )}
      </div>
    </button>
  );
};

export default DarkModeToggle;
