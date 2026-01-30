import React, { useState, useEffect } from 'react';

export const ClientDashboard = ({ userId }) => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalSpent: 0,
    nextBooking: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const mockData = {
      totalServices: 12,
      totalSpent: 1250.50,
      nextBooking: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      bookings: [
        {
          id: 1,
          date: new Date(),
          service: 'Limpeza Padrão',
          address: 'Rua A, 123',
          status: 'completed',
          price: 80,
        },
        {
          id: 2,
          date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          service: 'Limpeza Profunda',
          address: 'Rua B, 456',
          status: 'scheduled',
          price: 120,
        },
      ],
    };

    setStats({
      totalServices: mockData.totalServices,
      totalSpent: mockData.totalSpent,
      nextBooking: mockData.nextBooking,
    });
    setBookings(mockData.bookings);
    setLoading(false);
  }, [userId]);

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="p-6 text-center">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-gray-600 font-semibold">Total de Serviços</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalServices}</p>
        </div>
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <p className="text-gray-600 font-semibold">Total Gasto</p>
          <p className="text-3xl font-bold text-green-600 mt-2">R$ {stats.totalSpent.toFixed(2)}</p>
        </div>
        <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-gray-600 font-semibold">Próximo Agendamento</p>
          <p className="text-lg font-bold text-purple-600 mt-2">
            {stats.nextBooking?.toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      {/* Bookings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Agendamentos</h3>
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-bold">{booking.service}</p>
                <p className="text-sm text-gray-600">{booking.address}</p>
                <p className="text-sm text-gray-600">{booking.date.toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">R$ {booking.price.toFixed(2)}</p>
                <span className={`text-sm font-semibold px-3 py-1 rounded ${getStatusBadge(booking.status)}`}>
                  {booking.status === 'scheduled' ? 'Agendado' : 'Concluído'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
