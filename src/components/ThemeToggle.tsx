import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle relative min-w-[44px] min-h-[44px] p-2.5 rounded-xl transition-all duration-200 border cursor-pointer select-none touch-manipulation focus:outline-none focus:ring-2 focus:ring-teal-500/50 active:scale-95 ${
        isDark
          ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700 hover:border-amber-400/40 shadow-sm'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-teal-600 shadow-sm'
      } ${className}`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle dark mode theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center mx-auto pointer-events-none">
        {isDark ? (
          <Sun className="w-5 h-5 text-amber-400 transition-transform duration-200 rotate-0 scale-100" />
        ) : (
          <Moon className="w-5 h-5 text-slate-700 transition-transform duration-200 rotate-0 scale-100" />
        )}
      </div>
    </button>
  );
};
