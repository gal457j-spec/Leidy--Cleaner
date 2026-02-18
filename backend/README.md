# Vammos Backend API

Backend TypeScript/Express para plataforma de serviços de limpeza empresarial.

## Recursos

- ✅ Autenticação JWT com refresh tokens
- ✅ Role-based access control (User/Admin)
- ✅ CRUD de serviços
- ✅ Sistema de bookings
- ✅ Informações da empresa
- ✅ Testes integrados (Jest + Supertest)
- ✅ Migrations automáticas (PostgreSQL)
- ✅ Rate limiting e segurança (Helmet, CORS)

## Endpoints Principais

### Autenticação
- `POST /api/v1/auth/register` — registrar usuário
- `POST /api/v1/auth/login` — login
- `POST /api/v1/auth/refresh-token` — renovar token
- `GET /api/v1/auth/me` — perfil do usuário (autenticado)
- `PUT /api/v1/auth/me` — atualizar perfil

### Serviços
- `GET /api/v1/services` — listar serviços (com paginação/filtros)
- `GET /api/v1/services/:id` — detalhes do serviço
- `GET /api/v1/services/categories` — categorias disponíveis
- `POST /api/v1/services` — criar serviço (admin only)
- `PUT /api/v1/services/:id` — atualizar serviço (admin only)
- `DELETE /api/v1/services/:id` — deletar serviço (admin only)

### Bookings
- `POST /api/v1/bookings` — criar booking (usuário autenticado)
- `GET /api/v1/bookings` — listar bookings do usuário
- `GET /api/v1/bookings/:id` — detalhes do booking (dono ou admin)
- `PUT /api/v1/bookings/:id/status` — atualizar status (admin only)
- `DELETE /api/v1/bookings/:id` — deletar booking (dono ou admin)

### Empresa
- `GET /api/v1/company` — informações públicas da empresa

## Configuração

### Variáveis de Ambiente

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=vammos_dev
DB_USER=vammos
DB_PASSWORD=vammos_pass

# JWT
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Empresa
COMPANY_NAME=Vammos Serviços
COMPANY_EMAIL=contato@vammos.com
COMPANY_PHONE=+55 11 4000-0000
ADMIN_PASSWORD=admin123456
```

## Executar Localmente

```bash
# Instalar dependências
npm install

# Rodar migrations
npm run migrate

# Seed (dados padrão)
npm run seed

# Desenvolvimento (watch mode)
npm run dev

# Build para produção
npm run build

# Executar produção
npm run start
```

## Testes

```bash
# Testes (requere Postgres rodando)
DB_HOST=localhost DB_PORT=5432 DB_NAME=chega_test DB_USER=postgres DB_PASSWORD=postgres npm test

# Testes em watch mode
npm run test:watch
```

## Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/       # Lógica de requisição/resposta
│   ├── services/          # Lógica de negócio
│   ├── routes/            # Definição de rotas
│   ├── middleware/        # Autenticação, error handling
│   ├── utils/             # Database, JWT, password hashing
│   ├── types/             # TypeScript interfaces
│   ├── db/                # Migrations e seeding
│   └── main.ts            # Entrada da aplicação
├── migrations/            # SQL migrations
└── jest.config.js         # Configuração de testes
```

## Dados Padrão (Seed)

O seed popula automaticamente:
- Usuário admin: `admin@vammos.com` / `admin123456`
- 8 serviços de limpeza padrão (Residencial, Comercial, Especializada, etc)
- Informações da empresa (nome, email, endereço, etc)

> Use `SKIP_ADMIN_SEED=true` durante testes para evitar criação do usuário admin.

## Stack Tecnológico

- **Runtime**: Node.js 20 + TypeScript
- **Web**: Express.js
- **Database**: PostgreSQL 15
- **Auth**: JWT + bcryptjs
- **Validation**: Joi
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston

## Segurança

- ✅ Senhas hasheadas com bcryptjs
- ✅ JWT com refresh tokens
- ✅ Rate limiting por IP
- ✅ CORS configurado
- ✅ Helmet headers de segurança
- ✅ Validação de input (Joi)
- ✅ SQL parameterizado (sem injection)
