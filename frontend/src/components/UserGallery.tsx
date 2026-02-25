"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, Calendar, MapPin, X, Image as ImageIcon, Grid3X3, List } from 'lucide-react';

interface UserPhoto {
  id: string;
  url: string;
  type: 'profile' | 'achievement' | 'service' | 'other';
  title: string;
  description?: string;
  date: Date;
  location?: string;
  likes?: number;
}

const UserGallery: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<UserPhoto | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('grid');

  // Dados simulados - em produção viriam da API
  const photos: UserPhoto[] = [
    {
      id: '1',
      url: '/images/user-photos/profile-1.jpg',
      type: 'profile',
      title: 'Foto do Perfil',
      description: 'Minha foto atual',
      date: new Date('2024-01-15'),
      likes: 12
    },
    {
      id: '2',
      url: '/images/user-photos/service-1.jpg',
      type: 'service',
      title: 'Limpeza Residencial',
      description: 'Serviço realizado em janeiro',
      date: new Date('2024-01-20'),
      location: 'São Paulo, SP',
      likes: 8
    },
    {
      id: '3',
      url: '/images/user-photos/achievement-1.jpg',
      type: 'achievement',
      title: 'Primeira Reserva',
      description: 'Conquista desbloqueada!',
      date: new Date('2024-01-10'),
      likes: 15
    },
    {
      id: '4',
      url: '/images/user-photos/service-2.jpg',
      type: 'service',
      title: 'Limpeza Comercial',
      description: 'Escritório reformado',
      date: new Date('2024-02-05'),
      location: 'Rio de Janeiro, RJ',
      likes: 6
    },
    {
      id: '5',
      url: '/images/user-photos/profile-2.jpg',
      type: 'profile',
      title: 'Foto Anterior',
      description: 'Foto antiga do perfil',
      date: new Date('2023-12-01'),
      likes: 4
    },
    {
      id: '6',
      url: '/images/user-photos/other-1.jpg',
      type: 'other',
      title: 'Momento Especial',
      description: 'Celebrando conquistas',
      date: new Date('2024-02-10'),
      likes: 20
    }
  ];

  const getTypeIcon = (type: UserPhoto['type']) => {
    switch (type) {
      case 'profile':
        return <Camera className="w-4 h-4" />;
      case 'achievement':
        return <Heart className="w-4 h-4" />;
      case 'service':
        return <Calendar className="w-4 h-4" />;
      default:
        return <ImageIcon className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: UserPhoto['type']) => {
    switch (type) {
      case 'profile':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400';
      case 'achievement':
        return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400';
      case 'service':
        return 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400';
    }
  };

  const getTypeLabel = (type: UserPhoto['type']) => {
    switch (type) {
      case 'profile':
        return 'Perfil';
      case 'achievement':
        return 'Conquista';
      case 'service':
        return 'Serviço';
      default:
        return 'Outro';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full mb-4">
          <ImageIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Minha Galeria</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Suas fotos, conquistas e momentos especiais em um só lugar
        </p>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Grid3X3 className="w-4 h-4 inline mr-2" />
            Grade
          </button>
          <button
            onClick={() => setViewMode('masonry')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'masonry'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            Lista
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <motion.div
        layout
        className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2'
        }`}
      >
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-800">
              <div className="aspect-square overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>

              {/* Overlay com informações */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(photo.type)}`}>
                      {getTypeIcon(photo.type)}
                      <span>{getTypeLabel(photo.type)}</span>
                    </div>
                    {photo.likes && (
                      <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Heart className="w-4 h-4 fill-current text-red-400" />
                        <span className="text-xs font-medium">{photo.likes}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-sm opacity-90 line-clamp-2 mb-2">{photo.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs opacity-75">
                    <span>{photo.date.toLocaleDateString('pt-BR')}</span>
                    {photo.location && (
                      <>
                        <span>•</span>
                        <span>{photo.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute top-3 left-3">
                <motion.div
                  className={`p-2 rounded-xl shadow-lg ${getTypeColor(photo.type)} backdrop-blur-sm bg-white/90 dark:bg-gray-800/90`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {getTypeIcon(photo.type)}
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal de visualização aprimorado */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-all duration-200 hover:scale-110"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="relative bg-gray-100 dark:bg-gray-800">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-auto max-h-[60vh] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getTypeColor(selectedPhoto.type)}`}>
                    {getTypeIcon(selectedPhoto.type)}
                    <span>{getTypeLabel(selectedPhoto.type)}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    {selectedPhoto.date.toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {selectedPhoto.title}
                </h3>

                {selectedPhoto.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                    {selectedPhoto.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-6">
                    {selectedPhoto.location && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">{selectedPhoto.location}</span>
                      </div>
                    )}
                    {selectedPhoto.likes && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Heart className="w-5 h-5 fill-current text-red-500" />
                        <span className="font-medium">{selectedPhoto.likes} curtidas</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserGallery;
