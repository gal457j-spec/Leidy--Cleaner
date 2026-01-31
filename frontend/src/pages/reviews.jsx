import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import Reviews from '../components/Feedback/Reviews';

export default function ReviewsPage() {
  // demo serviceId
  const serviceId = 'service_001';
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Avaliações do Serviço</h1>
        <Reviews serviceId={serviceId} />
      </main>
      <Footer />
    </div>
  );
}
