export const dynamic = 'force-dynamic';

import React from 'react';
import ClientPayments from './ClientPayments';

export default function PaymentsPage() {
  return (
    <React.Suspense fallback={<div />}> 
      <ClientPayments />
    </React.Suspense>
  );

}
