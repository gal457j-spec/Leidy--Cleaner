"use client";

import React from 'react';
import { Booking } from '@/services/api';

export default function BookingCard({
  booking,
  onCancel,
}: {
  booking: Booking;
  onCancel?: () => void;
}) {
  return (
    <div className="border p-3 rounded mb-2">
      <p className="font-semibold">Serviço: {booking.serviceName || booking.serviceId}</p>
      <p>Data: {new Date(booking.scheduledDate).toLocaleString()}</p>
      {booking.address && <p>Endereço: {booking.address}</p>}
      <p>Status: {booking.status}</p>
      <p>Preço: R$ {booking.totalPrice.toFixed(2)}</p>
      {onCancel && booking.status === 'pending' && (
        <button
          onClick={onCancel}
          className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
        >
          Cancelar
        </button>
      )}
    </div>
  );
}