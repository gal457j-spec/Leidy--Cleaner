"use client";

import React, { useEffect, useState } from 'react';
import { apiClient, User } from '@/services/api';

export default function StaffProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [staff, setStaff] = useState<User | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      apiClient.getStaffById(id)
        .then(u => {
          setStaff(u);
          return u.id;
        })
        .then((sid) => {
          apiClient.getStaffRating(sid).then(setRating).catch(() => {});
          apiClient.getStaffReviews(sid).then(setReviews).catch(() => {});
        })
        .catch(err => setError(err.message || 'Erro ao carregar perfil'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!staff) return <p>Funcionário não encontrado.</p>;

  return (
    <div className="max-w-md mx-auto">
      <div className="flex flex-col items-center space-y-4">
        {staff.photoUrl && <img src={staff.photoUrl} alt={staff.name} className="w-24 h-24 rounded-full object-cover" />}
        <h1 className="text-2xl font-bold">{staff.name}</h1>
        {rating !== null && (
          <p className="text-yellow-600">Avaliação média: {rating.toFixed(1)} ⭐</p>
        )}
        {staff.bio && <p className="text-gray-700 text-center">{staff.bio}</p>}
        {staff.phone && <p>Contato: {staff.phone}</p>}
      </div>
      {reviews.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Avaliações do staff</h3>
          <ul className="space-y-2">
            {reviews.map(r => (
              <li key={r.id} className="border p-2 rounded">
                <p>Rating: {r.rating}</p>
                {r.comment && <p>{r.comment}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* availability could be fetched if needed */}
    </div>
  );
}
