/**
 * pixWebhook.routes.js - Rotas para webhooks e callbacks PIX
 */

const express = require('express');
const router = express.Router();
const PLACEHOLDER = require('../controllers/PLACEHOLDER');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// POST /api/webhooks/pix - Receber webhook do banco (sem autenticação)
router.post('/', PLACEHOLDER.handlePixWebhook);

// GET /api/webhooks/pix/status/:pixTransactionId - Obter status PIX (sem autenticação)
router.get('/status/:pixTransactionId', PLACEHOLDER.getPixStatus);

// GET /api/webhooks/pix/validate/:pixTransactionId - Validar via API bancária (com autenticação)
router.get(
  '/validate/:pixTransactionId',
  PLACEHOLDER.validatePixStatus
);

// POST /api/webhooks/pix/confirm/:pixTransactionId - Confirmar manualmente (ADMIN)
router.post(
  '/confirm/:pixTransactionId',
  authenticateToken,
  authorizeRole('admin'),
  PLACEHOLDER.manuallyConfirmPix
);

// GET /api/webhooks/pix/expiring - Listar PIXs expirando (ADMIN)
router.get(
  '/expiring',
  authenticateToken,
  authorizeRole('admin'),
  PLACEHOLDER.getExpiringPixs
);

// POST /api/webhooks/pix/cleanup - Limpar PIXs expirados (ADMIN)
router.post(
  '/cleanup',
  authenticateToken,
  authorizeRole('admin'),
  PLACEHOLDER.cleanupExpiredPixs
);

module.exports = router;
