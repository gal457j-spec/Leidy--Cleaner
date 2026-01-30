import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import PersonalizationPanel from '../components/UI/PersonalizationPanel'

export default function Home(){
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">Leidy Cleaner</h1>
            <p className="muted">Agende serviços de limpeza com facilidade. Personalize aparência e preferências.</p>
            <div className="mt-6">
              <a href="/agendar" className="btn-accent inline-block px-4 py-2 rounded-md">Agendar Agora</a>
            </div>
          </div>
          <div>
            <PersonalizationPanel />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
import React from 'react';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-6">Limpeza Profissional que Você Merece</h1>
              <p className="text-xl mb-8 text-blue-100">
                Agende agora e receba atendimento de qualidade em sua casa em poucos cliques. Simples, rápido e confiável.
              </p>
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition">
                Agendar Agora →
              </button>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-lg p-8 text-center text-blue-600">
                <p className="text-6xl mb-4">🏠</p>
                <p className="font-bold text-xl">Seu lar sempre impecável</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Nossos Serviços</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🧹', title: 'Limpeza Padrão', description: 'Limpeza completa e básica' },
              { icon: '✨', title: 'Limpeza Profunda', description: 'Faxina completa com desinfeção' },
              { icon: '📦', title: 'Mudança', description: 'Limpeza antes/depois de mudança' },
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before/After Gallery */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Antes e Depois</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array(4).fill(null).map((_, idx) => (
              <div key={idx} className="bg-gray-300 h-64 rounded-lg flex items-center justify-center">
                <span className="text-white text-6xl">📷</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12">Depoimentos de Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Maria Silva', text: 'Ótimo serviço! Deixaram minha casa impecável.' },
              { name: 'João Santos', text: 'Profissionais pontuais e atenciosos.' },
              { name: 'Ana Costa', text: 'Recomendo para todos os amigos!' },
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-lg text-gray-700 mb-4">"{testimonial.text}"</p>
                <p className="font-bold text-gray-900">- {testimonial.name}</p>
                <p className="text-yellow-400">⭐⭐⭐⭐⭐</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: 'Como agendar um serviço?', a: 'Clique em "Agendar Agora", selecione a data, serviço e pronto!' },
              { q: 'Qual é o preço mínimo?', a: 'Nosso serviço mínimo é R$ 80,00 para limpeza padrão.' },
              { q: 'Vocês aceitem pagamento online?', a: 'Sim! Aceitamos Stripe, Mercado Pago e PIX.' },
              { q: 'É possível remarcar?', a: 'Sim, pode remarcar com até 24h de antecedência.' },
            ].map((faq, idx) => (
              <details key={idx} className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100">
                <summary className="font-bold text-lg text-gray-900">{faq.q}</summary>
                <p className="text-gray-700 mt-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
