"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Star,
  Calendar,
  Users,
  Award,
  Target,
  Zap,
  Heart,
  CheckCircle,
  Crown,
  Lock
} from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
}

const achievements: Achievement[] = [
  {
    id: 'first_booking',
    title: 'Primeira Reserva',
    description: 'Fez sua primeira reserva de serviço',
    icon: Calendar,
    color: 'text-blue-500',
    unlocked: false
  },
  {
    id: 'five_bookings',
    title: 'Cliente Regular',
    description: 'Completou 5 reservas',
    icon: Star,
    color: 'text-yellow-500',
    unlocked: false,
    progress: 2,
    maxProgress: 5
  },
  {
    id: 'ten_reviews',
    title: 'Crítico Experiente',
    description: 'Deixou 10 avaliações',
    icon: Users,
    color: 'text-green-500',
    unlocked: false,
    progress: 3,
    maxProgress: 10
  },
  {
    id: 'loyal_customer',
    title: 'Cliente Fiel',
    description: 'Cliente há mais de 1 ano',
    icon: Heart,
    color: 'text-red-500',
    unlocked: false
  },
  {
    id: 'early_bird',
    title: 'Madrugador',
    description: 'Agendou serviço antes das 8h',
    icon: Zap,
    color: 'text-orange-500',
    unlocked: false
  },
  {
    id: 'perfectionist',
    title: 'Perfeccionista',
    description: 'Todas as avaliações foram 5 estrelas',
    icon: Crown,
    color: 'text-purple-500',
    unlocked: false
  },
  {
    id: 'referral_master',
    title: 'Mestre dos Indicações',
    description: 'Indicou 5 amigos que se cadastraram',
    icon: Target,
    color: 'text-indigo-500',
    unlocked: false,
    progress: 1,
    maxProgress: 5
  },
  {
    id: 'eco_warrior',
    title: 'Guerreiro Eco',
    description: 'Usou produtos ecológicos em 10 serviços',
    icon: Award,
    color: 'text-emerald-500',
    unlocked: false,
    progress: 4,
    maxProgress: 10
  }
];

interface AchievementCardProps {
  achievement: Achievement;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ achievement }) => {
  const { icon: Icon, title, description, color, unlocked, progress, maxProgress } = achievement;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative group p-6 rounded-xl border-2 transition-all duration-300 overflow-hidden ${
        unlocked
          ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary/50 hover:shadow-md'
      }`}
    >
      {/* Background Pattern for Unlocked */}
      {unlocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5 pointer-events-none" />
      )}

      <div className="relative z-10">
        <div className="flex items-start gap-4">
          <div className={`relative p-3 rounded-xl ${
            unlocked
              ? 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700'
          }`}>
            {unlocked ? (
              <Icon className={`w-7 h-7 ${color}`} />
            ) : (
              <Lock className="w-7 h-7 text-gray-400" />
            )}
            
            {unlocked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-1 -right-1"
              >
                <CheckCircle className="w-5 h-5 text-green-500 bg-white rounded-full" />
              </motion.div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-base mb-1 ${
              unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {title}
            </h3>
            <p className={`text-sm leading-relaxed ${
              unlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
            }`}>
              {description}
            </p>

            {progress !== undefined && maxProgress && !unlocked && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <span>Progresso</span>
                  <span className="font-medium">{progress}/{maxProgress}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress / maxProgress) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
                  </motion.div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {maxProgress - progress} restantes
                </div>
              </div>
            )}
          </div>
        </div>

        {unlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring" }}
            className="absolute top-4 right-4"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Trophy className="w-4 h-4 text-white" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const Achievements: React.FC = () => {
  // Simulando algumas conquistas desbloqueadas
  const userAchievements = achievements.map(achievement => ({
    ...achievement,
    unlocked: ['first_booking', 'five_bookings'].includes(achievement.id)
  }));

  const unlockedCount = userAchievements.filter(a => a.unlocked).length;
  const totalCount = userAchievements.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full mb-6">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Suas Conquistas</span>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative inline-block mb-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg"
          >
            {unlockedCount}
          </motion.div>
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Sistema de Conquistas
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Complete desafios e desbloqueie novas conquistas
        </p>

        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Progresso Geral</span>
            <span className="font-medium">{unlockedCount}/{totalCount}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-3 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
            </motion.div>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {Math.round(progressPercentage)}% concluído
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <AchievementCard achievement={achievement} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
