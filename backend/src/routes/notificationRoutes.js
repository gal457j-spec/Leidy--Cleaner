/**
 * notificationRoutes.js
 * Routes for notification preferences and history
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

module.exports = (db, notificationService) => {
  /**
   * GET /api/notifications/preferences/:userId
   * Get user notification preferences
   */
  router.get('/preferences/:userId', authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;

      // Verify user can only access their own preferences
      if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      const prefs = await notificationService.getPreferences(userId);
      res.json(prefs);
    } catch (err) {
      console.error('Error fetching preferences:', err);
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * PUT /api/notifications/preferences/:userId
   * Update user notification preferences
   */
  router.put('/preferences/:userId', authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;

      if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      const preferences = req.body;

      // Validate phone number if provided
      if (preferences.phone_number) {
        // Accept various phone formats: +55 51 98030-3740, 5551980303740, 51980303740
        const phoneRegex = /^(\+\d{1,3})?[\s.-]?\d{1,14}$/;
        if (!phoneRegex.test(preferences.phone_number.replace(/[\s.-]/g, ''))) {
          return res.status(400).json({ error: 'Formato de telefone inválido' });
        }
      }

      await notificationService.updatePreferences(userId, preferences);

      res.json({
        success: true,
        message: 'Preferências atualizadas com sucesso!',
        preferences
      });
    } catch (err) {
      console.error('Error updating preferences:', err);
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/notifications/history/:userId
   * Get notification history
   */
  router.get('/history/:userId', authenticateToken, async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = 20, offset = 0, type } = req.query;

      if (req.user.id !== parseInt(userId) && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Não autorizado' });
      }

      let query = 'SELECT * FROM notification_logs WHERE userId = ?';
      const params = [userId];

      if (type) {
        query += ' AND type = ?';
        params.push(type);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), parseInt(offset));

      const logs = await db.all(query, params);

      const total = await db.get(
        'SELECT COUNT(*) as count FROM notification_logs WHERE userId = ?',
        [userId]
      );

      res.json({ logs, total: total.count, limit, offset });
    } catch (err) {
      console.error('Error fetching history:', err);
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/notifications/test
   * Send test notification to user (admin/dev only)
   */
  router.post('/test', authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Apenas admin pode enviar notificações de teste' });
      }

      const { userId, type = 'whatsapp' } = req.body;

      const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const prefs = await notificationService.getPreferences(userId);

      if (!prefs.phone_number) {
        return res.status(400).json({ error: 'Usuário não tem número de telefone configurado' });
      }

      const testMessage = `✅ Teste de notificação!\n\nOlá ${user.firstName || user.name},\n\nEstá é uma mensagem de teste para validar se as notificações estão funcionando corretamente!\n\nLeidy Cleaner`;

      if (type === 'whatsapp') {
        await notificationService.sendWhatsApp(prefs.phone_number, testMessage);
      } else if (type === 'sms') {
        await notificationService.sendSMS(prefs.phone_number, testMessage);
      }

      res.json({ success: true, message: `${type} de teste enviado com sucesso!` });
    } catch (err) {
      console.error('Error sending test notification:', err);
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/notifications/queue-status
   * Check queue status (admin only)
   */
  router.get('/queue-status', authenticateToken, async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso restrito a admin' });
      }

      const status = await db.get(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as sent,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed
        FROM notification_queue
      `);

      res.json(status);
    } catch (err) {
      console.error('Error checking queue status:', err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};
