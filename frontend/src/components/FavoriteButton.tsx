"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import { useNotification } from '../contexts/NotificationContext';

interface FavoriteButtonProps {
  item: {
    id: string;
    type: 'service' | 'staff';
    name: string;
    image?: string;
  };
  className?: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ item, className = '' }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showSuccess, showInfo } = useNotification();
  const isFav = isFavorite(item.id);

  const handleToggle = () => {
    toggleFavorite(item);
    if (isFav) {
      showInfo(`${item.name} removido dos favoritos`);
    } else {
      showSuccess(`${item.name} adicionado aos favoritos`);
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      className={`p-2 rounded-full transition-colors ${className} ${
        isFav
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500'
      }`}
      aria-label={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <Heart
        className={`w-5 h-5 ${isFav ? 'fill-current' : ''}`}
      />
    </motion.button>
  );
};

export default FavoriteButton;