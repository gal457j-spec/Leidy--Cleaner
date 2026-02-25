"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Palette, Check } from 'lucide-react';
import { useAdvancedTheme } from '../contexts/AdvancedThemeContext';

const ThemeSelector: React.FC = () => {
  const { currentTheme, availableThemes, setTheme } = useAdvancedTheme();

  // Evitar renderização durante SSR
  if (typeof window === 'undefined') {
    return <div className="animate-pulse h-32 bg-gray-200 rounded"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full mb-4">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Temas Disponíveis</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Escolha o tema que mais combina com seu estilo
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(availableThemes).map(([key, theme]) => (
          <motion.button
            key={key}
            onClick={() => setTheme(key)}
            className={`relative group p-6 rounded-xl border-2 transition-all duration-300 ${
              currentTheme === key
                ? 'border-primary shadow-lg scale-105'
                : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md'
            }`}
            whileHover={{ scale: currentTheme === key ? 1.05 : 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Theme Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {theme.name}
                </h3>
                {currentTheme === key && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>

              {/* Color Palette */}
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div
                    className="h-8 rounded-lg border border-gray-200 dark:border-gray-600"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div
                    className="h-8 rounded-lg border border-gray-200 dark:border-gray-600"
                    style={{ backgroundColor: theme.secondary }}
                  />
                  <div
                    className="h-8 rounded-lg border border-gray-200 dark:border-gray-600"
                    style={{ backgroundColor: theme.accent }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className="h-6 rounded border border-gray-200 dark:border-gray-600"
                    style={{ backgroundColor: theme.surface }}
                  />
                  <div
                    className="h-6 rounded border border-gray-200 dark:border-gray-600"
                    style={{ backgroundColor: theme.background }}
                  />
                </div>
              </div>

              {/* Sample Text */}
              <div
                className="p-3 rounded-lg text-left"
                style={{ backgroundColor: theme.surface, color: theme.text }}
              >
                <div
                  className="text-sm font-medium mb-1"
                  style={{ color: theme.text }}
                >
                  Texto de exemplo
                </div>
                <div
                  className="text-xs"
                  style={{ color: theme.textSecondary }}
                >
                  Como ficará sua interface
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;