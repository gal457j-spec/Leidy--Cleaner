"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import React from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold">
            🧹 Vammos
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-100 transition">Home</Link>
            <Link href="/services" className="hover:text-blue-100 transition">Serviços</Link>

            {isAuthenticated ? (
              <>
                <Link href="/bookings" className="hover:text-blue-100 transition">Meus Agendamentos</Link>

                {user?.role === 'admin' && (
                  <Link href="/admin" className="hover:text-blue-100 transition font-semibold">Admin</Link>
                )}

                <div className="relative group">
                  <button className="hover:text-blue-100 transition flex items-center space-x-1">
                    <span>{user?.name || user?.email}</span>
                    <span>▼</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg hidden group-hover:block">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Perfil</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:text-blue-100 transition">Login</Link>
                <Link href="/auth/register" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-700 transition">Registrar</Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white text-2xl">☰</button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" className="block px-4 py-2 hover:bg-blue-500 rounded">Home</Link>
            <Link href="/services" className="block px-4 py-2 hover:bg-blue-500 rounded">Serviços</Link>

            {isAuthenticated ? (
              <>
                <Link href="/bookings" className="block px-4 py-2 hover:bg-blue-500 rounded">Meus Agendamentos</Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" className="block px-4 py-2 hover:bg-blue-500 rounded font-semibold">Admin</Link>
                )}
                <Link href="/profile" className="block px-4 py-2 hover:bg-blue-500 rounded">Perfil</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-blue-500 rounded text-red-200">Logout</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block px-4 py-2 hover:bg-blue-500 rounded">Login</Link>
                <Link href="/auth/register" className="block px-4 py-2 hover:bg-blue-500 rounded">Registrar</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

