"use client";

import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { apiClient, User } from '@/services/api';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getProfile()
      .then((u) => {
        setUser(u);
        setName(u.name);
        setPhone(u.phone || '');
      })
      .catch((e) => setError(e.message || 'Erro ao carregar perfil'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const updated = await apiClient.updateProfile({ name, phone });
      setUser(updated);
      setSuccess('Perfil atualizado com sucesso');
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar');
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Usuário não encontrado</p>;

  return (
    <ProtectedRoute>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>
        {success && <p className="mb-3 text-green-500">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-semibold">Email</label>
            <input id="email" type="email" value={user.email} disabled className="w-full border p-2 rounded bg-gray-100" />
          </div>
          <div>
            <label htmlFor="name" className="block font-semibold">Nome</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label htmlFor="phone" className="block font-semibold">Telefone</label>
            <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-2 rounded" />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Salvar</button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
