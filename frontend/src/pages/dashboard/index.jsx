import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import ClientDashboard from '../components/Dashboard/ClientDashboard';

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Meu Dashboard</h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Editar Perfil
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
              Sair
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-semibold">
            Agendamentos
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
            Histórico
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
            Avaliações
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-blue-600">
            Pagamentos
          </button>
        </div>

        {/* Dashboard Content */}
        <ClientDashboard userId="123" />
      </main>

      <Footer />
    </div>
  );
}
