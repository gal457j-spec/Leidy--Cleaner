import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import ThemeSelector from '../UI/ThemeSelector';

/**
 * Header Component - Premium com logo visual
 */
export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/servicos', label: 'Servicos', icon: '✨' },
    { href: '/agendar', label: 'Agendar', icon: '📅' },
    { href: '/dashboard', label: 'Minha Conta', icon: '👤' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm desktop-only">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo + Brand with Theme Image */}
          <Link href="/">
            <div className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
              {/* Brand Image - Circular with Border */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-600 hover:border-cyan-500 transition-all">
                <Image 
                  src="/icon-brand.jpg" 
                  alt="Leidy Cleaner Brand" 
                  width={64} 
                  height={64} 
                  className="object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              {/* Text Brand */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white drop-shadow-sm">
                  Leidy Cleaner
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                  Limpeza Profissional Premium
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div className="px-4 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-medium flex items-center gap-2 group">
                  <span className="group-hover:scale-125 transition-transform">{link.icon}</span>
                  {link.label}
                </div>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <ThemeSelector />
            <Link href="/agendar">
              <div className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-900 dark:bg-cyan-600 hover:bg-slate-800 dark:hover:bg-cyan-500 text-white transition-all font-bold text-sm shadow-lg">
                <span>📅</span>
                Agendar
              </div>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6 text-slate-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden pb-4 space-y-2 border-t border-slate-200 dark:border-slate-700/30 pt-4 animate-in fade-in slide-up">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <div 
                  className="block px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors font-medium flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </div>
              </Link>
            ))}
            <Link href="/agendar">
              <div 
                className="block px-4 py-3 mt-4 bg-slate-900 dark:bg-cyan-600 text-white rounded-lg font-bold text-center hover:shadow-lg transition-all hover:bg-slate-800 dark:hover:bg-cyan-500"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Agendar Agora
              </div>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
