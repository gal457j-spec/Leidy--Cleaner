"use client";

import React, { useEffect, useState } from 'react';
import { apiClient, Review } from '@/services/api';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await apiClient.client.get('/reviews/admin/all');
      setReviews(res.data.data.reviews);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    try {
      await apiClient.client.put(`/reviews/admin/${id}/approve`);
      load();
    } catch {
      alert('Erro ao aprovar');
    }
  };

  const del = async (id: string) => {
    if (!window.confirm('Deseja deletar esta avaliação?')) return;
    try {
      await apiClient.client.delete(`/reviews/admin/${id}`);
      load();
    } catch {
      alert('Erro ao deletar');
    }
  };

  if (loading) return <p>Carregando avaliações...</p>;

  return (
    <ProtectedRoute role="admin">
      <div>
        <h2 className="text-2xl font-bold mb-4">Avaliações</h2>
        {reviews.length === 0 ? (
          <p>Nenhuma avaliação encontrada.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border p-3 rounded">
                <p className="font-semibold">{r.serviceName || r.serviceId} — {r.rating} ⭐</p>
                {r.comment && <p>{r.comment}</p>}
                <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
                <div className="mt-2 space-x-2">
                  {!r.isApproved && (
                    <button onClick={() => approve(r.id)} className="bg-green-600 text-white px-3 py-1 rounded">Aprovar</button>
                  )}
                  <button onClick={() => del(r.id)} className="bg-red-500 text-white px-3 py-1 rounded">Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
