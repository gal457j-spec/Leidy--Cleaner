# Vammos - Plataforma de Serviços de Limpeza Empresarial

**Status**: MVP v1 - Backend ✅ | Frontend 🚧

Plataforma SaaS para agendamento de serviços de limpeza residencial e comercial.

## 🚀 Início Rápido

### Via Script (Recomendado)

```bash
./setup-local.sh
```

Este script irá:
1. Verificar pré-requisitos (Docker, Node.js)
2. Iniciar PostgreSQL em container
3. Instalar dependências (backend + frontend)
4. Rodar migrations e seed

### Manual

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run migrate  # Se novo
npm run dev      # Roda em :3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev      # Roda em :3000
```

**Terminal 3 - Testes:**
```bash
cd backend
npm test
```

## 📊 Status do Projeto

### Backend ✅ Completo
- **20+ endpoints** implementados e testados
- **53/53 testes** passando
- Autenticação JWT completa
- CRUD de serviços, bookings, company info
- Role-based access control
- Validações estruturadas (Joi)
- Migrations automáticas (PostgreSQL)
- TypeScript 100%, build OK

**Stack**: Node.js 20 + Express + PostgreSQL + Jest

### Frontend 🚧 Aguardando Implementação
Estrutura pronta para começar em `frontend/SETUP_GUIDE.md`

**Stack**: Next.js 14 + React 18 + Tailwind CSS

## 📚 Documentação

| Documento | O Quê |
|-----------|-------|
| [PROJECT_STATUS.md](PROJECT_STATUS.md) | Visão geral completa + roadmap |
| [backend/README.md](backend/README.md) | API endpoints, setup, stack |
| [frontend/SETUP_GUIDE.md](frontend/SETUP_GUIDE.md) | Guia de desenvolvimento frontend |

## 🔐 Credenciais Padrão

```
Email: admin@vammos.com
Password: admin123456
```

## 🌐 Acessar

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:3001 |
| Health Check | http://localhost:3001/health |
| API Status | http://localhost:3001/api/v1/status |

## 📦 Estrutura do Projeto

```
vammos/
├── backend/                 # Node.js/Express API (✅ pronto)
│   ├── src/
│   │   ├── controllers/    # Requisição/resposta
│   │   ├── services/       # Lógica de negócio
│   │   ├── routes/         # Rotas
│   │   ├── middleware/     # Auth, error handling
│   │   ├── utils/          # DB, JWT, password
│   │   ├── types/          # TypeScript interfaces
│   │   ├── db/             # Migrations, seed
│   │   └── main.ts         # Entrada
│   ├── migrations/         # SQL migrations
│   ├── jest.config.js      # Testes
│   └── package.json
│
├── frontend/                # Next.js (🚧 estrutura pronta)
│   ├── src/
│   │   ├── app/            # Páginas (rotas App Router)
│   │   ├── components/     # Componentes React
│   │   ├── services/       # Cliente API
│   │   └── hooks/          # React hooks
│   ├── tailwind.config.js
│   └── package.json
│
├── PROJECT_STATUS.md        # Status completo
└── setup-local.sh          # Script de setup
```

## 🎯 Endpoints Testados

### Autenticação
```
POST   /api/v1/auth/register      # Registrar
POST   /api/v1/auth/login         # Login
POST   /api/v1/auth/refresh-token # Renovar token
GET    /api/v1/auth/me            # Perfil
PUT    /api/v1/auth/me            # Atualizar perfil
```

### Serviços
```
GET    /api/v1/services           # Listar (com filtros)
GET    /api/v1/services/:id       # Detalhe
GET    /api/v1/services/categories # Categorias
POST   /api/v1/services           # Criar (admin)
PUT    /api/v1/services/:id       # Atualizar (admin)
DELETE /api/v1/services/:id       # Deletar (admin)
```

### Agendamentos
```
POST   /api/v1/bookings           # Criar
GET    /api/v1/bookings           # Listar meus
GET    /api/v1/bookings/:id       # Detalhe
PUT    /api/v1/bookings/:id/status # Atualizar status (admin)
DELETE /api/v1/bookings/:id       # Cancelar
```

### Empresa
```
GET    /api/v1/company            # Info pública
```

## 🛠️ Desenvolvimento

### Backend

```bash
cd backend

# Dev com hot reload
npm run dev

# Build
npm run build

# Testes
npm test

# Testes com watch
npm run test:watch

# Migrations
npm run migrate

# Seed dados
npm run seed
```

### Frontend

```bash
cd frontend

# Dev
npm run dev

# Build
npm run build

# Tipos
npm run type-check
```

## 🔄 Fluxo de Autenticação

1. Usuário faz login → `POST /api/v1/auth/login`
2. Backend retorna `{ accessToken, refreshToken }`
3. Frontend armazena tokens em `localStorage`
4. Cliente HTTP adiciona `Authorization: Bearer <accessToken>` em cada requisição
5. Token expira → cliente usa `refreshToken` para obter novo token
6. Logout limpa tokens do localStorage

## 📦 Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14, React 18, Tailwind CSS, Axios |
| Backend | Node.js 20, Express, TypeScript |
| Database | PostgreSQL 15 |
| Auth | JWT + bcryptjs |
| Validation | Joi |
| Testing | Jest + Supertest |
| Deployment | Docker, GitHub Actions |

## 🚀 Deploy

### Docker Compose
```bash
docker-compose up -d
# Frontend: :3000, Backend: :3001, Postgres: :5432
```

### GitHub Actions
Workflow automático em `.github/workflows/ci.yml`:
- Run tests on push/PR
- Build image
- Deploy (quando pronto)

## 📝 Próximas Prioridades

### Frontend (Próximas 2-3 semanas)
1. Contexto de autenticação
2. Páginas de login/register
3. Navbar + ProtectedRoute
4. Catálogo de serviços
5. Booking flow
6. Admin panel básico

### Futuro (v2)
- [ ] Integração de pagamento (Stripe/PIX)
- [ ] Avaliações e reviews
- [ ] Geolocalização
- [ ] WhatsApp/SMS notifications
- [ ] App mobile (React Native)
- [ ] Prestador de serviços (provider dashboard)

## 🐛 Troubleshooting

### "Jest did not exit" (Backend)
Aviso normal, pool do Postgres está encerrando. Não afeta testes.

### PostgreSQL já em uso
```bash
docker stop vammos-postgres-test
docker rm vammos-postgres-test
```

### Porta já em uso
```bash
# Backend muda porta:
PORT=3002 npm run dev

# Frontend muda porta:
npm run dev -- -p 3001
```

## 📞 Suporte

Veja [PROJECT_STATUS.md](PROJECT_STATUS.md) para visão completa e roadmap.

---

**Made with ❤️ by Vammos Team | © 2026**
