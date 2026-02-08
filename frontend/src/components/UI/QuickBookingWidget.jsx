import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

/**
 * Quick Booking Widget - Agendamento rápido no topo
 */
export default function QuickBookingWidget() {
  const [formData, setFormData] = useState({
    serviceType: '',
    date: '',
    time: '',
    location: '',
    area: ''
  })
  const [loading, setLoading] = useState(false)

  const serviceOptions = [
    { id: 'residential', label: '🏠 Residencial', price: 'A partir de R$ 150' },
    { id: 'commercial', label: '🏢 Comercial', price: 'A partir de R$ 300' },
    { id: 'deepclean', label: '✨ Limpeza Profunda', price: 'A partir de R$ 200' },
    { id: 'poswork', label: '🔨 Pós-Obra', price: 'A partir de R$ 250' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Simular submissão
      setTimeout(() => {
        toast.success('Agendamento enviado! Entraremos em contato em breve.')
        setLoading(false)
      }, 1500)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-gradient-to-r from-purple-600/10 to-cyan-500/10 backdrop-blur-sm border border-purple-200/30 dark:border-purple-600/30 rounded-2xl p-8 shadow-lg">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">⚡</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Agendamento Rápido
          </h2>
          <span className="ml-auto text-sm text-purple-600 dark:text-purple-400 font-semibold">
            ✓ Confirmação instantânea
          </span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Serviço */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tipo de Serviço
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Selecione...</option>
              {serviceOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Horário */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Horário
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Área (m²) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Área (m²)
            </label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Ex: 100"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Botão Submit */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? '⏳...' : '📅 Agendar'}
            </button>
          </div>
        </form>

        {/* Info rápida */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>✓</span>
            <span>Sem taxas ocultas</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>✓</span>
            <span>Profissionais verificados</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>✓</span>
            <span>Garantia de satisfação</span>
          </div>
        </div>
      </div>
    </div>
  )
}
