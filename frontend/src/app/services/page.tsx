"use client";

import React, { useEffect, useState } from 'react';
import { apiClient, Service } from '../../services/api';
import ServiceCard from '@/components/ServiceCard';
import ServiceFilter from '@/components/ServiceFilter';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState<Record<string, { avg: number; count: number }>>({});

  const load = async (opts: { category?: string; search?: string } = {}) => {
    setLoading(true);
    try {
      const res = await apiClient.getServices({ limit: 50, ...opts });
      setServices(res.services || []);

      // calculate review stats
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
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Todos os Serviços</h2>
      <ServiceFilter onChange={(o) => load(o)} />
      {loading ? (
        <p>Carregando serviços...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.length === 0 && <p>Nenhum serviço encontrado.</p>}
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
    </div>
  );
}
