"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Palette, Trophy, Camera, User, Sparkles } from 'lucide-react';
import ThemeSelector from '../components/ThemeSelector';
import ColorCustomizer from '../components/ColorCustomizer';
import Achievements from '../components/Achievements';
import PhotoUpload from '../components/PhotoUpload';
import UserGallery from '../components/UserGallery';

const tabs = [
  { id: 'themes', label: 'Temas', icon: Palette, description: 'Escolha seu estilo visual' },
  { id: 'colors', label: 'Cores', icon: Settings, description: 'Personalize as cores' },
  { id: 'achievements', label: 'Conquistas', icon: Trophy, description: 'Suas realizações' },
  { id: 'photo', label: 'Perfil', icon: User, description: 'Foto do perfil' },
  { id: 'gallery', label: 'Galeria', icon: Camera, description: 'Suas fotos' }
];

const PersonalizationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('themes');
  const [profilePhoto, setProfilePhoto] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Personalização</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Seu Espaço Único
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Personalize sua experiência e conquiste badges exclusivos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Personalizar
              </h2>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-primary/10 text-primary shadow-sm'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${isActive ? 'text-primary' : ''}`}>
                          {tab.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Content Header */}
              <div className="border-b border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3">
                  {tabs.find(tab => tab.id === activeTab) && (
                    <>
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, {
                          className: "w-6 h-6 text-primary"
                        })}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {tabs.find(tab => tab.id === activeTab)?.label}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                          {tabs.find(tab => tab.id === activeTab)?.description}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === 'themes' && <ThemeSelector />}
                    {activeTab === 'colors' && <ColorCustomizer />}
                    {activeTab === 'achievements' && <Achievements />}
                    {activeTab === 'photo' && (
                      <PhotoUpload
                        currentPhoto={profilePhoto}
                        onPhotoChange={setProfilePhoto}
                      />
                    )}
                    {activeTab === 'gallery' && <UserGallery />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Temas Disponíveis
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  8
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Conquistas
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ∞
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Combinações
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Personalizável
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PersonalizationPage;