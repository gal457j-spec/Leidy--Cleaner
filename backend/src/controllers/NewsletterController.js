/**
 * Newsletter Controller
 * Gerencia inscrições de newsletter
 */

const { getDb } = require('../db/sqlite');
const EmailService = require('../services/EmailService');
const logger = require('../utils/logger');

class NewsletterController {
  /**
   * Inscrever email na newsletter
   * POST /api/newsletter/subscribe
   */
  static async subscribe(req, res) {
    try {
      const { email, name } = req.body;

      // Validar email
      if (!email || !this.isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
      }

      // Validar nome (opcional)
      if (name && typeof name !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Nome deve ser texto'
        });
      }

      // Verificar se já existe
      const db = await getDb();
      const existing = await db.get(
        'SELECT id FROM newsletter_subscribers WHERE email = ?',
        email
      );

      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Email já inscrito na newsletter'
        });
      }

      // Criar inscrição
      const id = Math.random().toString(36).substr(2, 9);
      const subscribedAt = new Date().toISOString();

      await db.run(
        `INSERT INTO newsletter_subscribers (id, email, name, status, subscribedAt, unsubscribedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        id,
        email.toLowerCase(),
        name || null,
        'active',
        subscribedAt,
        null
      );

      // Enviar email de confirmação
      try {
        const emailService = new EmailService();
        await emailService.sendNewsletterWelcome(email, name);
        logger.info(`Newsletter subscription: ${email}`);
      } catch (emailError) {
        logger.warn(`Email envio falhou mas inscrição foi salva: ${email}`, emailError);
        // Não falhar se o email não conseguir enviar
      }

      return res.status(201).json({
        success: true,
        message: 'Inscrito na newsletter com sucesso!',
        data: {
          id,
          email,
          name: name || null,
          subscribedAt
        }
      });
    } catch (error) {
      logger.error('Erro ao inscrever newsletter:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao inscrever. Tente novamente.'
      });
    }
  }

  /**
   * Desinscrever da newsletter
   * POST /api/newsletter/unsubscribe
   */
  static async unsubscribe(req, res) {
    try {
      const { email } = req.body;

      if (!email || !this.isValidEmail(email)) {
        return res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
      }

      const db = await getDb();
      
      // Verificar se existe
      const subscriber = await db.get(
        'SELECT id FROM newsletter_subscribers WHERE email = ?',
        email.toLowerCase()
      );

      if (!subscriber) {
        return res.status(404).json({
          success: false,
          message: 'Email não encontrado na newsletter'
        });
      }

      // Atualizar status
      const unsubscribedAt = new Date().toISOString();
      await db.run(
        'UPDATE newsletter_subscribers SET status = ?, unsubscribedAt = ? WHERE email = ?',
        'unsubscribed',
        unsubscribedAt,
        email.toLowerCase()
      );

      logger.info(`Newsletter unsubscription: ${email}`);

      return res.json({
        success: true,
        message: 'Desinscrito da newsletter.'
      });
    } catch (error) {
      logger.error('Erro ao desinscrever newsletter:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao desinscrever. Tente novamente.'
      });
    }
  }

  /**
   * Validar formato de email
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Listar inscritos (admin only)
   * GET /api/newsletter/subscribers
   */
  static async getSubscribers(req, res) {
    try {
      const { status = 'active', page = 1, limit = 50 } = req.query;

      const db = await getDb();
      
      const offset = (page - 1) * limit;
      
      let query = 'SELECT * FROM newsletter_subscribers';
      const params = [];

      if (status && status !== 'all') {
        query += ' WHERE status = ?';
        params.push(status);
      }

      query += ' ORDER BY subscribedAt DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const subscribers = await db.all(query, params);

      // Contar total
      let countQuery = 'SELECT COUNT(*) as total FROM newsletter_subscribers';
      if (status && status !== 'all') {
        countQuery += ' WHERE status = ?';
      }
      const countResult = await db.get(
        countQuery,
        status && status !== 'all' ? [status] : []
      );

      return res.json({
        success: true,
        data: subscribers,
        pagination: {
          total: countResult.total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(countResult.total / limit)
        }
      });
    } catch (error) {
      logger.error('Erro ao listar inscritos:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar inscritos.'
      });
    }
  }

  /**
   * Enviar email para todos os inscritos (admin only)
   * POST /api/newsletter/send-all
   */
  static async sendToAll(req, res) {
    try {
      const { subject, htmlContent, textContent } = req.body;

      if (!subject || !htmlContent) {
        return res.status(400).json({
          success: false,
          message: 'Subject e htmlContent são obrigatórios'
        });
      }

      const db = await getDb();
      
      // Obter todos os inscritos ativos
      const subscribers = await db.all(
        'SELECT email, name FROM newsletter_subscribers WHERE status = ? ORDER BY subscribedAt DESC',
        'active'
      );

      if (subscribers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Nenhum inscritor ativo encontrado'
        });
      }

      // Enviar para todos (usar fila se implementada)
      const emailService = new EmailService();
      let sent = 0;
      let failed = 0;

      for (const subscriber of subscribers) {
        try {
          await emailService.sendBulkNewsletter(
            subscriber.email,
            subscriber.name || 'Leitor',
            subject,
            htmlContent,
            textContent
          );
          sent++;
        } catch (error) {
          logger.warn(`Falha ao enviar para ${subscriber.email}:`, error.message);
          failed++;
        }
      }

      logger.info(`Newsletter enviado: ${sent} enviados, ${failed} falhas`);

      return res.json({
        success: true,
        message: 'Newsletter enviado',
        stats: {
          total: subscribers.length,
          sent,
          failed
        }
      });
    } catch (error) {
      logger.error('Erro ao enviar newsletter:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar newsletter.'
      });
    }
  }

  /**
   * Estatísticas da newsletter (admin only)
   * GET /api/newsletter/stats
   */
  static async getStats(req, res) {
    try {
      const db = await getDb();

      const totalActive = await db.get(
        'SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = ?',
        'active'
      );

      const totalUnsubscribed = await db.get(
        'SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = ?',
        'unsubscribed'
      );

      const totalAll = await db.get(
        'SELECT COUNT(*) as count FROM newsletter_subscribers'
      );

      const recentSubscribers = await db.all(
        'SELECT email, name, subscribedAt FROM newsletter_subscribers WHERE status = ? ORDER BY subscribedAt DESC LIMIT 10',
        'active'
      );

      return res.json({
        success: true,
        data: {
          total: totalAll.count,
          active: totalActive.count,
          unsubscribed: totalUnsubscribed.count,
          engagementRate: (totalActive.count / totalAll.count * 100).toFixed(2),
          recentSubscribers
        }
      });
    } catch (error) {
      logger.error('Erro ao obter stats da newsletter:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao obter estatísticas.'
      });
    }
  }
}

module.exports = NewsletterController;
