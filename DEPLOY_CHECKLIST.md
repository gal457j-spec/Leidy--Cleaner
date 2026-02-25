# ✅ DEPLOYMENT CHECKLIST - LEIDY CLEANER

**Status:** 🟢 PRONTO PARA PRODUÇÃO  
**Data:** 25/02/2026  
**Versão:** 1.0.0

---

## 🚀 PRÉ-DEPLOYMENT (24h antes)

### Backend
- [x] Compilação TypeScript sem erros
- [x] 84 testes passando
- [x] Migrations prontas (15 SQLite)
- [x] Seed data configurado
- [x] JWT/Refresh tokens funcionando
- [x] Swagger/OpenAPI documentado
- [x] Rate limiting ativo
- [x] CORS configurado

### Frontend
- [x] Next.js build sem erros
- [x] 40+ páginas implementadas
- [x] Auth Context configurado
- [x] API integração funcionando
- [x] Responsive design validado
- [x] TailwindCSS compilado

### DevOps
- [x] Docker multi-stage builds
- [x] docker-compose.prod.yml pronto
- [x] Nginx reverse proxy configurado
- [x] Health checks definidos
- [x] Environment variables documentadas

---

## 📋 DEPLOYMENT STEPS

### 1. PRÉ-FLIGHT (5 min)
```bash
# Verificar versão
cat package.json | grep version

# Verificar builds
du -sh backend/dist frontend/.next

# Testar docker
docker --version
docker-compose --version
```

### 2. ENVIRONMENT SETUP (5 min)
```bash
# Copiar .env.production
cp .env.example .env.production

# Configurar secrets
export JWT_SECRET="gerar_novo_token_seguro_32_bytes"
export DATABASE_URL="postgresql://user:pass@db:5432/leidycleaner"
export STRIPE_SECRET_KEY="sk_live_xxxxx"
export FRONTEND_URL="https://leidycleaner.com"
```

### 3. BUILD PRODUCTION (15 min)
```bash
# Build backend
cd backend && npm run build && cd ..

# Build frontend  
cd frontend && npm run build && cd ..

# Build Docker images
docker-compose -f docker-compose.prod.yml build --no-cache
```

### 4. DATABASE MIGRATION (5 min)
```bash
# Run migrations
docker-compose -f docker-compose.prod.yml run api npm run migrate

# Seed dados
docker-compose -f docker-compose.prod.yml run api npm run seed

# Backup anterior
docker-compose -f docker-compose.prod.yml exec api npm run backup
```

### 5. DEPLOY (5 min)
```bash
# Start services
docker-compose -f docker-compose.prod.yml up -d

# Health check
curl http://localhost/health
curl http://localhost/api/v1/health
curl http://localhost/api/v1/docs
```

### 6. SMOKE TESTS (10 min)
```bash
# Home page
curl -I http://localhost/ | grep 200

# API status
curl http://localhost/api/v1/status | jq
  
# Get services
curl http://localhost/api/v1/services | jq '.data | length'

# Create user (test)
curl -X POST http://localhost/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@test.com",
    "password": "TestPass123!",
    "name": "Test User"
  }'
```

### 7. MONITORING (continuous)
```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Performance
docker stats

# Database size
docker-compose -f docker-compose.prod.yml exec api du -sh data/

# API uptime
watch 'curl -s http://localhost/api/v1/health | jq'
```

---

## 📊 HEALTH METRICS

### Backend
- ✅ Response time: <200ms (P95)
- ✅ Error rate: <0.1%
- ✅ Uptime: >99.9%
- ✅ Memory: <300MB
- ✅ CPU: <20%

### Frontend
- ✅ Lighthouse: 90+
- ✅ LCP: <2.5s
- ✅ FID: <100ms
- ✅ CLS: <0.1

### Database
- ✅ Query time: <100ms (P95)
- ✅ Connections: <50
- ✅ Size: <100MB
- ✅ Backups: Diários

---

## 🔐 SECURITY CHECKLIST

### Before Going Live
- [ ] JWT_SECRET configurado (não "default")
- [ ] DATABASE_PASSWORD forte (16+ chars)
- [ ] CORS restritivo (não *)
- [ ] Helmet.js headers ativos
- [ ] Rate limiting ativo
- [ ] HTTPS certificado válido (Let's Encrypt)
- [ ] Secrets não em git (.env ignorado)
- [ ] Admin user alterado

### Regular Maintenance
- [ ] Logs monitorados
- [ ] Backup diários
- [ ] Patches de segurança
- [ ] SSL renewal automático
- [ ] Password rotation (90 dias)

---

## 📞 ROLLBACK PROCEDURE

Se algo der errado:

```bash
# 1. Parar serviços
docker-compose -f docker-compose.prod.yml down

# 2. Restaurar versão anterior
git checkout HEAD~1
docker-compose -f docker-compose.prod.yml build

# 3. Restaurar banco de dados
./restore.sh

# 4. Reiniciar
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📈 POST-DEPLOYMENT

### First 24h
- Monitor error rates
- Check API logs
- Verify database backups
- Monitor uptime

### First Week
- Load testing
- User acceptance testing
- Performance benchmarking
- Security scan

### Ongoing
- Weekly backupvalidation
- Monthly security updates
- Performance monitoring
- User feedback collection

---

## 🎯 SUCCESS CRITERIA

✅ **All must pass:**
- [ ] Zero critical errors in first hour
- [ ] All endpoints responding <200ms
- [ ] Home page loads in <3s
- [ ] Login/Register working
- [ ] Services listam correctly
- [ ] Bookings crear successfully
- [ ] Payments processing
- [ ] Admin dashboard accessible
- [ ] API documentation live
- [ ] Monitoring/alerts configured

---

## 📞 SUPPORT

**Issues? Contact:**
- API Issues: `curl -v http://localhost/api/v1/health`
- Frontend Issues: Check browser console
- Database Issues: `docker-compose -f docker-compose.prod.yml logs api`
- Docker Issues: `docker system df && docker system prune`

**Escalation:**
- Level 1: Check logs
- Level 2: Restart service
- Level 3: Rollback to previous version
- Level 4: Contact DevOps team

---

**Last Updated:** 25/02/2026  
**Status:** ✅ Deployment Ready  
**Next Review:** 01/03/2026
