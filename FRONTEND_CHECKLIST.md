# Frontend Development Checklist

## Fase 1: Autenticação & Navegação (2-3 dias)

### Contexto e Hooks
- [ ] Criar `src/contexts/AuthContext.tsx`
  - [ ] Estado: `isAuthenticated`, `user`, `loading`
  - [ ] Métodos: `login()`, `register()`, `logout()`, `refreshToken()`
  - [ ] Persistência em `localStorage`
  
- [ ] Criar `src/hooks/useAuth.ts`
  - [ ] Hook para usar AuthContext em componentes
  
- [ ] Criar `src/hooks/useApi.ts`
  - [ ] Wrapper para chamadas API com tratamento de erros

### Componentes Principais
- [ ] Criar `src/components/navbar.tsx`
  - [ ] Logo/Brand
  - [ ] Links de navegação (Home, Serviços, Meus Agendamentos)
  - [ ] Dropdown de usuário (Perfil, Logout)
  - [ ] Responsivo (mobile menu)

- [ ] Criar `src/components/protected-route.tsx`
  - [ ] Guard para rotas autenticadas
  - [ ] Redirecionar não-autenticados para login

### Páginas
- [ ] `src/app/auth/login/page.tsx`
  - [ ] Formulário email + senha
  - [ ] Validação client-side
  - [ ] Chamada `POST /api/v1/auth/login`
  - [ ] Armazenar tokens
  - [ ] Redirecionar para home

- [ ] `src/app/auth/register/page.tsx`
  - [ ] Formulário email + senha + nome + telefone
  - [ ] Confirmação de senha
  - [ ] Validação client-side
  - [ ] Chamada `POST /api/v1/auth/register`
  - [ ] Redirecionar para login após sucesso

- [ ] `src/app/layout.tsx`
  - [ ] AuthProvider wrapper
  - [ ] Navbar global
  - [ ] Setup global styles

---

## Fase 2: Catálogo de Serviços (2-3 dias)

### Componentes
- [ ] `src/components/service-card.tsx`
  - [ ] Nome, descrição, preço, duração
  - [ ] Botão "Agendar"
  - [ ] Responsive design

- [ ] `src/components/service-filter.tsx`
  - [ ] Filtro por categoria
  - [ ] Busca por nome
  - [ ] Paginação

### Páginas
- [ ] `src/app/page.tsx` (Home)
  - [ ] Chamada `GET /api/v1/services`
  - [ ] Loading state
  - [ ] Grid de serviços
  - [ ] Filtros e busca
  - [ ] Hero section (opcional: banner)

- [ ] `src/app/services/[id]/page.tsx`
  - [ ] Chamada `GET /api/v1/services/:id`
  - [ ] Detalhe completo do serviço
  - [ ] Botão "Agendar" → `/bookings/new?serviceId=X`
  - [ ] Link voltar

---

## Fase 3: Sistema de Agendamentos (3-4 dias)

### Componentes
- [ ] `src/components/booking-form.tsx`
  - [ ] Seleção de data (datepicker)
  - [ ] Endereço (input)
  - [ ] Notas (textarea)
  - [ ] Validação
  - [ ] Submit: `POST /api/v1/bookings`

- [ ] `src/components/booking-card.tsx`
  - [ ] Status visual (pending, confirmed, completed, cancelled)
  - [ ] Informações do booking
  - [ ] Botão cancelar (se pendente e owner)

### Páginas
- [ ] `src/app/bookings/new/page.tsx`
  - [ ] Ler `?serviceId=X` da URL
  - [ ] Formulário de booking
  - [ ] Redirecionar para `/bookings` após sucesso

- [ ] `src/app/bookings/page.tsx`
  - [ ] Chamada `GET /api/v1/bookings`
  - [ ] Lista de agendamentos do usuário
  - [ ] Filter por status (opcional)
  - [ ] Link para detalhes
  - [ ] Botão cancelar

- [ ] `src/app/bookings/[id]/page.tsx`
  - [ ] Detalhes do booking
  - [ ] Informações completas
  - [ ] Botão cancelar / status
  - [ ] Link voltar

---

## Fase 4: Admin Dashboard (3-4 dias)

### Componentes
- [ ] `src/components/admin/service-list.tsx`
  - [ ] Tabela de serviços
  - [ ] Botões: Edit, Delete
  
