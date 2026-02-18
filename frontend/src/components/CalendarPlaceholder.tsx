"use client";

import React from 'react';

export default function CalendarPlaceholder({ value, onChange }: { value: string; onChange: (v: string) => void; }) {
  return (
    <div className="space-y-2">
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded"
      />
      {value && (
        <div className="text-sm text-gray-600">Selecionado: {new Date(value).toLocaleString()}</div>
      )}
      <div className="text-xs text-gray-500">Calendário simples — substitua por um componente de calendário real quando necessário.</div>
    </div>
  );
}
