"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import React from 'react';
import { apiClient } from '@/services/api';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Calendar,
  Users,
  BarChart3,
  Home,
  Briefcase,
  Star,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [company, setCompany] = useState<{name: string; logoUrl: string} | null>(null);

  useEffect(() => {
    apiClient.getCompanyInfo().then(setCompany).catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/services', label: 'Serviços', icon: Briefcase },
    { href: '/staff-directory', label: 'Equipe', icon: Users },
  ];

  const authenticatedNavItems = [
    { href: '/bookings', label: 'Agendamentos', icon: Calendar },
  ];

  const adminNavItems = [
    { href: '/admin', label: 'Administração', icon: Settings },
    { href: '/admin/bookings', label: 'Gerenciar Agendamentos', icon: Calendar },
    { href: '/admin/reviews', label: 'Avaliações', icon: Star },
  ];

  const staffNavItems = [
    { href: '/staff/bookings', label: 'Minhas Tarefas', icon: Calendar },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <img
                src={company?.logoUrl || '/leidy-logo.png'}
                alt={company?.name || 'Leidy Cleaner'}
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-gray-900">
                {company?.name || 'Leidy Cleaner'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              </Link>
            ))}

            {isAuthenticated && (
              <>
                {authenticatedNavItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}

                {user?.role === 'admin' && (
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <BarChart3 className="w-4 h-4" />
                      Admin
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {adminNavItems.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                              <item.icon className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{item.label}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {user?.role === 'staff' && (
                  <>
                    {staffNavItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </>
                )}

                {/* User Menu */}
                <div className="relative ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="hidden lg:block text-sm font-medium">
                      {user?.name || user?.email}
                    </span>
                    <Badge variant="secondary" className="hidden xl:block text-xs">
                      {user?.role === 'admin' ? 'Admin' : user?.role === 'staff' ? 'Equipe' : 'Cliente'}
                    </Badge>
                    <ChevronDown className="w-4 h-4" />
                  </Button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {user?.role === 'admin' ? 'Administrador' : user?.role === 'staff' ? 'Profissional' : 'Cliente'}
                        </Badge>
                      </div>

                      <Link href="/profile">
                        <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Perfil</span>
                        </div>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 transition-colors text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sair</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex items-center gap-2 ml-4">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm">
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-50 transition-colors">
                    <item.icon className="w-5 h-5 text-gray-500" />
                    <span className="text-base text-gray-700">{item.label}</span>
                  </div>
                </Link>
              ))}

              {isAuthenticated && (
                <>
                  {authenticatedNavItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-50 transition-colors">
                        <item.icon className="w-5 h-5 text-gray-500" />
                        <span className="text-base text-gray-700">{item.label}</span>
                      </div>
                    </Link>
                  ))}

                  {user?.role === 'admin' && (
                    <>
                      {adminNavItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <div className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-50 transition-colors">
                            <item.icon className="w-5 h-5 text-gray-500" />
                            <span className="text-base text-gray-700">{item.label}</span>
                          </div>
                        </Link>
                      ))}
                    </>
                  )}

                  {user?.role === 'staff' && (
                    <>
                      {staffNavItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <div className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-50 transition-colors">
                            <item.icon className="w-5 h-5 text-gray-500" />
                            <span className="text-base text-gray-700">{item.label}</span>
                          </div>
                        </Link>
                      ))}
                    </>
                  )}

                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <Link href="/profile">
                      <div className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-gray-50 transition-colors">
                        <User className="w-5 h-5 text-gray-500" />
                        <span className="text-base text-gray-700">Perfil</span>
                      </div>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-3 rounded-md hover:bg-gray-50 transition-colors text-red-600"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-base">Sair</span>
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button className="w-full justify-start" size="sm">
                      Cadastrar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
