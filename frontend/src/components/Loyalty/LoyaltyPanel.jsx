import React, { useEffect, useState } from 'react';

function LoyaltyPanel() {
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('loyalty_points') || '0', 10);
    setPoints(stored);
  }, []);

  const earn = (n) => {
    const next = points + n;
    localStorage.setItem('loyalty_points', next);
    setPoints(next);
  };

  const redeem = (n) => {
    if (points < n) return alert('Pontos insuficientes');
    const next = points - n;
    localStorage.setItem('loyalty_points', next);
    setPoints(next);
    alert('Cupom aplicado: R$ ' + (n/10).toFixed(2));
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-2">Programa de Fidelidade</h3>
      <p className="mb-2">Pontos acumulados: <strong>{points}</strong></p>
      <div className="flex gap-2">
        <button onClick={()=>earn(10)} className="px-3 py-2 bg-blue-600 text-white rounded">Ganhar 10 pts</button>
        <button onClick={()=>redeem(50)} className="px-3 py-2 bg-green-600 text-white rounded">Resgatar 50 pts</button>
      </div>
      <p className="text-sm text-gray-500 mt-2">1 ponto = R$0.10 (exemplo)</p>
    </div>
  );
}

export default LoyaltyPanel;
