import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'Limpeza Pro - Plataforma de Agendamento',
  description: 'Agende serviços de limpeza profissional com facilidade',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
