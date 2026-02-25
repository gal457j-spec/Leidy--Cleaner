"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular'
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded',
    circular: 'rounded-full'
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    />
  );
};

export const ServiceCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
  >
    <Skeleton className="w-full h-48" />
    <div className="p-6 space-y-3">
      <Skeleton variant="text" className="h-6 w-3/4" />
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-2/3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton variant="text" className="h-5 w-16" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  </motion.div>
);

export const StaffCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
  >
    <Skeleton className="w-full h-48" />
    <div className="p-6 space-y-3">
      <Skeleton variant="text" className="h-6 w-2/3" />
      <div className="flex items-center space-x-2">
        <Skeleton variant="circular" className="w-4 h-4" />
        <Skeleton variant="text" className="h-4 w-16" />
      </div>
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-3/4" />
      <Skeleton className="h-10 w-full rounded mt-4" />
    </div>
  </motion.div>
);

export const BookingCardSkeleton: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <Skeleton variant="text" className="h-5 w-32" />
        <Skeleton variant="text" className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-3/4" />
    </div>
    <div className="flex justify-between items-center mt-4">
      <Skeleton variant="text" className="h-4 w-20" />
      <Skeleton className="h-8 w-24 rounded" />
    </div>
  </motion.div>
);

export default Skeleton;