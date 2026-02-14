import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Fecha menu ao mudar de rota
  useEffect(() => {
    setIsOpen(false)
  }, [router.pathname])

  const menuItems = [
    { name: 'Como Funciona', href: '#como_funciona' },
    { name: 'Serviços', href: '#servicos' },
    { name: 'Galeria', href: '#galeria' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contato', href: '#contato' }
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-expanded="false"
      >
        <span className="sr-only">Abrir menu</span>
        {isOpen ? (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
          <div className="px-4 py-4 space-y-2">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-600 transition font-medium"
              >
                {item.name}
              </a>
            ))}

            {/* Divider */}
            <div className="border-t border-gray-200 my-2 pt-2">
              <Link
                href="/HourCheckout"
                onClick={() => setIsOpen(false)}
                className="block w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg hover:shadow-lg transition font-bold text-center"
              >
                Pagar Faxinha
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}
