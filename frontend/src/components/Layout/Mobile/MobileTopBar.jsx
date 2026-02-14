import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import SiteSearch from '../../UI/SiteSearch'

export default function MobileTopBar() {
  

  return (
    <>
      <header className="mobile-only fixed top-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 relative rounded-lg overflow-hidden">
                <Image src="https://leidycleaner.com.br/logo-leidy.png" alt="Leidy Cleaner" width={40} height={40} />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-black text-gray-900 dark:text-white">Leidy Cleaner</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Limpeza Premium</div>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <SiteSearch />
            <Link href="/agendar" className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-semibold">📅 Agendar</Link>
          </div>
        </div>
      </header>

      {/* Mobile search modal */}
      {/* Mobile search handled by SiteSearch component now */}
    </>
  )
}
