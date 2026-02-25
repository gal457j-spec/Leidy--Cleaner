"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sparkles, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ServiceRecommendation {
  serviceId: number;
  serviceName: string;
  category: string;
  score: number;
  reason: string;
}

export default function RecommendationsWidget() {
  const { user, isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState<ServiceRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadRecommendations();
    }
  }, [isAuthenticated, user]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/ai/recommendations/services', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.data.recommendations.slice(0, 3)); // Show top 3
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Recomendações Personalizadas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <div key={rec.serviceId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 text-sm">{rec.serviceName}</h3>
                <Badge variant="secondary" className="text-xs">
                  {rec.category}
                </Badge>
              </div>

              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{rec.reason}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-500">
                    Score: {rec.score.toFixed(1)}
                  </span>
                </div>

                <Link href={`/services/${rec.serviceId}`}>
                  <Button size="sm" variant="outline" className="text-xs">
                    Ver Detalhes
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={loadRecommendations}
            disabled={loading}
            className="text-purple-600 hover:text-purple-700"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            {loading ? 'Atualizando...' : 'Atualizar Recomendações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}