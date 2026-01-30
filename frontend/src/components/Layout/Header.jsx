import React from 'react'
import ThemeSwitcher from '../UI/ThemeSwitcher'

export default function Header(){
  return (
    <header className="w-full py-4 border-b" style={{background:'transparent'}}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">Leidy Cleaner</div>
          <div className="text-sm muted">+55 51 98030-3740</div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}
import React, { useState } from 'react';
import Link from 'next/link';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-2xl font-bold text-blue-600">LimpezaPro</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link href="/servicos" className="text-gray-700 hover:text-blue-600">Serviços</Link>
            <Link href="/agendar" className="text-gray-700 hover:text-blue-600">Agendar</Link>
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">Minha Conta</Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/agendar" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Agendar Agora
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link href="/" className="block py-2 text-gray-700">Home</Link>
            <Link href="/servicos" className="block py-2 text-gray-700">Serviços</Link>
            <Link href="/agendar" className="block py-2 text-gray-700">Agendar</Link>
            <Link href="/dashboard" className="block py-2 text-gray-700">Minha Conta</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
