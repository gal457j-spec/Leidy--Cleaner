"use client";

import React, { useEffect, useState } from 'react';
import { apiClient, Service } from '../services/api';
import ServiceCard from '@/components/ServiceCard';

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.getServices({ limit: 12 });
        setServices(res.services || []);
      } catch (err) {
        // console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <section className="mb-6">
        <h1 className="text-3xl font-bold">Serviços</h1>
        <p className="text-gray-600">Escolha entre nossos serviços profissionais.</p>
      </section>

      <section>
        {loading ? (
          <p>Carregando serviços...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
