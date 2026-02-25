# 🚀 QUICK START - LEIDY CLEANER

**Tempo total para estar em produção: ~5 minutos**

---

## ⚡ UMA LINHA PARA TUDO

```bash
./deploy-final.sh
```

Isto fará:
- ✅ Compilar backend
- ✅ Compilar frontend
- ✅ Build Docker images
- ✅ Iniciar serviços
- ✅ Rodar migrations
- ✅ Seed data
- ✅ Health checks
- ✅ Smoke tests

---

## 📍 ACESSAR A APLICAÇÃO

Após o deploy:

```
Frontend:       http://localhost
Admin Panel:    http://localhost/admin
Dashboard:      http://localhost/dashboard

API:            http://localhost/api/v1
API Docs:       http://localhost/api/v1/docs (Swagger)
API Health:     http://localhost/api/v1/health
```

---

## 🔐 LOGIN DE TESTE

**Admin:**
- Email: `admin@leidycleaner.com`
- Senha: `admin123456`

**Usuário normal:**
- Email: `test@test.com`
- Senha: `TestPass123!`

---

## 🛑 PARAR/REINICIAR

```bash
# Parar tudo
docker-compose -f docker-compose.prod.yml down

# Reiniciar
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Executar comando no backend
docker-compose -f docker-compose.prod.yml exec api [COMANDO]

# Fazer backup do DB
docker-compose -f docker-compose.prod.yml exec api npm run backup

# Ver DB
sqlite3 backend/data/data.db "SELECT COUNT(*) FROM users;"
```

---

## 📦 ESTRUTURA DO PROJETO

```
leidy-cleaner/
├── backend/              # Node.js/Express/TypeScript
│   ├── src/
│   │   ├── controllers/  # Lógica de negócio
│   │   ├── routes/       # Endpoints
│   │   ├── services/     # Serviços (Auth, Booking, etc)
│   │   ├── middleware/   # Auth, error handling
│   │   └── utils/        # Helpers, validations
│   ├── migrations/       # Database schema
│   ├── dist/            # Build output
│   └── data/            # SQLite database
│
├── frontend/             # Next.js/React/TypeScript
│   ├── src/
│   │   ├── app/         # Pages (routing)
│   │   ├── components/  # React components
│   │   ├── contexts/    # Auth context
│   │   ├── hooks/       # Custom hooks
│   │   └── services/    # API client
│   ├── .next/           # Build output
│   └── public/          # Static files
│
├── docker-compose.prod.yml    # Production deployment
├── nginx.prod.conf            # Reverse proxy config
├── deploy-final.sh            # Deploy automation
└── FINISHED_PROJECT_SUMMARY.md # Documentação
```

---

## 🔧 DESENVOLVIMENTO LOCAL (sem Docker)

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# Roda em http://localhost:3001

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Roda em http://localhost:3000
```

---

## 🧪 RODAR TESTES

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests (Playwright)
npm run test:e2e
```

---

## 🔍 TROUBLESHOOTING

### Porta já em uso
```bash
# Verificar qual processo está usando
lsof -i :80  # Frontend
lsof -i :3001  # Backend

# Matar processo
kill -9 [PID]
```

### Banco de dados corrompido
```bash
# Deletar e reconfigur ar
rm backend/data/data.db
docker-compose -f docker-compose.prod.yml exec api npm run migrate
docker-compose -f docker-compose.prod.yml exec api npm run seed
```

### Docker cache issue
```bash
# Limpar cache
docker system prune -a
docker-compose -f docker-compose.prod.yml build --no-cache
```

---

## 📊 MONITORAMENTO

```bash
# Ver recursos em tempo real CPU, memory, network)
docker stats

# Ver logs do container
docker-compose -f docker-compose.prod.yml logs -f [service]

# Ver informações do container
docker ps -a
docker inspect [container_name]

# Verificar saúde da API
watch -n 2 'curl -s http://localhost/api/v1/health | jq'
```

---

## 🔴 ROLLBACK

Se algo der errado:

```bash
# Stop services
docker-compose -f docker-compose.prod.yml down

# Restore backup
./restore.sh

# Restart
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para documentação detalhada, veja:
- `FINISHED_PROJECT_SUMMARY.md` - Overview completo
- `DEPLOY_CHECKLIST.md` - Checklist pré-deployment
- `DEPLOYMENT.md` - Guia de deployment
- `/api/v1/docs` - Swagger API documentation

---

## 🎯 PRÓXIMAS FEATURES (opcional)

- [ ] 2FA (Two-Factor Authentication)
- [ ] OAuth (Google, GitHub)
- [ ] WebSocket (real-time notifications)
- [ ] Mobile app
- [ ] Advanced analytics

---

**Status:** ✅ Pronto para produção  
**Versão:** 1.0.0  
**Data:** 25/02/2026

Bom sucesso! 🚀
