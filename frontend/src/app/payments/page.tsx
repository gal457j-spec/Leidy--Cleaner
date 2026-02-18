import React from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function PaymentsPage() {
  return (
    <ProtectedRoute role="customer">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Pagamentos</h1>
        <p className="mb-4">Placeholder de pagamentos. Integre Stripe/PayPal aqui.</p>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-600">Nenhuma integração ativa.</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Simular pagamento</button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
"use client";

import React, { useState } from 'react';

export default function PaymentsPage() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Processando (placeholder)...');
    // Here you'd call backend to create payment intent and redirect to gateway
    setTimeout(() => setMessage('Pagamento (simulado) concluído.'), 900);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Pagamentos (placeholder)</h1>
      <form onSubmit={handlePay} className="space-y-3 bg-white p-4 rounded shadow">
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Valor (R$)" className="w-full border p-2 rounded" />
        <button className="bg-green-600 text-white px-4 py-2 rounded">Pagar (simulado)</button>
      </form>
      {message && <div className="mt-3 p-2 bg-blue-50 rounded">{message}</div>}
    </div>
  );
}
