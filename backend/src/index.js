/**
 * Main Server Entry Point
 * Express app configuration
 */

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const webhookRoutes = require('./routes/webhooks');
const adminRoutes = require('./routes/admin');
const Scheduler = require('./utils/scheduler');
const ChatService = require('./services/ChatService');
const logger = require('./utils/logger');
const requestLoggingMiddleware = require('./middleware/requestLogging');
const path = require('path');
const { initCsrf } = require('./middleware/csrf');
const { setupEmailQueueDashboard } = require('./utils/queueDashboard');
const { ensureSchema } = require('./db/ensureSchema');

const app = express();
// ✅ CORRIGIDO: trust proxy configurado apenas se em produção com proxy real
if (process.env.NODE_ENV === 'production' && process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1); // 1 = primeiro proxy
}
const server = http.createServer(app);

// ✅ CORRIGIDO: Socket.io CORS whitelist (não aberto para "*")
const socketCorsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map(origin => origin.trim());

const io = socketIO(server, {
  cors: {
    origin: socketCorsOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ===== CHAT SERVICE =====
const chatService = new ChatService(io);

// Inicializar CSRF (gera cookie XSRF-TOKEN em GETs e valida POSTs)
initCsrf(app);

// ===== MIDDLEWARE =====
// Segurança com Helmet (CSP + HSTS explícitos)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://www.googletagmanager.com', 'https://www.google-analytics.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ['https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
      connectSrc: ["'self'", 'https://www.google-analytics.com', 'http://localhost:3001'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"]
    }
  }
}));

// HSTS para forçar HTTPS em produção
if (process.env.NODE_ENV === 'production') {
  app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
}

// ✅ CORRIGIDO: Rate limiting - Global + Específicos por rota
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite 100 requisições por IP
  message: 'Muitas requisições deste IP, tente novamente mais tarde',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health'
});

// ✅ CORRIGIDO: Limites mais rigorosos para rotas sensíveis
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Máximo 5 tentativas de login/signup em 15 min
  message: 'Muitas tentativas de acesso. Tente novamente em 15 minutos.',
  skipSuccessfulRequests: true // Reseta contador se sucesso
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 30, // 30 requisições por minuto
  message: 'Limite de requisições API excedido'
});


// CORS com configuração mais segura
const corsOptions = {
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ NOVO: Middleware de logging (estruturado e automático)
app.use(requestLoggingMiddleware);

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '..', '..', 'public')));

// ===== ROUTES =====
// Aplicar rate limiters apenas fora do ambiente de teste
// Permitir sobrescrever o comportamento de rate limit via variável de ambiente
// para facilitar execuções locais/CI sem bloquear testes.
if (process.env.NODE_ENV !== 'test' && process.env.SKIP_RATE_LIMIT !== 'true') {
  app.use(limiter);
  app.use('/api/auth', authLimiter);  // Limiter rigoroso para autenticação
  app.use('/api', apiLimiter);        // Limiter padrão para API geral
}

app.use('/api', apiRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/admin', adminRoutes);
// Também expor rotas administrativas sob /api/admin para compatibilidade com testes
app.use('/api/admin', adminRoutes);

// Servir uploads estáticos
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// ===== DB HEALTH CHECK =====
const { checkDatabase } = require('./utils/health');

app.get('/health/db', async (req, res) => {
  try {
    const dbStatus = await checkDatabase();
    if (dbStatus.ok) {
      res.json({ status: 'OK', db: dbStatus, timestamp: new Date() });
    } else {
      res.status(500).json({ status: 'ERROR', db: dbStatus, timestamp: new Date() });
    }
  } catch (err) {
    logger.error('Health DB route error', err);
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});

// ===== SERVE SPA =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  logger.error('Erro no middleware:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// ===== QUEUE DASHBOARD (Bull Board) =====
if (process.env.NODE_ENV !== 'production') {
  try {
    setupEmailQueueDashboard(app, '/queues');
  } catch (error) {
    logger.warn('Dashboard de filas não disponível', { error: error.message });
  }
}

// ===== INICIALIZAÇÃO =====
const PORT = process.env.PORT || 3001;

// Iniciar o servidor. Por padrão não iniciamos durante testes, mas suportamos
// sobrescrever esse comportamento com `START_SERVER_IN_TEST=true` para permitir
// rodar a aplicação localmente em um processo de teste.
if (process.env.NODE_ENV !== 'test' || process.env.START_SERVER_IN_TEST === 'true') {
  (async () => {
    try {
      await ensureSchema();
      logger.info('Schema do banco verificado/atualizado');
    } catch (err) {
      logger.warn('Falha ao garantir schema do banco:', err.message || err);
    }

    server.listen(PORT, () => {
      logger.info(`🚀 Servidor rodando em http://localhost:${PORT}`);
      // Inicializar scheduler automático
      try {
        Scheduler.init();
        logger.info('Scheduler inicializado com sucesso');
      } catch (err) {
        logger.error('Erro ao inicializar scheduler', err);
      }
    });
  })();
}

module.exports = app;
