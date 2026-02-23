# Production Docker Deployment Guide

## Setup Rápido

### 1. Build e Deploy com Docker Compose

```bash
cd /workspaces/Leidy-cleaner

# Build all images
docker-compose -f docker-compose.prod.yml build

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f nginx
```

### 2. Acesso

```
http://localhost:80  (HTTP)
```

Não precisa mais de 2 portas! Tudo funciona em **porta 80** (ou 443 HTTPS).

---

## Arquitetura

```
Usuario
   ↓
Nginx Reverse Proxy (porta 80)
   ├─ /api/v1/* → Backend API (3001)
   └─ /* → Frontend Next.js (3000)
```

**Vantagens:**
- ✅ Uma porta única para usuários
- ✅ Compressão GZIP automática
- ✅ Cache de assets estáticos
- ✅ Headers de segurança
- ✅ Pronto para HTTPS

---

## HTTPS (SSL/TLS)

### Auto com Let's Encrypt (Recomendado para Produção)

```bash
# Gerar certificado (certbot)
sudo certbot certonly --standalone -d seu-dominio.com

# Copiar certs
cp /etc/letsencrypt/live/seu-dominio.com/fullchain.pem ./certs/cert.pem
cp /etc/letsencrypt/live/seu-dominio.com/privkey.pem ./certs/key.pem

# Descomentar seção HTTPS em nginx.prod.conf
# Substituir "seu-dominio.com" pelo domínio real
```

### Ou Manual

```bash
# Gerar auto-signed cert (testes)
mkdir -p certs
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes
```

Então descomentar HTTPS em `nginx.prod.conf`.

---

## Variáveis de Ambiente

Criar `.env`:

```env
NODE_ENV=production
JWT_SECRET=sua-chave-super-secreta-aqui
DB_TYPE=sqlite
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLIC_KEY=pk_live_xxx
```

Atualizar `docker-compose.prod.yml`:

```yaml
environment:
  - JWT_SECRET=${JWT_SECRET}
  - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
```

---

## Healthchecks

Endpoints de saúde:

```bash
# Nginx
curl http://localhost/health

# API
curl http://localhost/api/v1/health

# Ambos devem retornar 200 OK
```

---

## Scaling (Future)

Se precisar:

```bash
# Com Kubernetes
kubectl apply -f k8s/

# Ou com Docker Swarm
docker swarm init
docker stack deploy -c docker-compose.prod.yml leidy
```

---

## Troubleshooting

```bash
# Ver logs
docker-compose -f docker-compose.prod.yml logs nginx
docker-compose -f docker-compose.prod.yml logs api
docker-compose -f docker-compose.prod.yml logs web

# Restart
docker-compose -f docker-compose.prod.yml restart

# Stop
docker-compose -f docker-compose.prod.yml down

# Remove volumes (cuidado!)
docker-compose -f docker-compose.prod.yml down -v
```

---

## Deploy em Hosting

### Opção 1: Railway
```bash
railway link
railway deploy
```

### Opção 2: Render
- Conectar GitHub repo
- Criar Web Service
- Apontar para `docker-compose.prod.yml`

### Opção 3: AWS/DigitalOcean/Azure
- VM com Docker + Docker Compose
- Run: `docker-compose -f docker-compose.prod.yml up -d`

---

**Agora sim: UMA PORTA, MÚLTIPLAS APLICAÇÕES! 🚀**
