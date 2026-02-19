"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../../services/api';
import BookingForm from '@/components/BookingForm';

export default function NewBookingClient({ serviceId }: { serviceId: string }) {
  const router = useRouter();

  const [service, setService] = useState<any | null>(null);

  // fetch service details
  React.useEffect(() => {
    if (serviceId) {
      apiClient.getServiceById(serviceId)
        .then((s) => setService(s))
        .catch(() => {});
    }
  }, [serviceId]);

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Novo Agendamento</h2>
      {service && (
        <div className="mb-4 p-3 border rounded bg-gray-50">
          <p className="font-semibold">Serviço: {service.name}</p>
          <p>Preço: R$ {service.basePrice.toFixed(2)}</p>
        </div>
      )}
      <BookingForm
        serviceId={serviceId}
        onSuccess={(b) => {
          router.push(`/payments?bookingId=${b.id}`);
        }}
      />
    </div>
  );
}
