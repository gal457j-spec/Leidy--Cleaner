"use client";

import React from 'react';

export default function ConfirmModal({ open, title, message, onConfirm, onCancel }: {
  open: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-2">{title || 'Confirmação'}</h3>
        <p className="mb-4">{message || 'Deseja prosseguir?'}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 border rounded">Cancelar</button>
          <button onClick={onConfirm} className="px-3 py-1 bg-red-600 text-white rounded">Excluir</button>
        </div>
      </div>
    </div>
  );
}
