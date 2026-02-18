import React from 'react';

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contato</h1>
      <p className="mb-4">Para orçamentos e dúvidas, preencha o formulário abaixo.</p>

      <form className="space-y-3 bg-white p-4 rounded shadow">
        <input placeholder="Nome" className="w-full border p-2 rounded" />
        <input placeholder="Email" className="w-full border p-2 rounded" />
        <textarea placeholder="Mensagem" className="w-full border p-2 rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Enviar</button>
      </form>
    </div>
  );
}