- [ ] `src/components/admin/service-form.tsx`
  - [ ] Criar/editar serviço
  - [ ] Nome, descrição, preço, duração, categoria
  - [ ] POST/PUT para `/api/v1/services`

- [ ] `src/components/admin/booking-list.tsx`
  - [ ] Tabela de bookings
  - [ ] Filtro por status
  - [ ] Botão para atualizar status

### Páginas
- [ ] `src/app/admin/page.tsx` (Dashboard)
  - [ ] Estatísticas (total serviços, bookings, usuários)
  - [ ] Gráficos (opcional)
  - [ ] Links para gerenciar

- [ ] `src/app/admin/services/page.tsx`
  - [ ] CRUD de serviços
  - [ ] Botões: Add, Edit, Delete
  - [ ] Validação de admin

- [ ] `src/app/admin/bookings/page.tsx`
  - [ ] Lista de todos os bookings
  - [ ] Filtro por status
  - [ ] Botão para atualizar status
  - [ ] Acessível apenas para admin

---

## Fase 5: Integração Avançada (Bônus)

- [ ] Notificações toast (sucesso/erro)
- [ ] Loading skeletons
- [ ] Modal de confirmação (delete, cancel)
- [ ] Validação server-side (handle erros API)
- [ ] Refresh de dados (React Query ou SWR)
- [ ] Testes E2E (Cypress/Playwright)
- [ ] PWA features (opcional)
- [ ] Internacionalização (i18n - pt-BR)

---

## Estrutura de Pastas Final

```
frontend/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                 # Home
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── services/
│   │   ├── page.tsx             # Lista
│   │   └── [id]/page.tsx        # Detalhe
│   ├── bookings/
│   │   ├── page.tsx             # Meus bookings
│   │   ├── new/page.tsx         # Novo booking
│   │   └── [id]/page.tsx        # Detalhe booking
│   └── admin/
│       ├── page.tsx             # Dashboard
│       ├── services/page.tsx
│       └── bookings/page.tsx
│
├── components/
│   ├── navbar.tsx
│   ├── protected-route.tsx
│   ├── service-card.tsx
│   ├── service-filter.tsx
│   ├── booking-form.tsx
│   ├── booking-card.tsx
│   └── admin/
│       ├── service-list.tsx
│       ├── service-form.tsx
│       └── booking-list.tsx
│
├── contexts/
│   └── auth.tsx
│
├── hooks/
│   ├── useAuth.ts
│   └── useApi.ts
│
├── services/
│   └── api.ts                   # (já existe)
│
└── styles/
    └── globals.css
```

---

## Ordem Recomendada de Implementação

### Semana 1
1. **Auth Context + useAuth hook** - base para tudo
2. **Navbar + Protected routes** - navegação
3. **Login/Register pages** - autenticação

### Semana 2
4. **Home (listar serviços)** - catálogo
5. **Service detail** - detalhe
6. **Service filter & search** - UX

### Semana 3
7. **Booking form** - agendamento
8. **Meus bookings** - listar/cancelar
9. **Booking detail** - detalhe

### Semana 4
10. **Admin dashboard** - stats
11. **Admin CRUD serviços** - gerenciar
12. **Admin bookings** - gerenciar agendamentos

---

## Testing Checklist

- [ ] Unit tests para contextos (vitest/jest)
- [ ] Component tests (React Testing Library)
- [ ] E2E tests (Cypress/Playwright)
  - [ ] Login flow
  - [ ] Booking flow
  - [ ] Admin operations

---

## Deployment Checklist

- [ ] Build: `npm run build` sem erros
- [ ] Type check: `npm run type-check` sem erros
- [ ] Env vars configuradas (.env.production)
- [ ] API URL apontando para produção
- [ ] CORS OK no backend
- [ ] Rate limiting testado
- [ ] Tratamento de erros (API timeouts, etc)
- [ ] Analytics/Monitoring (Google Analytics, Sentry, etc)

---

## Stack Sugerido (Opcional)

- **State**: Zustand ou Redux (se necessário)
- **Data Fetching**: React Query (melhor UX)
- **Forms**: React Hook Form + Zod (validação type-safe)
- **UI Components**: shadcn/ui (Tailwind + Radix)
- **Testing**: Vitest + React Testing Library + Cypress
- **Deployment**: Vercel (Next.js native)

---

**Boa sorte! Qualquer dúvida, consulte frontend/SETUP_GUIDE.md e backend/README.md para exemplos de integração.**
