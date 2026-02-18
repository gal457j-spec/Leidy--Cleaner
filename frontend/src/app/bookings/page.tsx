"use client";

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.client.get('/bookings');
        setBookings(res.data.data.bookings || []);
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Meus Agendamentos</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="space-y-3">
          {bookings.length === 0 && <p>Nenhum agendamento encontrado.</p>}
          {bookings.map((b) => (
            <div key={b.id} className="border p-3 rounded">
              <p className="font-semibold">Serviço: {b.service_name || b.service_id}</p>
              <p>Data: {new Date(b.scheduled_date).toLocaleString()}</p>
              <p>Status: {b.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
