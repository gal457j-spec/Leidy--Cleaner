"use client";

import React, { useEffect, useState } from 'react';
import { apiClient, Booking } from '../../services/api';
import BookingCard from '@/components/BookingCard';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await apiClient.getBookings();
      setBookings(res.bookings || []);
    } catch (err) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('Cancelar este agendamento?')) return;
    try {
      await apiClient.deleteBooking(id);
      await load();
    } catch (err: any) {
      alert(err.message || 'Erro ao cancelar');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Meus Agendamentos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-3">
          {bookings.length === 0 && <p>Nenhum agendamento encontrado.</p>}
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} onCancel={() => handleCancel(b.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
