import React from 'react';
import Link from 'next/link';
import { Service } from '../services/api';

export default function ServiceCard({
  service,
  rating,
  reviewCount,
}: {
  service: Service;
  rating?: number;
  reviewCount?: number;
}) {
  return (
    <div className="border rounded-lg p-4 shadow">
      <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
      <p className="text-gray-600 text-sm mb-3">{service.description}</p>
      {rating !== undefined && (
        <p className="text-sm text-yellow-600 mb-2">
          {rating.toFixed(1)} ⭐ ({reviewCount || 0})
        </p>
      )}
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
