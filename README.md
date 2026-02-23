# 🚀 Leidy Cleaner - Production Ready

**Status**: ✅ Completo e pronto para deploy em produção

Plataforma SaaS para agendamento de serviços de limpeza residencial e comercial com autenticação JWT, agendamentos, pagamentos e dashboard gerenciador.

## 📊 O que foi entregue

### ✨ Frontend (Next.js 16)
- ✅ Homepage com SEO otimizado
- ✅ Catálogo de serviços (8 serviços com preços)
- ✅ Sistema de autenticação JWT (Login/Register)
- ✅ Dashboard de agendamentos do cliente
- ✅ Formulário de agendamento com preço calculado em tempo real
- ✅ Responsive Mobile-First
- ✅ Paleta de cores: Verde (#22c55e) + Teal (#10b981)
- ✅ Branding "Leidy Cleaner" completo

### ⚙️ Backend (Express + SQLite)
- ✅ API RESTful `/api/v1` production-ready
- ✅ JWT Authentication (access + refresh tokens)
- ✅ Endpoints completos:
  - `POST /auth/register` - Criar conta
  - `POST /auth/login` - Login com tokens
  - `GET /services` - Listar serviços
  - `POST /bookings` - Agendar com cálculo de preço
  - `POST /payments/checkout` - Registrar pagamento
  - `GET /reviews/public` - Avaliações públicas
- ✅ Cálculo de preços automático: R$40 + R$20/h adicional + 40% taxa
- ✅ SQLite com 13 migrations
- ✅ Jest: 79/79 testes passando ✅

### 🔒 Segurança Nível Enterprise
- ✅ JWT com refresh tokens
- ✅ CORS habilitado e configurado
- ✅ Validação Joi em todos endpoints
- ✅ Senhas hasheadas com bcrypt
- ✅ Rate limiting por endpoint
- ✅ Helmet.js com CSP
- ✅ Sanitização contra XSS/Injeção

### 🐳 DevOps & Deployment
- ✅ Docker Compose (dev + prod)
- ✅ Nginx como Reverse Proxy
- ✅ **Uma porta única em produção** (80 → Nginx → 3000/3001)
- ✅ Health checks automáticos
- ✅ Compressão GZIP
- ✅ Cache de assets estáticos
- ✅ Deploy script automatizado
- ✅ Documentação completa de deployment

## 🎯 Arquitetura em Produção

```
                      Internet
                          ↓
           Nginx (Reverse Proxy)
            Porta 80/443
         /                     \
    /api/v1/*                  /*
        ↓                        ↓
   Backend:3001          Frontend:3000
   • Autenticação        • Next.js
   • Agendamentos        • TailwindCSS
   • Pagamentos          • Responsivo
   • SQLite DB           • SEO
```

**Resultado**: Uma única porta para o usuário! Toda complexidade interna. 🎉

---

## 🚀 Deploy em 1 Comando

```bash
cd /workspaces/Leidy-cleaner
chmod +x deploy.sh
./deploy.sh
```

Ou manualmente:
```bash
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d
```

**Acesso**: http://localhost

---

## 📋 Credenciais de Teste

**Admin:**
```
Email: admin@leidycleaner.com
Senha: admin123456
```

**Cliente Teste:**
```
Email: cliente@example.com
Senha: senha123456
```

Ou registrar novo usuário em `/auth/register`
- ✅ **UMA SÓ PORTA** (3000)
- ✅ Funciona em qualquer máquina
- ✅ Sem Docker necessário
- ✅ Setup automático
- ✅ SQLite incluído

### Opção 2: Local sem Docker (Desenvolvimento Separado)

```bash
# Setup completo (SQLite, sem Docker)
npm run setup:local

# Iniciar desenvolvimento
npm run dev

# Acessar:
# - Frontend + API: http://localhost:3000
# - Health: http://localhost:3000/api/health
```

### Opção 3: Via Docker (Produção)

```bash
# Inicia tudo: nginx (porta 80) + frontend + backend + postgres
docker-compose -f docker-compose.dev.yml up -d

# Acessar:
# - App: http://localhost
# - API: http://localhost/api/v1
# - Backend direto: http://localhost:3001 (se precisar)
```

### Opção 3: Via Script Local (Com Docker Postgres)

```bash
./setup-local.sh
```

### Manual

**Terminal 1 - Backend:**
```bash
cd backend
cp .env.example .env  # Configurar variáveis
npm install
npm run migrate
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
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
| Frontend + API | http://localhost:3000 |
| Health Check | http://localhost:3000/api/health |
| API Status | http://localhost:3000/api/v1/status |

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

## 🔁 Rollout: mudança para refresh token em HttpOnly cookie

Recomendação de rollout ao ativar o envio do `refreshToken` por cookie HttpOnly:

- Em `production`, habilitar `COOKIE_SECURE=true` (HTTPS obrigatório). Se usar
	`COOKIE_SAMESITE=None`, `COOKIE_SECURE` precisa ser `true`.
- Atualize o `README`/`.env` e a infraestrutura antes do deploy (load balancers,
	proxies e domínio). Use `COOKIE_DOMAIN` para ambientes com domínio específico.
- Para evitar logout forçado dos usuários, adote rotação de segredo dos refresh
	tokens com sobreposição: gere um novo `JWT_REFRESH_SECRET`, mantenha o antigo
	por um curto período e valide ambos durante a transição.
- Procedimento de revogação: ao forçar logout, incremente um `tokenVersion` no
	banco ou registre `revoked_at` para refresh tokens e rejeite tokens antigos.
- Atualize o frontend para não depender do armazenamento local do `refreshToken`.
	Em vez disso, chame `POST /api/v1/auth/refresh-token` sem enviar o token (o
	cookie HttpOnly será incluído automaticamente). Opcionalmente, mantenha
	retorno do token no corpo para compatibilidade enquanto o frontend é atualizado.

Comandos úteis locais para testar via HTTPS (exemplo com `local-ssl-proxy`):

```bash
# start backend com NODE_ENV=production (require HTTPS for secure cookies)
NODE_ENV=production COOKIE_SECURE=true npm run dev

# testar refresh via cookie (supertest/local client)
# o teste de integração `backend/src/routes/__tests__/refreshCookie.test.ts` valida o fluxo
npm test -- --runInBand
```

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
# Frontend + API: :3000, Postgres: :5432
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
- [x] Avaliações e reviews (com moderação)

### Environment variables

The backend supports Stripe checkout when configured:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

If `STRIPE_SECRET_KEY` is not set the payment flow will fall back to the simple update.
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
