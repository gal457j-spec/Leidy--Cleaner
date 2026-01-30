import React from 'react';
import Link from 'next/link';

export const Navigation = ({ currentPage }) => {
  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Serviços', path: '/servicos', icon: '🧹' },
    { name: 'Agendar', path: '/agendar', icon: '📅' },
    { name: 'Minha Conta', path: '/dashboard', icon: '👤' },
    { name: 'Admin', path: '/admin', icon: '⚙️' },
  ];

  return (
    <nav className="flex flex-wrap gap-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`flex items-center space-x-2 px-4 py-2 rounded transition ${
            currentPage === item.path
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span>{item.icon}</span>
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navigation;
