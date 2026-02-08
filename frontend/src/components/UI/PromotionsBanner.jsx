import React, { useState } from 'react'

/**
 * Promotions Banner - Ofertas limitadas
 */
export default function PromotionsBanner() {
  const [selectedPromo, setSelectedPromo] = useState(0)
  const [copiedCode, setCopiedCode] = useState(false)

  const promotions = [
    {
      id: 1,
      title: '🎉 Primeiro Agendamento',
      desc: '20% de desconto',
      code: 'BEMVINDO20',
      details: 'Válido para novo cliente',
      timeLeft: '3 dias',
      icon: '🎁'
    },
    {
      id: 2,
      title: '📅 Programa Fidelidade',
      desc: 'Acumule pontos',
      code: 'FIEL10',
      details: '1 ponto por real gasto',
      timeLeft: 'Ilimitado',
      icon: '⭐'
    },
    {
      id: 3,
      title: '👥 Indique e Ganhe',
      desc: '10% cashback',
      code: 'REFERE10',
      details: 'Para você e sua indicação',
      timeLeft: 'Ilimitado',
      icon: '🤝'
    },
    {
      id: 4,
      title: '📱 App Only Deal',
      desc: '15% desconto',
      code: 'APPONLY15',
      details: 'Disponível apenas no app',
      timeLeft: '7 dias',
      icon: '📲'
    }
  ]

  const promo = promotions[selectedPromo]

  const copyCode = () => {
    try {
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(promo.code)
      } else {
        // fallback: select and copy from temporary textarea
        const ta = document.createElement('textarea')
        ta.value = promo.code
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    } catch (err) {
      // leave UI as-is, optionally show toast
    }
  }

  return (
    <div className="w-full py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 left-5 text-6xl">🎉</div>
            <div className="absolute bottom-5 right-5 text-6xl">💝</div>
          </div>

          <div className="relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left side - Info */}
              <div className="text-white">
                <div className="text-6xl mb-4">{promo.icon}</div>
                <h2 className="text-4xl font-bold mb-4">{promo.title}</h2>
                <p className="text-2xl mb-6 font-bold opacity-90">{promo.desc}</p>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/30">
                  <p className="text-sm opacity-80 mb-2">Código promocional:</p>
                  <div className="flex items-center gap-3">
                    <code className="text-2xl font-bold">{promo.code}</code>
                    <button
                      onClick={copyCode}
                      className="px-4 py-2 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 transition-all"
                    >
                      {copiedCode ? '✓ Copiado!' : '📋 Copiar'}
                    </button>
                  </div>
                </div>
                <p className="text-sm opacity-80 mb-4">ℹ️ {promo.details}</p>
                <p className="text-sm font-semibold">⏱️ Válido por: {promo.timeLeft}</p>
              </div>

              {/* Right side - Promo Cards */}
              <div className="space-y-3">
                <h3 className="text-white font-bold mb-4">Outras Promoções:</h3>
                {promotions.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPromo(idx)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      selectedPromo === idx
                        ? 'bg-white text-purple-600 shadow-lg scale-105'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{p.icon}</span>
                      <div>
                        <p className="font-bold">{p.title.split(' ')[0]} {p.title.split(' ')[1]}</p>
                        <p className="text-sm opacity-80">{p.code}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 text-center">
              <button className="px-10 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
                🚀 Agendar Agora com Desconto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
