import React, { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ThemeContext } from '../../../context/ThemeContext'

export default function MobileBottomNav() {
  const router = useRouter()
  const { cycleTheme, themeConfig } = useContext(ThemeContext)

  const isActive = (path) => router.pathname === path

  return (
    <nav className="mobile-only fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom-padding z-40 shadow-lg">
      <div className="max-w-4xl mx-auto grid grid-cols-4 gap-0">
        <Link href="/">
          <div className={`py-3 flex flex-col items-center justify-center text-sm transition-colors ${
            isActive('/') ? 'text-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l9-9 9 9v7a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4H9v4a2 2 0 0 1-2 2H3v-7z" />
            </svg>
            <span className="mt-1">Início</span>
          </div>
        </Link>

        <Link href="/servicos">
          <div className={`py-3 flex flex-col items-center justify-center text-sm transition-colors ${
            isActive('/servicos') ? 'text-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="mt-1">Serviços</span>
          </div>
        </Link>

        <Link href="/agendar">
          <div className={`py-3 flex flex-col items-center justify-center text-sm transition-colors ${
            isActive('/agendar') || isActive('/agendar-updated') ? 'text-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 0 0 2-2V7H3v12a2 2 0 0 0 2 2z" />
            </svg>
            <span className="mt-1">Agendar</span>
          </div>
        </Link>

        <Link href="/dashboard">
          <div className={`py-3 flex flex-col items-center justify-center text-sm transition-colors ${
            isActive('/dashboard') ? 'text-blue-600' : 'text-gray-700 hover:bg-gray-50'
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="mt-1">Conta</span>
          </div>
        </Link>
        {/* Compact theme cycle button (mobile) */}
        <button onClick={() => cycleTheme()} aria-label="Alternar tema" className="py-3 flex flex-col items-center justify-center text-sm transition-colors text-gray-700 hover:bg-gray-50">
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-green-600 text-white">{themeConfig?.icon || '🎨'}</div>
          <span className="mt-1">Tema</span>
        </button>
      </div>
    </nav>
  )
}
