import React from 'react';
import Link from 'next/link';
import { Service } from '../services/api';

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="border rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{service.description}</p>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xl font-bold">R$ {service.basePrice}</p>
          <p className="text-xs text-gray-500">{service.durationMinutes} min</p>
        </div>
        <Link href={`/services/${service.id}`} className="bg-blue-600 text-white px-4 py-2 rounded">Detalhes</Link>
      </div>
    </div>
  );
}
