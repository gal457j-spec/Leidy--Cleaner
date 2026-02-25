"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { Paintbrush, RotateCcw, Palette } from 'lucide-react';
import { useAdvancedTheme } from '../contexts/AdvancedThemeContext';

const ColorCustomizer: React.FC = () => {
  const { customTheme, updateCustomTheme, resetCustomTheme, getCurrentThemeConfig } = useAdvancedTheme();
  const [selectedColor, setSelectedColor] = useState<string>('primary');

  // Evitar renderização durante SSR
  if (typeof window === 'undefined') {
    return <div className="animate-pulse h-64 bg-gray-200 rounded"></div>;
  }

  const currentConfig = getCurrentThemeConfig();
  const colorOptions = [
    { key: 'primary', label: 'Cor Principal', value: currentConfig.primary },
    { key: 'secondary', label: 'Cor Secundária', value: currentConfig.secondary },
    { key: 'accent', label: 'Cor de Destaque', value: currentConfig.accent },
    { key: 'background', label: 'Fundo', value: currentConfig.background },
    { key: 'surface', label: 'Superfície', value: currentConfig.surface },
    { key: 'text', label: 'Texto', value: currentConfig.text },
    { key: 'border', label: 'Bordas', value: currentConfig.border }
  ];

  const handleColorChange = (color: string) => {
    updateCustomTheme({ [selectedColor]: color });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full mb-4">
          <Paintbrush className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Personalizar Cores</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Ajuste as cores para criar uma experiência única
        </p>
      </div>

      <div className="flex justify-end">
        <motion.button
          onClick={resetCustomTheme}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-4 h-4" />
          Resetar Cores
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Color Picker */}
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Seletor de Cor
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Clique para escolher uma nova cor
            </p>
          </div>

          <div className="flex justify-center">
            <HexColorPicker
              color={currentConfig[selectedColor as keyof typeof currentConfig] || '#10b981'}
              onChange={handleColorChange}
              className="w-full max-w-sm"
            />
          </div>

          <div className="flex items-center justify-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div
              className="w-8 h-8 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
              style={{ backgroundColor: currentConfig[selectedColor as keyof typeof currentConfig] }}
            />
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {colorOptions.find(opt => opt.key === selectedColor)?.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {currentConfig[selectedColor as keyof typeof currentConfig]}
              </div>
            </div>
          </div>
        </div>

        {/* Color Options */}
        <div className="space-y-6">
          <div className="text-center">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Elementos da Interface
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selecione o elemento para personalizar
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {colorOptions.map((option) => (
              <motion.button
                key={option.key}
                onClick={() => setSelectedColor(option.key)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                  selectedColor === option.key
                    ? 'border-primary shadow-lg bg-primary/5 scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                whileHover={{ scale: selectedColor === option.key ? 1.02 : 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-lg border-2 border-gray-300 dark:border-gray-600 shadow-sm"
                      style={{ backgroundColor: option.value }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {option.value}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Preview */}
      <div className="space-y-4">
        <div className="text-center">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Preview em Tempo Real
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Veja como ficará sua interface personalizada
          </p>
        </div>

        <motion.div
          className="p-6 rounded-xl border-2 shadow-lg"
          style={{
            backgroundColor: currentConfig.surface,
            borderColor: currentConfig.border,
            color: currentConfig.text
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-4">
            {/* Header Bar */}
            <div
              className="h-6 rounded-lg flex items-center px-3"
              style={{ backgroundColor: currentConfig.primary }}
            >
              <div className="w-3 h-3 bg-white/20 rounded-full mr-2"></div>
              <div className="w-16 h-2 bg-white/20 rounded"></div>
            </div>

            {/* Content Area */}
            <div className="space-y-3">
              <div
                className="h-4 rounded w-3/4"
                style={{ backgroundColor: currentConfig.secondary }}
              />
              <div
                className="h-3 rounded w-1/2"
                style={{ backgroundColor: currentConfig.accent }}
              />
              <div className="flex gap-2">
                <div
                  className="h-8 w-8 rounded-lg border"
                  style={{ backgroundColor: currentConfig.surface, borderColor: currentConfig.border }}
                />
                <div className="flex-1 space-y-2">
                  <div
                    className="h-2 rounded w-full"
                    style={{ backgroundColor: currentConfig.text + '20' }}
                  />
                  <div
                    className="h-2 rounded w-2/3"
                    style={{ backgroundColor: currentConfig.text + '10' }}
                  />
                </div>
              </div>
            </div>

            {/* Sample Text */}
            <div className="pt-4 border-t" style={{ borderColor: currentConfig.border }}>
              <p className="text-sm leading-relaxed">
                Esta é uma prévia de como sua interface ficará com as cores personalizadas.
                Você pode ajustar cada elemento individualmente para criar uma experiência única.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ColorCustomizer;
