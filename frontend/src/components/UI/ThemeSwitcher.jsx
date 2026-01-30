import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme} className="px-3 py-1 rounded-md border border-gray-200 hover:bg-gray-100">
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
