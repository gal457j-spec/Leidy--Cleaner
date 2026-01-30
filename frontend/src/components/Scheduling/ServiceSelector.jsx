import React, { useState } from 'react';

export const ServiceSelector = ({ onServiceSelected, services = [] }) => {
  const [selectedServices, setSelectedServices] = useState([]);

  const defaultServices = [
    { id: 1, name: 'Limpeza Padrão', price: 80, icon: '🧹' },
    { id: 2, name: 'Limpeza Profunda', price: 120, icon: '✨' },
    { id: 3, name: 'Mudança (In/Out)', price: 150, icon: '📦' },
    { id: 4, name: 'Limpeza de Vidros', price: 30, icon: '🪟' },
    { id: 5, name: 'Limpeza de Refrigerador', price: 25, icon: '❄️' },
    { id: 6, name: 'Limpeza de Forno', price: 40, icon: '🔥' },
  ];

  const serviceList = services.length > 0 ? services : defaultServices;

  const handleServiceToggle = (service) => {
    const updated = selectedServices.some(s => s.id === service.id)
      ? selectedServices.filter(s => s.id !== service.id)
      : [...selectedServices, service];
    
    setSelectedServices(updated);
    onServiceSelected(updated);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-6">Selecione os Serviços</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {serviceList.map((service) => (
          <button
            key={service.id}
            onClick={() => handleServiceToggle(service)}
            className={`p-4 rounded-lg border-2 transition text-left ${
              selectedServices.some(s => s.id === service.id)
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 bg-white hover:border-blue-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-lg">{service.icon} {service.name}</p>
                <p className="text-gray-600 text-sm mt-1">R$ {service.price.toFixed(2)}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedServices.some(s => s.id === service.id)
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300'
              }`}>
                {selectedServices.some(s => s.id === service.id) && (
                  <span className="text-white text-sm">✓</span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedServices.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <p className="font-semibold text-blue-900">Serviços selecionados:</p>
          <ul className="mt-2 space-y-1">
            {selectedServices.map((service) => (
              <li key={service.id} className="text-blue-800 text-sm">
                • {service.name} - R$ {service.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ServiceSelector;
