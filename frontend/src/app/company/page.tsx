"use client";

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/services/api';

export default function CompanyPage() {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.client.get('/company');
        setInfo(res.data.data || res.data);
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  if (!info) return <p>Carregando...</p>;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{info.name || 'Nossa Empresa'}</h1>
      <p className="mb-4">{info.description || info.about || 'Descrição da empresa em construção.'}</p>
      <div>
        <p><strong>Endereço:</strong> {info.address || '—'}</p>
        <p><strong>Telefone:</strong> {info.phone || '—'}</p>
        <p><strong>Email:</strong> {info.email || '—'}</p>
      </div>
    </div>
  );
}
