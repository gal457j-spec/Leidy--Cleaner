import React from 'react';
import NewBookingClient from './NewBookingClient';

export default function Page({ searchParams }: { searchParams?: { serviceId?: string } }) {
  const serviceId = searchParams?.serviceId || '';
  return <NewBookingClient serviceId={serviceId} />;
}

