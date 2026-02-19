"use client";

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/services/api';
import CalendarPlaceholder from './CalendarPlaceholder';
import { validateBooking } from '@/utils/validators';

export default function BookingForm({
  serviceId,
  initialDate = '',
  initialAddress = '',
  initialNotes = '',
  onSuccess,
}: {
  serviceId: string;
  initialDate?: string;
  initialAddress?: string;
  initialNotes?: string;
  onSuccess: (booking: any) => void;
}) {
  const [date, setDate] = useState(initialDate);
  const [address, setAddress] = useState(initialAddress);
  const [notes, setNotes] = useState(initialNotes);

  // if parent updates initial values we should keep in sync
  useEffect(() => {
    if (initialDate !== undefined) setDate(initialDate);
  }, [initialDate]);
  useEffect(() => {
    if (initialAddress !== undefined) setAddress(initialAddress);
  }, [initialAddress]);
  useEffect(() => {
    if (initialNotes !== undefined) setNotes(initialNotes);
  }, [initialNotes]);
  const [service, setService] = useState<any | null>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // id used for accessibility linking
  const dateInputId = 'booking-date';

  useEffect(() => {
    if (serviceId) {
      apiClient
        .getServiceById(serviceId)
        .then((s) => setService(s))
        .catch(() => {});
    }
    // fetch staff list for optional assignment
    apiClient.getStaffList().then(setStaffList).catch(() => {});
  }, [serviceId]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const err = validateBooking({ bookingDate: date, address, notes });
    if (err) return setError(err);

    setLoading(true);
    try {
      const booking = await apiClient.createBooking({
        serviceId,
        bookingDate: date,
        address,
        notes,
        staffId: selectedStaff || undefined,
      });
      onSuccess(booking);
    } catch (err: any) {
      setError(err.message || 'Erro ao criar booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Novo Agendamento</h2>
      {service && (
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <p className="font-semibold">Serviço: {service.name}</p>
          <p>Preço: R$ {service.basePrice.toFixed(2)}</p>
        </div>
      )}
      {error && <div className="bg-red-100 text-red-800 p-2 mb-4">{error}</div>}
      <form onSubmit={submit} className="space-y-3">
        <label htmlFor={dateInputId} className="block">
          Escolha uma data e horário
        </label>
        <CalendarPlaceholder id={dateInputId} value={date} onChange={setDate} />

        <label htmlFor="booking-address" className="block">Endereço</label>
        <input
          id="booking-address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <label htmlFor="booking-notes" className="block">Notas</label>
        <textarea
          id="booking-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 border rounded"
        />
        {staffList.length > 0 && (
          <div>
            <label className="block">Escolher staff (opcional)</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedStaff}
              onChange={e => setSelectedStaff(e.target.value)}
            >
              <option value="">Nenhum</option>
              {staffList.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.rating != null ? ` (${s.rating.toFixed(1)}⭐)` : ''}
                </option>
              ))}
            </select>
          </div>
        )}
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">Agendar</button>
      </form>
    </div>
  );
}
