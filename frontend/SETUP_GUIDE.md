# Frontend Setup Guide

Backend API instalada e rodando em `http://localhost:3001`.

## Começar Rápido

```bash
cd frontend
npm install
npm run dev
# Acesse http://localhost:3000
```

## Páginas Prioritárias para Implementar

1. **Login/Register** (`app/auth/login` e `app/auth/register`)
   - Formulário com email/senha/nome/telefone
   - Integração com `POST /api/v1/auth/register` e `POST /api/v1/auth/login`
   - Armazenar tokens em `localStorage` / cookies
   - Redirecionar após sucesso

2. **Dashboard/Home** (`app/page.tsx`)
   - Listar serviços via `GET /api/v1/services`
   - Busca e filtros por categoria
   - Cards de serviço com preço, duração

3. **Service Detail** (`app/services/[id]`)
   - Detalhes do serviço
   - Botão "Agendar Booking"
   - Reviews (se implementado)

4. **Booking** (`app/bookings/new`)
   - Formulário com data, endereço, notas
   - Cálculo dinâmico de preço
   - POST para `/api/v1/bookings`

5. **Meus Bookings** (`app/bookings`)
   - Listar bookings do usuário
   - Status (pending, confirmed, completed, cancelled)
   - Botão de cancelamento

6. **Admin Panel** (`app/admin/*`)
   - CRUD de serviços
   - Gerenciar bookings (status)
   - Estatísticas

## Estrutura de Pastas Sugerida

```
frontend/src/
├── app/
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Home
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── services/
│   │   ├── page.tsx         # Listar serviços
│   │   └── [id]/page.tsx    # Detalhe serviço
│   ├── bookings/
│   │   ├── page.tsx         # Meus bookings
│   │   └── new/page.tsx     # Novo booking
│   └── admin/
│       └── dashboard/page.tsx
├── components/
│   ├── navbar.tsx           # Barra de navegação
│   ├── service-card.tsx     # Card de serviço
│   ├── booking-form.tsx     # Formulário booking
│   └── protected-route.tsx  # Guard para rotas autenticadas
├── services/
│   └── api.ts               # Cliente HTTP (axios)
├── hooks/
│   ├── useAuth.ts           # Contexto de autenticação
│   └── useApi.ts            # Hook para chamadas API
└── styles/
    └── globals.css          # Estilos globais
```

## Cliente API

Já existe um cliente em `frontend/src/services/api.ts`:

```typescript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
});

// Interceptor para adicionar token em requisições
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
```

Use assim em componentes:

```typescript
import API from '@/services/api';

// Listar serviços
const { data } = await API.get('/api/v1/services');

// Fazer login
const res = await API.post('/api/v1/auth/login', { email, password });
localStorage.setItem('accessToken', res.data.data.tokens.accessToken);
```

## Autenticação

### Fluxo Recomendado

1. Criar contexto React (`AuthContext`) para gerenciar estado de login
2. Componente `ProtectedRoute` que redireciona se não autenticado
3. Armazenar tokens em `localStorage` (ou cookies HttpOnly em produção)
4. Implementar `useAuth` hook para usar em qualquer página

Exemplo de contexto:

```typescript
// contexts/auth.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Implementar login/logout aqui
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

## Componentes Tailwind

O projeto já usa **Tailwind CSS** (veja `tailwind.config.js`).

Exemplo de componente:

```typescript
// components/service-card.tsx
import Link from 'next/link';

interface ServiceCardProps {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
}

export function ServiceCard({
  id,
  name,
  description,
  basePrice,
  durationMinutes
}: ServiceCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg">
      <h3 className="text-lg font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xl font-bold text-green-600">R$ {basePrice}</p>
          <p className="text-xs text-gray-500">{durationMinutes} min</p>
        </div>
        <Link
          href={`/bookings/new?serviceId=${id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agendar
        </Link>
      </div>
    </div>
  );
}
```

## Desenvolver

Para começar a implementação, sugiro:

1. **Dia 1**: Auth (Login/Register pages e contexto) + Navbar
2. **Dia 2**: Home (listar serviços) + Service detail
3. **Dia 3**: Booking form + Meus bookings
4. **Dia 4**: Admin panel básico

> Todos os endpoints já estão prontos no backend! É só integrar.
