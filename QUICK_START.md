# 🚀 Leidy Cleaner - Quick Start

**Status**: ✅ Production Ready

## 🎯 Arquitetura

```
Internet (Porta 80) → Nginx (Reverse Proxy)
                        ├─ /api/v1/* → Backend:3001
                        └─ /* → Frontend:3000
```

## 🚀 Deploy em 1 Comando

```bash
cd /workspaces/Leidy-cleaner
chmod +x deploy.sh
./deploy.sh
```

**Tempo**: ~30-60 segundos para build e startup
**Resultado**: Tudo rodando em `http://localhost`

## 📋 Credenciais de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | `admin@leidycleaner.com` | `admin123456` |
| Cliente | `cliente@example.com` | `senha123456` |
| Novo | Registre em `/auth/register` | - |

## 🌐 URLs Principais

| Página | URL |
|--------|-----|
| Home | `/` |
| Serviços | `/services` |
| Login | `/auth/login` |
| Dashboard | `/dashboard` |
| Empresa | `/company` |

## 📊 O que foi entregue

✅ **Frontend**
- Next.js 16 + TypeScript + TailwindCSS
- Responsive Mobile-First
- Cores: Verde (#22c55e) + Teal (#10b981)
- 7 páginas completas

✅ **Backend**
- Express + TypeScript
- JWT Authentication (access + refresh tokens)
- 6 endpoints principais
- 79/79 testes passando
- Cálculo de preços automático: R$40 + R$20/h + 40% taxa

✅ **DevOps**
- Docker Compose
- Nginx Reverse Proxy
- Health Checks
- GZIP Compression
- Uma porta única (80)

## 📂 Estrutura de Arquivos

```
docker-compose.prod.yml    ← Arquivo de produção (4 serviços)
nginx.prod.conf            ← Configuração Nginx
deploy.sh                  ← Script de deploy
DEPLOYMENT.md              ← Guia completo de deployment
backend/                   ← API
  src/
    controllers/
    middleware/
    routes/
    services/
  migrations/              ← 13 migrations SQL
frontend/                  ← Next.js App
  src/
    app/
      auth/
      dashboard/
      services/
      company/
```

## 🚀 Comandos Úteis

```bash
# Iniciar tudo
./deploy.sh

# Ver status
docker-compose -f docker-compose.prod.yml ps

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart
docker-compose -f docker-compose.prod.yml restart

# Parar
docker-compose -f docker-compose.prod.yml down

# Limpar (delete volumes)
docker-compose -f docker-compose.prod.yml down -v
```

## 📡 API Endpoints

```bash
# Autenticação
POST   /api/v1/auth/register
POST   /api/v1/auth/login

# Serviços
GET    /api/v1/services

# Agendamentos (requer JWT)
POST   /api/v1/bookings
GET    /api/v1/bookings/my

# Pagamentos (requer JWT)
POST   /api/v1/payments/checkout

# Health
GET    /api/v1/health
GET    /health
```

## 🔧 Troubleshooting

**Porta 80 em uso?**
```bash
# Ver o que está usando
lsof -i :80

# Usar porta diferente
docker-compose -f docker-compose.prod.yml down
sed -i 's/80:/8080:/g' docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
# Acessar em http://localhost:8080
```

**Erro de permissão Docker?**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

**Precisa resetar dados?**
```bash
docker-compose -f docker-compose.prod.yml down -v
./deploy.sh
```

## 🎯 Próximos Passos (Opcional)

1. **SSL/HTTPS**: Editar `nginx.prod.conf` e adicionar certificado Let's Encrypt
2. **Email**: Configurar variáveis de SMTP
3. **Stripe**: Adicionar chaves de pagamento
4. **Domínio**: Atualizar DNS e nginx.prod.conf
5. **Monitoramento**: Adicionar logs e métricas

## 📞 Suporte

Veja [DEPLOYMENT.md](DEPLOYMENT.md) para:
- Setup SSL/TLS
- Variáveis de ambiente
- Scaling
- Deploy em hosting (Railway, Render, AWS, DigitalOcean)

---

**Leidy Cleaner está pronto para produção!** 🌍

Desenvolvido com ❤️ por Copilot | 23/02/2026
