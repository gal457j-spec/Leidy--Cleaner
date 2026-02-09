const express = require('express');
const router = express.Router();
const BackgroundJobController = require('../controllers/BackgroundJobController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');

/**
 * Rotas para gerenciar Background Jobs
 * Todas requerem autenticação de admin
 */

/**
 * GET /api/admin/background-jobs/status
 * Obter status de todos os jobs
 */
router.get('/status', requireAuth, requireAdmin, (req, res) =>
  BackgroundJobController.getJobsStatus(req, res)
);

/**
 * GET /api/admin/background-jobs/stats
 * Obter estatísticas de execução
 */
router.get('/stats', requireAuth, requireAdmin, (req, res) =>
  BackgroundJobController.getJobsStats(req, res)
);

/**
 * POST /api/admin/background-jobs/reconcile-now
 * Executar reconciliação de pagamentos agora
 */
router.post('/reconcile-now', requireAuth, requireAdmin, (req, res) =>
  BackgroundJobController.triggerReconcileNow(req, res)
);

/**
 * GET /api/admin/background-jobs/reconciliation-history
 * Obter histórico de reconciliações
 */
router.get('/reconciliation-history', requireAuth, requireAdmin, (req, res) =>
  BackgroundJobController.getReconciliationHistory(req, res)
);

/**
 * GET /api/admin/background-jobs/reconciliation-stats
 * Obter estatísticas de reconciliação
 */
router.get('/reconciliation-stats', requireAuth, requireAdmin, (req, res) =>
  BackgroundJobController.getReconciliationStats(req, res)
);

/**
 * POST /api/admin/background-jobs/start
 * Iniciar scheduler
 */
router.post('/start', requireAuth, requireAdmin, (req, res) =>
  BackgroundJobController.startScheduler(req, res)
);

/**
 * POST /api/admin/background-jobs/stop
 * Parar scheduler
 */
router.post('/stop', requireAuth, requireAdmin, (req, res) =>
  BackgroundJobController.stopScheduler(req, res)
);

module.exports = router;
