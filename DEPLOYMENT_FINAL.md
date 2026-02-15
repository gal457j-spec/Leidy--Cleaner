# 🚀 AVAN-O: DEPLOYMENT GUIDE

**Status**: ✅ PRONTO PARA PRODUÇÃO / DEMO

---

## 📋 Checklist de Readiness

| Item | Status | Detalhes |
|------|--------|----------|
| Backend | ✅ Online | Rodando em `:3001` |
| Frontend | ✅ Online | Next.js em `:3000` |
| Database | ✅ Pronto | SQLite 276KB, 13 tabelas |
| Migrations | ✅ Aplicadas | 51/51 sucesso |
| Tests | ✅ Passing | 360+ testes válidos em 2.5s |
| Build Frontend | ✅ Sucesso | `.next/` pronto |
| Secrets | ✅ Gerados | `backend/.env` com JWT keys |
| Dependencies | ✅ Instaladas | npm ci executado |

---

## 🎯 Para Rodaro Projeto Localmente

### 1️⃣ **Clone & Setup**
```bash
git clone https://github.com/lesa24k/avan-o.git
cd avan-o
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2️⃣ **Gere Secrets (primeira vez)**
```bash
node scripts/generate-secrets.js --output backend/.env
```

### 3️⃣ **Iniciar Banco de Dados**
```bash
cd backend
node src/db/runMigrations.js
```

### 4️⃣ **Iniciar Servidores** (em 2 terminais)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Rodando em http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run start
# Rodando em http://localhost:3000
```

### 5️⃣ **Verificar Saúde**
```bash
# Backend health check
curl http://localhost:3001/health

# Frontend home
open http://localhost:3000
```

---

## 🧪 Rodar Testes

```bash
cd backend

# Testes rápidos (360+ testes em 2.5s)
npm test

# Testes com coverage
npm run test:coverage

# Testes watch mode
npm run test:watch
```

---

## 📁 Estrutura de Pastas

```
avan-o/
├── backend/
│   ├── src/
│   │   ├── routes/           # Endpoints Express
│   │   ├── controllers/       # Lógica de negócio
│   │   ├── services/          # Serviços (email, pagamento, etc)
│   │   ├── db/                # Migrations SQL + setup
│   │   └── __tests__/         # Jest tests
│   ├── backend_data/          # SQLite database
│   ├── .env                   # Secrets (gerado)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/             # Next.js routes
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── styles/            # Tailwind + CSS
│   │   └── utils/             # Utilities
│   ├── .next/                 # Build artifacts (gerado)
│   └── package.json
│
└── scripts/
    ├── generate-secrets.js    # JWT key generator
    └── test-incrementally.sh  # Test runner
```

---

## 🔑 Variáveis de Ambiente

### Backend (`.env`)
```env
# Gerado automaticamente via scripts/generate-secrets.js
JWT_SECRET=...
JWT_REFRESH_SECRET=...
DATABASE_URL=backend_data/database.sqlite

# Opcionaloptions (para integração real)
STRIPE_SECRET_KEY=sk_test_...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
```

### Frontend (`.env.local` se necessário)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🐛 Troubleshooting

### ❌ "Port already in use"
```bash
# Kill processo na porta 3001
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Ou 3000
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### ❌ "Database connection failed"
```bash
# Regerar migrations
cd backend && rm backend_data/database.sqlite
node src/db/runMigrations.js
```

### ❌ "Jest travado / timeout"
```bash
# Usar runner incremental
bash scripts/test-incrementally.sh

# Ou rodar arquivo específico
npm test -- src/__tests__/RoutingService.test.js
```

---

## 📊 Stats Finais

| Métrica | Valor |
|---------|-------|
| **Testes Passando** | 360+ ✅ |
| **Tempo de Execução** | 2.5s ⚡ |
| **Database Size** | 276KB |
| **API Endpoints** | 50+ |
| **React Components** | 100+ |
| **Frontend Build Time** | 30-60s |

---

## 🚢 Deployment (Produção)

### Via Docker
```bash
docker-compose -f docker-compose.prod.yml up
```

### Via PM2 (Recommended)
```bash
npm install -g pm2

# Backend
cd backend && pm2 start src/index.js --name "avan-backend"

# Frontend
cd frontend && pm2 start npm -- run start --name "avan-frontend"

# Monitor
pm2 monit
pm2 logs
```

### Via Vercel (Frontend) + Heroku/Railway (Backend)
1. Push ao GitHub
2. Connect ao Vercel para frontend
3. Connect ao Railway para backend
4. Set environment variables
5. Deploy!

---

## ✅ Último QA

```bash
# Verificar tudo
bash /tmp/final_qa.sh

# Esperado: Todas as linhas com ✅ verde
```

---

## 📞 Suporte

- **Backend Issues**: `/workspaces/avan-o/backend`
- **Frontend Issues**: `/workspaces/avan-o/frontend`
- **Database Issues**: Check `backend/backend_data/`
- **Tests Failed**: Run `npm test -- --verbose`

---

**Gerado em**: 2026-02-15  
**Status**: 🟢 PRODUCTION READY
