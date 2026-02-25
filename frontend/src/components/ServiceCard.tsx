"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Service } from '../services/api';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import FavoriteButton from './FavoriteButton';
import { Star, Clock, Users, ArrowRight } from 'lucide-react';

export default function ServiceCard({
  service,
  rating,
  reviewCount,
}: {
  service: Service;
  rating?: number;
  reviewCount?: number;
}) {
  const [price, setPrice] = useState<{ basePrice: number; fee: number; total: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    const loadPrice = async () => {
      try {
        const { apiClient } = await import('../services/api');
        const res = await apiClient.getPriceEstimate(service.durationMinutes || 60);
        if (mounted) setPrice({ basePrice: res.basePrice, fee: res.fee, total: res.total });
      } catch (e) {
        // ignore
      }
    };
    loadPrice();
    return () => { mounted = false; };
  }, [service.durationMinutes]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl border-0 shadow-md bg-white dark:bg-gray-800">
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <FavoriteButton
              item={{
                id: service.id.toString(),
                type: 'service',
                name: service.name
              }}
              className="bg-white/90 dark:bg-gray-700/90 hover:bg-white dark:hover:bg-gray-700"
            />
          </div>
          <div className="absolute top-3 left-3">
            <div className="bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {rating ? rating.toFixed(1) : 'N/A'}
              </span>
              {reviewCount && (
                <span className="text-xs text-gray-600 dark:text-gray-300">({reviewCount})</span>
              )}
            </div>
          </div>
        </div>

      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
              {service.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{service.durationMinutes} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{service.category || 'Geral'}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">
                R$ {price ? price.total.toFixed(2) : (service.basePrice || 0).toFixed(2)}
              </span>
              <span className="text-xs text-gray-500">(incl. taxa)</span>
            </div>

            <Link href={`/services/${service.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="group/btn hover:bg-primary hover:text-white transition-all duration-200"
              >
                Ver Detalhes
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}
