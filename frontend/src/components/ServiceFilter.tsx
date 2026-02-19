"use client";

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/services/api';

type Props = {
  onChange: (opts: { category?: string; search?: string }) => void;
};

export default function ServiceFilter({ onChange }: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    apiClient
      .getServiceCategories()
      .then((cats) => setCategories(cats))
      .catch(() => {});
  }, []);

  // propagate changes up with debounce
  useEffect(() => {
    const id = setTimeout(() => onChange({ category: category || undefined, search: search || undefined }), 300);
    return () => clearTimeout(id);
  }, [search, category, onChange]);

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar serviços..."
        className="border p-2 rounded flex-1"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Todas as categorias</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <button
        onClick={() => { setSearch(''); setCategory(''); }}
        className="border px-3 py-1 rounded">
        Limpar
      </button>
    </div>
  );
}
