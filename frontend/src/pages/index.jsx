import React, { useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function Home() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100,
      once: true,
      easing: 'ease-out-cubic'
    })
  }, [])

  return (
    <>
      <Head>
        <title>Leidy Cleaner - Limpeza Profissional em Porto Alegre | Serviços Premium</title>
        <meta name="description" content="Limpeza profissional residencial e comercial em Porto Alegre. Serviços premium com profissionais verificados, produtos eco-friendly e garantia de satisfação." />
      </Head>

      <div className="min-h-screen flex flex-col bg-white pt-20">
        <Header />
        <main className="flex-grow container mx-auto max-w-6xl w-full px-4">

          {/* ========== HERO SECTION ========== */}
          <section className="py-20">
            <div className="text-center space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
                Limpeza Profissional em Porto Alegre
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                Serviços de limpeza residencial e comercial com profissionais verificados, produtos eco-friendly e garantia de satisfação
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Link href="/HourCheckout" className="px-8 py-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition text-center">
                  💰 Comprar Horas de Serviço
                </Link>
                <Link href="/agendar" className="px-8 py-4 border-2 border-green-600 text-green-600 font-bold rounded-lg hover:bg-green-50 transition text-center">
                  📅 Agendar Serviço
                </Link>
              </div>
            </div>
          </section>

          {/* ========== COMO FUNCIONA ========== */}
          <section className="py-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Como Funciona? 🔄</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { num: '1', title: 'Escolha o Serviço', desc: 'Limpeza residencial, comercial ou pós-obra' },
                { num: '2', title: 'Escolha a Data', desc: 'Selecione o dia e horário que funciona para você' },
                { num: '3', title: 'Confirme e Pague', desc: 'PIX ou cartão crédito - rápido e seguro' },
                { num: '4', title: 'Mantenha Limpo', desc: 'Nossas profissionais deixam tudo impecável' }
              ].map((step, i) => (
                <div key={i} className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
                  <div className="text-3xl font-bold text-green-600 mb-3">{step.num}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-700">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ========== SERVIÇOS ========== */}
          <section className="py-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Nossos Serviços 🧹</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '🏠', title: 'Limpeza Residencial', desc: 'Casas e apartamentos com cuidado minucioso' },
                { icon: '🏢', title: 'Limpeza Comercial', desc: 'Escritórios, lojas e estabelecimentos' },
                { icon: '🏗️', title: 'Limpeza Pós-Obra', desc: 'Após reformas, deixamos tudo impecável' },
                { icon: '🪟', title: 'Limpeza de Vidros', desc: 'Janelas e vidros com brilho cristalino' },
                { icon: '✨', title: 'Limpeza Profunda', desc: 'Higienização completa e produtiva' },
                { icon: '🛏️', title: 'Organização', desc: 'Otimizamos espaços para melhor aproveitamento' }
              ].map((service, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-700">{service.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ========== DIFERENCIAIS ========== */}
          <section className="py-20 bg-green-50 px-6 rounded-lg">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Por que Escolher a Gente? 💚</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { icon: '⏰', title: 'Flexibilidade', desc: 'Agendamento rápido e horários adaptados' },
                { icon: '💰', title: 'Preço Justo', desc: 'Sem surpresas, taxa transparente' },
                { icon: '✅', title: 'Profissional', desc: 'Equipe treinada e verificada' },
                { icon: '🌍', title: 'Eco-Friendly', desc: 'Produtos seguros para família e planeta' },
                { icon: '⭐', title: 'Qualidade', desc: 'Garantia de satisfação total' },
                { icon: '📱', title: 'Suporte', desc: 'Atendimento rápido via WhatsApp' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <p className="text-gray-700">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ========== FAQ ========== */}
          <section className="py-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">Dúvidas Frequentes ❓</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: 'Qual é o preço?', a: 'Depende do tipo de serviço e tamanho do imóvel. Faça um orçamento sem comprometimento.' },
                { q: 'Vocês cobrem qual região?', a: 'Atendemos Porto Alegre e região metropolitana. Consulte disponibilidade.' },
                { q: 'Quais produtos vocês usam?', a: 'Produtos eco-friendly, seguros para crianças e animais de estimação.' },
                { q: 'Como agendar?', a: 'Pelo site, WhatsApp (51) 98030-3740 ou ligando direto. Muito fácil!' },
                { q: 'Posso reagendar?', a: 'Sim! Com 24h de antecedência você pode alterar ou cancelar sem taxa.' }
              ].map((faq, i) => (
                <details key={i} className="group bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100">
                  <summary className="flex justify-between items-center font-bold text-gray-900">
                    {faq.q}
                    <span className="transition group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-3 text-gray-700">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* ========== DEPOIMENTOS ========== */}
          <section className="py-20">
            <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">O Que Clientes Dizem 💬</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Maria Silva', role: 'Executiva', text: '⭐⭐⭐⭐⭐ Excelente serviço! Minha casa ficou impecável.' },
                { name: 'João Santos', role: 'Empresário', text: '⭐⭐⭐⭐⭐ Profissionais atenciosas e de confiança. Super recomendo!' },
                { name: 'Ana Costa', role: 'Mãe de Família', text: '⭐⭐⭐⭐⭐ Qualidade excelente e preço justo. Voltam com regularidade!' }
              ].map((testimonial, i) => (
                <div key={i} className="bg-green-50 p-6 rounded-lg border-l-4 border-green-600">
                  <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                  <p className="font-bold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ========== CTA FINAL ========== */}
          <section className="py-16 bg-green-600 text-white rounded-lg text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pronto para uma Casa Limpa?</h2>
            <p className="text-lg mb-8 text-green-100">Agende seu serviço agora mesmo</p>
            <Link href="/HourCheckout" className="inline-block px-10 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-green-50 transition">
              💚 Comprar Horas de Serviço
            </Link>
          </section>

        </main>

        <Footer />
      </div>
    </>
  )
}
