"use client";

import React, { useEffect, useState } from 'react';
import { apiClient, Service } from '../../../services/api';
import { useRouter } from 'next/navigation';
import ReviewList from '@/components/ReviewList';

export default function ServiceDetail({ params }: { params: { id: string } }) {
  const [service, setService] = useState<Service | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const s = await apiClient.getServiceById(params.id);
        setService(s);
      try {
        const revs = await apiClient.getPublicReviews(params.id);
        setReviews(revs);
      } catch {
        // ignore
      }
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  if (loading) return <p>Carregando...</p>;
  if (!service) return <p>Serviço não encontrado</p>;

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{service.name}</h2>
      <p className="mb-4">{service.description}</p>
      <p className="font-semibold">Preço: R$ {service.basePrice}</p>
      <p className="text-sm text-gray-500 mb-4">Duração: {service.durationMinutes} minutos</p>
      {reviews.length > 0 && (
        <p className="mb-2">Avaliação média: {avgRating.toFixed(1)} ⭐ ({reviews.length} avaliações)</p>
      )}
      <button onClick={() => router.push(`/bookings/new?serviceId=${service.id}`)} className="bg-green-600 text-white px-4 py-2 rounded">Agendar</button>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Avaliações</h3>
        {reviews.length > 0 ? (
          <ReviewList reviews={reviews} />
        ) : (
          <p>Sem avaliações ainda.</p>
        )}
      </div>
    </div>
  );
}
