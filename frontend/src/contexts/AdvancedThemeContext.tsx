"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ThemeConfig {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

const predefinedThemes: Record<string, ThemeConfig> = {
  default: {
    name: 'Padrão',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#3b82f6',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  ocean: {
    name: 'Oceano',
    primary: '#0ea5e9',
    secondary: '#0284c7',
    accent: '#06b6d4',
    background: '#f0f9ff',
    surface: '#ffffff',
    text: '#0c4a6e',
    textSecondary: '#64748b',
    border: '#bae6fd',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  sunset: {
    name: 'Pôr do Sol',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#f59e0b',
    background: '#fff7ed',
    surface: '#ffffff',
    text: '#9a3412',
    textSecondary: '#64748b',
    border: '#fed7aa',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  forest: {
    name: 'Floresta',
    primary: '#22c55e',
    secondary: '#16a34a',
    accent: '#84cc16',
    background: '#f0fdf4',
    surface: '#ffffff',
    text: '#14532d',
    textSecondary: '#64748b',
    border: '#bbf7d0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  purple: {
    name: 'Roxo',
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#c084fc',
    background: '#faf5ff',
    surface: '#ffffff',
    text: '#581c87',
    textSecondary: '#64748b',
    border: '#d8b4fe',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  rose: {
    name: 'Rosa',
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#f97316',
    background: '#fdf2f8',
    surface: '#ffffff',
    text: '#831843',
    textSecondary: '#64748b',
    border: '#f9a8d4',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  dark: {
    name: 'Escuro',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#3b82f6',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: '#334155',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  }
};

interface AdvancedThemeContextType {
  currentTheme: string;
  customTheme: Partial<ThemeConfig>;
  availableThemes: Record<string, ThemeConfig>;
  setTheme: (themeName: string) => void;
  updateCustomTheme: (updates: Partial<ThemeConfig>) => void;
  resetCustomTheme: () => void;
  getCurrentThemeConfig: () => ThemeConfig;
}

const AdvancedThemeContext = createContext<AdvancedThemeContextType | undefined>(undefined);

export const AdvancedThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [customTheme, setCustomTheme] = useState<Partial<ThemeConfig>>({});

  useEffect(() => {
    const saved = localStorage.getItem('advanced-theme');
    if (saved) {
      const { theme, custom } = JSON.parse(saved);
      setCurrentTheme(theme);
      setCustomTheme(custom || {});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('advanced-theme', JSON.stringify({ theme: currentTheme, custom: customTheme }));
    applyTheme();
  }, [currentTheme, customTheme]);

  const applyTheme = () => {
    const config = getCurrentThemeConfig();
    const root = document.documentElement;

    Object.entries(config).forEach(([key, value]) => {
      if (key !== 'name') {
        root.style.setProperty(`--color-${key}`, value);
      }
    });
  };

  const setTheme = (themeName: string) => {
    setCurrentTheme(themeName);
  };

  const updateCustomTheme = (updates: Partial<ThemeConfig>) => {
    setCustomTheme(prev => ({ ...prev, ...updates }));
  };

  const resetCustomTheme = () => {
    setCustomTheme({});
  };

  const getCurrentThemeConfig = (): ThemeConfig => {
    const baseTheme = predefinedThemes[currentTheme] || predefinedThemes.default;
    return { ...baseTheme, ...customTheme };
  };

  return (
    <AdvancedThemeContext.Provider value={{
      currentTheme,
      customTheme,
      availableThemes: predefinedThemes,
      setTheme,
      updateCustomTheme,
      resetCustomTheme,
      getCurrentThemeConfig
    }}>
      {children}
    </AdvancedThemeContext.Provider>
  );
};

export const useAdvancedTheme = () => {
  const context = useContext(AdvancedThemeContext);
  if (!context) {
    // Retornar valores padrão durante SSR
    if (typeof window === 'undefined') {
      return {
        currentTheme: 'default',
        customTheme: {},
        availableThemes: predefinedThemes,
        setTheme: () => {},
        updateCustomTheme: () => {},
        resetCustomTheme: () => {},
        getCurrentThemeConfig: () => predefinedThemes.default
      };
    }
    throw new Error('useAdvancedTheme must be used within an AdvancedThemeProvider');
  }
  return context;
};