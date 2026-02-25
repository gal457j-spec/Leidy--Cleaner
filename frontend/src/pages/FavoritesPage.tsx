"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, MapPin } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';
import FavoriteButton from '../components/FavoriteButton';

const FavoritesPage: React.FC = () => {
  const { favorites } = useFavorites();

  const services = favorites.filter(item => item.type === 'service');
  const staff = favorites.filter(item => item.type === 'staff');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Meus Favoritos
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Serviços e profissionais que você mais gosta
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Nenhum favorito ainda
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Adicione serviços e profissionais aos seus favoritos para encontrá-los mais facilmente
            </p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Serviços Favoritos */}
            {services.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Serviços Favoritos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={service.image || '/images/placeholder.jpg'}
                          alt={service.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.jpg';
                          }}
                        />
                        <div className="absolute top-4 right-4">
                          <FavoriteButton
                            item={service}
                            className="bg-white bg-opacity-80 hover:bg-opacity-100"
                          />
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {service.name}
                        </h3>
                        <div className="flex items-center mb-4">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="ml-1 text-gray-600 dark:text-gray-300">4.8</span>
                        </div>
                        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                          Agendar Serviço
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Profissionais Favoritos */}
            {staff.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Profissionais Favoritos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {staff.map((professional) => (
                    <motion.div
                      key={professional.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={professional.image || '/images/placeholder.jpg'}
                          alt={professional.name}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/placeholder.jpg';
                          }}
                        />
                        <div className="absolute top-4 right-4">
                          <FavoriteButton
                            item={professional}
                            className="bg-white bg-opacity-80 hover:bg-opacity-100"
                          />
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {professional.name}
                        </h3>
                        <div className="flex items-center mb-2">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="ml-1 text-gray-600 dark:text-gray-300">4.9</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">São Paulo, SP</span>
                        </div>
                        <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                          Ver Perfil
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;