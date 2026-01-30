import React from 'react'

export default function Footer(){
  return (
    <footer className="w-full py-8 mt-12 border-t">
      <div className="container text-center text-sm muted">
        © {new Date().getFullYear()} Leidy Cleaner — Contato: +55 51 98030-3740 — PIX: 51 98033 0422
      </div>
    </footer>
  )
}
import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">LimpezaPro</h3>
            <p className="text-gray-400">
              Sua solução inteligente para limpeza profissional e confiável.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/sobre" className="hover:text-white">Sobre Nós</a></li>
              <li><a href="/servicos" className="hover:text-white">Serviços</a></li>
              <li><a href="/contato" className="hover:text-white">Contato</a></li>
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contato</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📞 (11) 99999-9999</li>
              <li>📧 contato@limpezapro.com</li>
              <li>📍 São Paulo, SP</li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-bold mb-4">Redes Sociais</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white">WhatsApp</a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 LimpezaPro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
