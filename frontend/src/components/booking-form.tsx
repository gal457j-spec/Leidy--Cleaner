"use client";

import React, { useState } from 'react';
import CalendarPlaceholder from '@/components/CalendarPlaceholder';
import { apiClient } from '@/services/api';

interface BookingFormProps {
  serviceId: string;
  initialDate?: string;
  initialAddress?: string;
  initialNotes?: string;
  onSuccess?: (booking: any) => void;
}

export default function BookingForm({ serviceId, initialDate = '', initialAddress = '', initialNotes = '', onSuccess }: BookingFormProps) {
  const [date, setDate] = useState(initialDate);
  const [address, setAddress] = useState(initialAddress);
  const [notes, setNotes] = useState(initialNotes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const v = require('@/utils/validators');
      const err = v.validateBooking({ bookingDate: date, address, notes });
      if (err) {
        setError(err);
        setLoading(false);
        return;
      }
    } catch (_) {
      // ignore
    }

    try {
      const booking = await apiClient.createBooking({
        serviceId,
        bookingDate: date,
        address,
        notes,
      });
      if (onSuccess) onSuccess(booking);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {error && <div className="bg-red-100 text-red-800 p-2 mb-4">{error}</div>}
      <label className="block">Escolha uma data e horário</label>
      <CalendarPlaceholder value={date} onChange={setDate} />

      <label className="block">Endereço</label>
      <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded" />
      <label className="block">Notas</label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded" />
      <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">Agendar</button>
    </form>
  );
}
