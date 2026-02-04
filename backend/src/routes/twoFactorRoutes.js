/**
 * 2FA Routes - Configurar, verificar e gerenciar 2FA
 * POST /api/auth/2fa/setup - Iniciar setup
 * POST /api/auth/2fa/confirm - Confirmar com token
 * POST /api/auth/2fa/disable - Desabilitar
 * POST /api/auth/2fa/verify - Verificar token no login
 */

const express = require('express');
const router = express.Router();
const TwoFactorAuth = require('../middleware/twoFactorAuth');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

/**
 * GET /api/auth/2fa/status
 * Verificar se 2FA está ativado
 */
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const db = require('../db');
    const user = await db.get('SELECT two_fa_enabled FROM users WHERE id = ?', req.user.id);

    res.json({
      success: true,
      enabled: user.two_fa_enabled === 1
    });
  } catch (err) {
    logger.error('2FA status check failed', err);
    res.status(500).json({ success: false, error: 'Erro ao verificar status' });
  }
});

/**
 * POST /api/auth/2fa/setup
 * Iniciar setup de 2FA com QR code
 * Body: { }
 */
router.post('/setup', authenticateToken, async (req, res) => {
  try {
    const result = await TwoFactorAuth.setupTwoFactor(req.user.id);

    if (!result.success) {
      return res.status(400).json(result);
    }

    logger.info('2FA setup initiated', { userId: req.user.id });

    res.json({
      success: true,
      qrCode: result.qrCode,
      secret: result.secret,
      backupCodes: result.backupCodes,
      message: 'Escaneie o código QR e salve os códigos de backup'
    });
  } catch (err) {
    logger.error('2FA setup error', err);
    res.status(500).json({ success: false, error: 'Erro ao iniciar setup' });
  }
});

/**
 * POST /api/auth/2fa/confirm
 * Confirmar 2FA com token
 * Body: { token: "123456" }
 */
router.post('/confirm', authenticateToken, async (req, res) => {
  try {
    const { token } = req.body;

    if (!token || token.length !== 6) {
      return res.status(400).json({
        success: false,
        error: 'Token inválido (deve ter 6 dígitos)'
      });
    }

    const result = await TwoFactorAuth.confirmTwoFactor(req.user.id, token);

    if (!result.success) {
      return res.status(400).json(result);
    }

    logger.info('2FA confirmed', { userId: req.user.id });

    res.json({
      success: true,
      message: 'Autenticação de dois fatores ativada com sucesso!'
    });
  } catch (err) {
    logger.error('2FA confirm error', err);
    res.status(500).json({ success: false, error: 'Erro ao confirmar' });
  }
});

/**
 * POST /api/auth/2fa/verify
 * Verificar token durante login (depois de email/senha corretos)
 * Body: { userId, token, useBackupCode }
 */
router.post('/verify', async (req, res) => {
  try {
    const { userId, token, useBackupCode = false } = req.body;

    if (!userId || !token) {
      return res.status(400).json({ success: false, error: 'Dados incompletos' });
    }

    const result = await TwoFactorAuth.verifyLogin2FA(
      userId,
      token,
      useBackupCode
    );

    if (!result.success) {
      return res.status(400).json(result);
    }

    logger.info('2FA login verification passed', { userId });

    res.json({
      success: true,
      verified: true,
      message: 'Autenticação bem-sucedida'
    });
  } catch (err) {
    logger.error('2FA verify error', err);
    res.status(500).json({ success: false, error: 'Erro na verificação' });
  }
});

/**
 * POST /api/auth/2fa/disable
 * Desabilitar 2FA
 * Body: { password }
 */
router.post('/disable', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: 'Senha necessária para desabilitar 2FA'
      });
    }

    const result = await TwoFactorAuth.disableTwoFactor(req.user.id, password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    logger.info('2FA disabled', { userId: req.user.id });

    res.json({
      success: true,
      message: 'Autenticação de dois fatores desativada'
    });
  } catch (err) {
    logger.error('2FA disable error', err);
    res.status(500).json({ success: false, error: 'Erro ao desabilitar' });
  }
});

/**
 * GET /api/auth/2fa/backup-codes
 * Gerar novos códigos de backup
 */
router.get('/backup-codes', authenticateToken, async (req, res) => {
  try {
    const newCodes = TwoFactorAuth.generateBackupCodes();

    const db = require('../db');
    await db.run(
      'UPDATE users SET two_fa_backup_codes = ? WHERE id = ?',
      JSON.stringify(newCodes),
      req.user.id
    );

    logger.info('Backup codes regenerated', { userId: req.user.id });

    res.json({
      success: true,
      backupCodes: newCodes,
      message: 'Novos códigos de backup gerados. Salve com segurança!'
    });
  } catch (err) {
    logger.error('Backup codes generation failed', err);
    res.status(500).json({ success: false, error: 'Erro ao gerar códigos' });
  }
});

module.exports = router;
