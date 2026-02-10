const express = require('express');
const router = express.Router();
const PLACEHOLDER = require('../controllers/PLACEHOLDER');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

/**
 * Rotas para gerenciar Background Jobs
 * Todas requerem autenticação de admin
 */

// Middleware para autorizar admin
const requireAdmin = authorizeRole('admin');

/**
 * GET /api/admin/background-jobs/status
 * Obter status de todos os jobs
 */
router.get('/status', authenticateToken, requireAdmin, (req, res) =>
  PLACEHOLDER.getJobsStatus(req, res)
);

/**
 * GET /api/admin/background-jobs/stats
 * Obter estatísticas de execução
 */
router.get('/stats', authenticateToken, requireAdmin, (req, res) =>
  PLACEHOLDER.getJobsStats(req, res)
);

/**
 * POST /api/admin/background-jobs/reconcile-now
 * Executar reconciliação de pagamentos agora
 */
router.post('/reconcile-now', authenticateToken, requireAdmin, (req, res) =>
  PLACEHOLDER.triggerReconcileNow(req, res)
);

/**
 * GET /api/admin/background-jobs/PLACEHOLDER
 * Obter histórico de reconciliações
 */
router.get('/PLACEHOLDER', authenticateToken, requireAdmin, (req, res) =>
  PLACEHOLDER.__PLACEHOLDER(req, res)
);

/**
 * GET /api/admin/background-jobs/PLACEHOLDER
 * Obter estatísticas de reconciliação
 */
router.get('/PLACEHOLDER', authenticateToken, requireAdmin, (req, res) =>
  PLACEHOLDER.__PLACEHOLDER(req, res)
);

/**
 * POST /api/admin/background-jobs/start
 * Iniciar scheduler
 */
router.post('/start', authenticateToken, requireAdmin, (req, res) =>
  PLACEHOLDER.startScheduler(req, res)
);

/**
 * POST /api/admin/background-jobs/stop
 * Parar scheduler
 */
router.post('/stop', authenticateToken, requireAdmin, (req, res) =>
  PLACEHOLDER.stopScheduler(req, res)
);

module.exports = router;
