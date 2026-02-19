"use client";

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/services/api';

interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  scheduledDate: string;
  totalPrice: number;
  address?: string;
  notes?: string;
  status: string;
  staffId?: string;
  createdAt: string;
  updatedAt: string;
  serviceName?: string;
}

export default function BookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [staffUsers, setStaffUsers] = useState<{ id: string; name: string }[]>([]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.getAllBookings();
      setBookings(res.bookings || []);
      const staff = await apiClient.getUsersByRole('staff');
      setStaffUsers(staff.map(u => ({ id: u.id, name: u.name })));
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <p>Carregando bookings...</p>;
  }
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (bookings.length === 0) {
    return <p>Nenhum booking encontrado.</p>;
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Serviço</th>
            <th className="p-2 border">Usuário</th>
            <th className="p-2 border">Data agendada</th>
            <th className="p-2 border">Endereço</th>
            <th className="p-2 border">Preço</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Ações</th>
            <th className="p-2 border">Staff</th>
            <th className="p-2 border">Atualizar</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="hover:bg-gray-50">
              <td className="p-2 border text-xs">{b.id}</td>
              <td className="p-2 border">{b.serviceName || b.serviceId}</td>
              <td className="p-2 border text-xs">{b.userId}</td>
              <td className="p-2 border text-xs">{new Date(b.scheduledDate).toLocaleString()}</td>
              <td className="p-2 border">{b.address || '-'}</td>
              <td className="p-2 border">R$ {b.totalPrice.toFixed(2)}</td>
              <td className="p-2 border capitalize">
                {b.status}
              </td>
              <td className="p-2 border text-xs">
                <a href={`/bookings/${b.id}`} className="text-blue-600 hover:underline">ver</a>
              </td>
              <td className="p-2 border">
                <select
                  value={b.staffId || ''}
                  onChange={async (e) => {
                    try {
                      const staffId = e.target.value;
                      await apiClient.assignStaffToBooking(b.id, staffId);
                      load();
                    } catch (err) {
                      alert('Erro ao atribuir staff');
                    }
                  }}
                  className="border p-1 rounded"
                >
                  <option value="">--</option>
                  {staffUsers.map(s => (
                    <option key={s.id} value={s.id}>{s.name || s.id}</option>
                  ))}
                </select>
              </td>
              <td className="p-2 border text-xs">
                <select
                  value={b.status}
                  onChange={async (e) => {
                    try {
                      const newStatus = e.target.value;
                      await apiClient.client.put(`/bookings/${b.id}/status`, { status: newStatus });
                      load();
                    } catch (err) {
                      alert('Erro ao atualizar status');
                    }
                  }}
                  className="border p-1 rounded"
                >
                  <option value="pending">pending</option>
                  <option value="confirmed">confirmed</option>
                  <option value="completed">completed</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
