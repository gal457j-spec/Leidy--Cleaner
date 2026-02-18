"use client";

import React, { useEffect, useState } from 'react';
import { apiClient, Service } from '../../../services/api';
import { useRouter } from 'next/navigation';

export default function ServiceDetail({ params }: { params: { id: string } }) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const s = await apiClient.getServiceById(params.id);
        setService(s);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  if (loading) return <p>Carregando...</p>;
  if (!service) return <p>Serviço não encontrado</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{service.name}</h2>
      <p className="mb-4">{service.description}</p>
      <p className="font-semibold">Preço: R$ {service.basePrice}</p>
      <p className="text-sm text-gray-500 mb-4">Duração: {service.durationMinutes} minutos</p>
      <button onClick={() => router.push(`/bookings/new?serviceId=${service.id}`)} className="bg-green-600 text-white px-4 py-2 rounded">Agendar</button>
    </div>
  );
}
