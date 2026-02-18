"use client";

import React, { useState } from 'react';
import { apiClient } from '@/services/api';
import { Service } from '@/services/api';
import { validateService } from '@/utils/validators';

export default function ServiceForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Partial<Service> | null;
  onSaved?: (s: Service) => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<Partial<Service>>(
    initial || { name: '', description: '', basePrice: 0, durationMinutes: 60, category: '', isActive: true }
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (k: keyof Service, v: any) => {
    setForm((s) => ({ ...s, [k]: v }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const err = validateService(form);
    if (err) return setError(err);

    setLoading(true);
    try {
      if (form.id) {
        const updated = await apiClient.updateService(String(form.id), form as any);
        onSaved?.(updated);
      } else {
        const created = await apiClient.createService(form as any);
        onSaved?.(created);
        setForm({ name: '', description: '', basePrice: 0, durationMinutes: 60, category: '', isActive: true });
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar serviço');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="grid grid-cols-1 gap-2">
        <input value={form.name || ''} onChange={(e) => handleChange('name', e.target.value)} placeholder="Nome" className="border p-2 rounded" />
        <textarea value={form.description || ''} onChange={(e) => handleChange('description', e.target.value)} placeholder="Descrição" className="border p-2 rounded" />
        <div className="grid grid-cols-2 gap-2">
          <input type="number" value={String(form.basePrice || 0)} onChange={(e) => handleChange('basePrice', Number(e.target.value))} placeholder="Preço" className="border p-2 rounded" />
          <input type="number" value={String(form.durationMinutes || 60)} onChange={(e) => handleChange('durationMinutes', Number(e.target.value))} placeholder="Duração (min)" className="border p-2 rounded" />
        </div>
        <input value={form.category || ''} onChange={(e) => handleChange('category', e.target.value)} placeholder="Categoria" className="border p-2 rounded" />

        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" checked={!!form.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} />
            <span>Ativo</span>
          </label>
        </div>

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-3 py-1 rounded">{form.id ? 'Atualizar' : 'Criar'}</button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-3 py-1 border rounded">Cancelar</button>
          )}
        </div>
      </div>
    </form>
  );
}
