# 🎯 AVAN-O: Explicação da Arquitetura

## 🤔 Por Que 2 Entradas?

**Resposta Curta**: Backend e Frontend são **aplicações separadas** (monorepo) que:
- **Rodam em portas diferentes** (Backend:3001 | Frontend:3000)
- **Têm dependências diferentes** (Node vs Next.js)
- **Deployam separadamente** em produção
- **Escalam independentemente**

---

## 📦 Estrutura do Monorepo

```
avan-o/
├── backend/               ← Express.js API
│   ├── src/
│   │   ├── index.js       (← Arquivo PRINCIPAL)
│   │   ├── routes/        (← Endpoints)
│   │   └── ...
│   └── package.json       (← Scripts: npm start)
│
├── frontend/              ← Next.js App
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── ...
│   └── package.json       (← Scripts: npm run start)
│
├── scripts/               ← Utilitários
├── Makefile              ← Comandos simplificados
├── dev.sh               ← Start All em 1 comando
└── docker-compose.dev.yml ← Docker
```

---

## 🚀 4 Formas de Rodar (Escolha a Sua)

### **Opção 1: Um Único Comando** ⭐ RECOMENDADO
```bash
bash dev.sh
# ✅ Roda frontend + backend simultaneamente
```

### **Opção 2: Make (Linux/Mac)**
```bash
make dev
# ou
make dev-pm2
```

### **Opção 3: Docker (Linux/Mac/Windows)**
```bash
docker-compose -f docker-compose.dev.yml up
```

### **Opção 4: Dois Terminais (Manual)**
```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd frontend && npm run start
```

---

## 📊 Por Que Separar?

### ✅ Vantagens

| Aspecto | Monorepo | Separado |
|---------|----------|----------|
| **Scaling** | Independente ✓ | ✓ |
| **Deploy** | Separado ✓ | ✓ |
| **Teams** | Frontend/Backend ✓ | ✓ |
| **Caching** | Cloudflare (front) + Redis (back) ✓ | ✓ |
| **CI/CD** | Testes isolados ✓ | ✓ |
| **Shared Code** | npm workspaces | Monorepo |

---

## 🎯 O Que Cada Um Faz

### 🔙 **Backend** (Express.js)
```
Porta: 3001
Função: API REST
Responsável por:
  - Autenticação (JWT)
  - Banco de dados (SQLite)
  - Lógica de negócio
  - Email/SMS (Twilio)
  - Pagamentos (Stripe/Pix)
```

### 🎨 **Frontend** (Next.js)
```
Porta: 3000
Função: UI/UX
Responsável por:
  - Renderizar páginas
  - Fazer chamadas ao backend
  - Gerenciar estado (React)
  - Cache (ISR/SSG)
  - SEO otimizado
```

---

## 📡 Como Se Comunicam?

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│              (http://localhost:3000)             │
└──────────────────┬──────────────────────────────┘
                   │ (HTTP Request)
                   ▼
┌─────────────────────────────────────────────────┐
│           Frontend Next.js :3000                 │
│  - Renderiza HTML                               │
│  - Faz fetch() para /api/...                    │
└──────────────────┬──────────────────────────────┘
                   │ (HTTP/REST via fetch/axios)
                   ▼
┌─────────────────────────────────────────────────┐
│          Backend Express :3001                   │
│  - Retorna JSON                                 │
│  - Acessa banco de dados                        │
│  - Chama APIs externas                          │
└─────────────────────────────────────────────────┘
```

---

## 🔗 URLs para Testar

| Serviço | URL | O quê |
|---------|-----|-------|
| **Frontend** | http://localhost:3000 | Website |
| **Backend** | http://localhost:3001 | API |
| **Health** | http://localhost:3001/health | Status |
| **Docs** | http://localhost:3001/api/docs | Swagger (if enabled) |

---

## 🧪 Comandos Úteis

```bash
# Instalar tudo
make install

# Rodar desenvolvimento
make dev                 # 1 terminal com tudo
make dev-pm2            # Versão PM2
make dev-docker         # Docker Compose

# Parar
make stop

# Testar
make test               # Jest tests
make test-watch        # Watch mode

# Limpar
make clean              # Remove node_modules
make db-reset           # Reset database
```

---

## ❓ FAQs

**P: Posso rodar só frontend sem backend?**  
R: Sim, mas não vai funcionar (não tem API). Rodaria em 404.

**P: Preciso de Redis?**  
R: Não é obrigatório para dev. Backend roda sem (mas ativa cache em prod).

**P: Como escalar em produção?**  
R: Deploy separado:
- Frontend → Vercel/Netlify
- Backend → Railway/Heroku/AWS

**P: Qual é melhor: dev.sh, make ou docker?**  
R: Recomendação:
- Local dev: `make dev` (simples)
- Produção: Docker (isolado)
- PM2: Para 24/7 running

**P: Preciso de 2 terminals se usar docker?**  
R: Não! Docker rode tudo junto.

---

## 🎯 Resumo

| Método | Terminal | Comando |
|--------|----------|---------|
| **Simples** | 1 | `bash dev.sh` |
| **Make** | 1 | `make dev` |
| **PM2** | 1 | `make dev-pm2` |
| **Docker** | 1 | `make dev-docker` |
| **Manual** | 2 | Terminal A + B |

**Escolha sua: todas funcionam! 🎉**
