import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

export default function Servicos() {
  const services = [
    {
      id: 1,
      name: 'Limpeza Padrão',
      price: 80,
      icon: '🧹',
      description: 'Limpeza completa: varredura, aspiração, limpeza de pisos, panos, banheiro.',
      duration: '2-3 horas',
      features: ['Pisos', 'Vidros', 'Móveis', 'Banheiro'],
    },
    {
      id: 2,
      name: 'Limpeza Profunda',
      price: 120,
      icon: '✨',
      description: 'Faxina completa com desinfeção, limpeza de armários, desodorização.',
      duration: '4-5 horas',
      features: ['Tudo da Padrão', 'Desodorização', 'Desinfeção', 'Armários'],
    },
    {
      id: 3,
      name: 'Limpeza de Mudança',
      price: 150,
      icon: '📦',
      description: 'Limpeza completa antes/após mudança. Cada canto impecável.',
      duration: '6+ horas',
      features: ['Casa Vazia', 'Completa', 'Desinfeção Total'],
    },
    {
      id: 4,
      name: 'Limpeza de Vidros',
      price: 30,
      icon: '🪟',
      description: 'Limpeza profissional de vidros internos e externos.',
      duration: '1 hora',
      features: ['Vidros Internos', 'Espelhos', 'Sem Manchas'],
    },
    {
      id: 5,
      name: 'Limpeza de Refrigerador',
      price: 25,
      icon: '❄️',
      description: 'Higienização completa do interior e exterior do refrigerador.',
      duration: '1-2 horas',
      features: ['Interior', 'Exterior', 'Prateleiras'],
    },
    {
      id: 6,
      name: 'Limpeza de Forno',
      price: 40,
      icon: '🔥',
      description: 'Limpeza profunda de forno, micro-ondas e fogão.',
      duration: '1-2 horas',
      features: ['Forno', 'Fogão', 'Micro-ondas'],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-4">Nossos Serviços</h1>
        <p className="text-gray-600 mb-12 text-lg">
          Conheça todos os serviços de limpeza que oferecemos com preços transparentes e sem surpresas.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
                <div className="text-5xl mb-3">{service.icon}</div>
                <h3 className="text-2xl font-bold">{service.name}</h3>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">{service.description}</p>

                {/* Duration */}
                <div className="mb-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-600 font-semibold">
                    ⏱️ Duração: {service.duration}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <p className="font-semibold text-gray-700 mb-2">Inclui:</p>
                  <ul className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        ✓ {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price and Button */}
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-blue-600">
                    R$ {service.price.toFixed(2)}
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
                    Agendar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-blue-50 p-8 rounded-lg border-l-4 border-blue-600">
          <h3 className="text-2xl font-bold mb-4">💡 Serviços Personalizados</h3>
          <p className="text-gray-700 mb-4">
            Não encontrou o serviço que procura? Podemos criar um pacote personalizado de acordo com suas necessidades.
            Fale conosco para mais informações!
          </p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            Solicitar Orçamento Personalizado
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
