import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { apiCall } from '../../config/api';

function CheckoutForm({ amount = 120.00 }) {
  const [method, setMethod] = useState('pix');
  const [processing, setProcessing] = useState(false);
  const { addToast } = useToast();

  const handlePay = async () => {
    setProcessing(true);
    try {
      const data = await apiCall('/api/payments/create', {
        method: 'POST',
        body: JSON.stringify({ amount, method })
      });
      addToast('Pagamento realizado (mock). ID: ' + (data.id || 'MOCK'), 'success');
    } catch (err) {
      addToast(err.message || 'Erro ao processar pagamento', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-3">Pagamento</h3>
      <p className="mb-4">Valor: <strong>R$ {amount.toFixed(2)}</strong></p>

      <div className="space-y-3 mb-4">
        <label className={`block p-3 border rounded ${method==='pix'?'border-blue-500 bg-blue-50':''}`}>
          <input type="radio" name="method" checked={method==='pix'} onChange={()=>setMethod('pix')} /> <span className="ml-2 font-semibold">PIX (QR)</span>
        </label>
        <label className={`block p-3 border rounded ${method==='card'?'border-blue-500 bg-blue-50':''}`}>
          <input type="radio" name="method" checked={method==='card'} onChange={()=>setMethod('card')} /> <span className="ml-2 font-semibold">Cartão de Crédito</span>
        </label>
        <label className={`block p-3 border rounded ${method==='boleto'?'border-blue-500 bg-blue-50':''}`}>
          <input type="radio" name="method" checked={method==='boleto'} onChange={()=>setMethod('boleto')} /> <span className="ml-2 font-semibold">Boleto</span>
        </label>
      </div>

      <div className="flex gap-2">
        <button onClick={handlePay} disabled={processing} className="px-4 py-2 bg-green-600 text-white rounded">{processing ? 'Processando...' : 'Pagar'}</button>
        <button onClick={()=>addToast('Pagamento cancelado', 'info')} className="px-4 py-2 bg-gray-200 rounded">Cancelar</button>
      </div>
    </div>
  );
}

export default CheckoutForm;
