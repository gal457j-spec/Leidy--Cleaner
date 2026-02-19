"use client";

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient, User } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface Booking {
  id: string;
  serviceName?: string;
  scheduledDate: string;
  address?: string;
  status: string;
  totalPrice: number;
}

export default function StaffBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // profile/edit state
  const [profile, setProfile] = useState<User | null>(null);
  const [editProfile, setEditProfile] = useState({ name: '', phone: '', bio: '', photoUrl: '' });
  const [availability, setAvailability] = useState<Array<{ id: string; day: string; startTime: string; endTime: string }>>([]);
  const [newSlot, setNewSlot] = useState({ day: '', startTime: '', endTime: '' });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.getStaffBookings();
      setBookings(res.bookings || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // load profile and availability once user is known
  useEffect(() => {
    if (user) {
      apiClient.getStaffById(user.id)
        .then(u => {
          setProfile(u);
          setEditProfile({ name: u.name, phone: u.phone || '', bio: u.bio || '', photoUrl: u.photoUrl || '' });
        });
      apiClient.getStaffAvailability(user.id).then(setAvailability).catch(() => {});
    }
  }, [user]);

  return (
    <ProtectedRoute role="staff">
      <div>
        <h2 className="text-2xl font-bold mb-4">Minhas atribuições</h2>
      {/* profile editing */}
      {profile && (
        <div className="mt-8 p-4 border rounded bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">Meu perfil</h3>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                const updated = await apiClient.updateStaffProfile(user!.id, editProfile);
                setProfile(updated);
                alert('Perfil atualizado');
              } catch (err: any) {
                alert(err.message || 'Erro ao atualizar');
              }
            }}
            className="space-y-2"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Nome</label>
              <input id="name" value={editProfile.name} onChange={e => setEditProfile({ ...editProfile, name: e.target.value })} className="mt-1 w-full border p-2 rounded" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium">Telefone</label>
              <input id="phone" value={editProfile.phone} onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })} className="mt-1 w-full border p-2 rounded" />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium">Bio</label>
              <textarea id="bio" value={editProfile.bio} onChange={e => setEditProfile({ ...editProfile, bio: e.target.value })} className="mt-1 w-full border p-2 rounded" />
            </div>
            <div>
              <label htmlFor="photo" className="block text-sm font-medium">URL da foto</label>
              <input id="photo" value={editProfile.photoUrl} onChange={e => setEditProfile({ ...editProfile, photoUrl: e.target.value })} className="mt-1 w-full border p-2 rounded" />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar perfil</button>
          </form>
        </div>
      )}
      {/* availability section */}
      {user && (
        <div className="mt-8 p-4 border rounded bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">Disponibilidade</h3>
          <ul className="mb-2">
            {availability.map(slot => (
              <li key={slot.id}>{slot.day} {slot.startTime}-{slot.endTime}</li>
            ))}
          </ul>
          <form
            onSubmit={async e => {
              e.preventDefault();
              const newArr = [...availability, { id: '', day: newSlot.day, startTime: newSlot.startTime, endTime: newSlot.endTime }];
              try {
                const updated = await apiClient.setStaffAvailability(user.id, newArr.map(s => ({ day: s.day, startTime: s.startTime, endTime: s.endTime })));
                setAvailability(updated);
                setNewSlot({ day: '', startTime: '', endTime: '' });
              } catch (err: any) {
                alert(err.message || 'Erro ao atualizar disponibilidade');
              }
            }}
            className="space-y-2"
          >
            <div className="flex space-x-2">
              <input placeholder="Dia" value={newSlot.day} onChange={e => setNewSlot({ ...newSlot, day: e.target.value })} className="border p-1 rounded" />
              <input placeholder="Início (HH:MM)" value={newSlot.startTime} onChange={e => setNewSlot({ ...newSlot, startTime: e.target.value })} className="border p-1 rounded" />
              <input placeholder="Fim (HH:MM)" value={newSlot.endTime} onChange={e => setNewSlot({ ...newSlot, endTime: e.target.value })} className="border p-1 rounded" />
            </div>
            <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">Adicionar</button>
          </form>
        </div>
      )}
        {loading && <p>Carregando...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && bookings.length === 0 && <p>Nenhuma tarefa atribuída.</p>}
        {!loading && bookings.length > 0 && (
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Serviço</th>
                <th className="p-2 border">Data</th>
                <th className="p-2 border">Endereço</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Preço</th>
                <th className="p-2 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{b.serviceName}</td>
                  <td className="p-2 border text-xs">{new Date(b.scheduledDate).toLocaleString()}</td>
                  <td className="p-2 border">{b.address || '-'}</td>
                  <td className="p-2 border capitalize">{b.status}</td>
                  <td className="p-2 border">R$ {b.totalPrice.toFixed(2)}</td>
                  <td className="p-2 border">
                    <a href={`/bookings/${b.id}`} className="text-blue-600 hover:underline">ver</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </ProtectedRoute>
  );
}
