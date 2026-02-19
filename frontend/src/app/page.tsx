"use client";

import React, { useEffect, useState } from 'react';
import { apiClient, Service } from '../services/api';
import ServiceCard from '@/components/ServiceCard';
import ServiceFilter from '@/components/ServiceFilter';

export default function HomePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpts, setFilterOpts] = useState<{ category?: string; search?: string }>({});
  const [reviewStats, setReviewStats] = useState<Record<string, { avg: number; count: number }>>({});

  const load = async (opts: { category?: string; search?: string } = {}) => {
    setLoading(true);
    try {
      const res = await apiClient.getServices({ limit: 12, ...opts });
      setServices(res.services || []);
      try {
        const revs = await apiClient.getPublicReviews();
        const stats: Record<string, { avg: number; count: number }> = {};
        revs.forEach((r) => {
          if (!r.serviceId) return;
          if (!stats[r.serviceId]) {
            stats[r.serviceId] = { avg: r.rating, count: 1 };
          } else {
            const st = stats[r.serviceId];
            st.count += 1;
            st.avg = (st.avg * (st.count - 1) + r.rating) / st.count;
          }
        });
        setReviewStats(stats);
      } catch {
        // ignore
      }
    } catch (err) {
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <section className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-3">Limpeza Profissional que Você Merece</h1>
        <p className="text-lg">Serviços de limpeza para casa, escritório ou evento. Rápido, confiável e com qualidade garantida!</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-bold">Nossos Serviços</h2>
        <p className="text-gray-600">Escolha o serviço ideal e agende com facilidade:</p>
      </section>

      <section className="mb-4">
        <ServiceFilter onChange={(o) => { setFilterOpts(o); load(o); }} />
        <p>
          <a href="/services" className="text-blue-600 hover:underline">Ver todos os serviços</a>
        </p>
      </section>

      <section>
        {loading ? (
          <p>Carregando serviços...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <ServiceCard
                key={s.id}
                service={s}
                rating={reviewStats[s.id]?.avg}
                reviewCount={reviewStats[s.id]?.count}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
