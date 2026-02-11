import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Leidy Cleaner - Limpeza Profissional em Porto Alegre</title>
        <meta name="description" content="Serviços de limpeza profissional" />
      </Head>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#fff' }}>
        <Header />

        <main style={{ flex: 1, paddingTop: '80px' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

            {/* HERO */}
            <section style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h1 style={{ fontSize: '48px', fontWeight: '700', color: '#000', marginBottom: '20px' }}>
                Limpeza Profissional em Porto Alegre
              </h1>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
                Serviços de limpeza com profissionais verificados
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/HourCheckout">
                  <button style={{
                    padding: '14px 28px',
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}>
                    💰 Comprar Horas
                  </button>
                </Link>
                <Link href="/agendar">
                  <button style={{
                    padding: '14px 28px',
                    backgroundColor: '#fff',
                    color: '#16a34a',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: '2px solid #16a34a',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}>
                    📅 Agendar
                  </button>
                </Link>
              </div>
            </section>

            {/* COMO FUNCIONA */}
            <section style={{ marginBottom: '60px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '40px', color: '#000' }}>
                Como Funciona
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {['Escolher', 'Agendar', 'Pagar', 'Pronto'].map((step, i) => (
                  <div key={i} style={{
                    padding: '30px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#16a34a', marginBottom: '10px' }}>
                      {i + 1}
                    </div>
                    <p style={{ fontWeight: '600', color: '#000' }}>{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* SERVIÇOS */}
            <section style={{ marginBottom: '60px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '40px', color: '#000' }}>
                Nossos Serviços
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                {[
                  { icon: '🏠', name: 'Residencial' },
                  { icon: '🏢', name: 'Comercial' },
                  { icon: '✨', name: 'Profunda' },
                  { icon: '🪟', name: 'Vidros' },
                  { icon: '🧽', name: 'Tapetes' },
                  { icon: '🌳', name: 'Áreas Externas' }
                ].map((svc, i) => (
                  <div key={i} style={{
                    padding: '25px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>{svc.icon}</div>
                    <p style={{ fontWeight: '600', color: '#000' }}>{svc.name}</p>
                    <p style={{ fontSize: '14px', color: '#16a34a', marginTop: '8px' }}>R$ 40/h</p>
                  </div>
                ))}
              </div>
            </section>

            {/* DIFERENCIAIS */}
            <section style={{ marginBottom: '60px', backgroundColor: '#f0fdf4', padding: '40px', borderRadius: '6px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', marginBottom: '40px', color: '#000' }}>
                Por Que Nos Escolher
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                {['✅ Profissionais Verificados', '✅ Eco-Friendly', '✅ Garantia 100%', '✅ Preços Justos', '✅ Flexível', '✅ Suporte'].map((item, i) => (
                  <p key={i} style={{ fontWeight: '600', color: '#000', fontSize: '15px' }}>{item}</p>
                ))}
              </div>
            </section>

            {/* CTA FINAL */}
            <section style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '15px', color: '#000' }}>
                Pronto para uma casa limpa?
              </h2>
              <Link href="/agendar">
                <button style={{
                  padding: '16px 36px',
                  backgroundColor: '#16a34a',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}>
                  Agendar Agora →
                </button>
              </Link>
            </section>

          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
