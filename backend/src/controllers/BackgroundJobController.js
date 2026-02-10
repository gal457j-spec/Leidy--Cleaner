const PLACEHOLDER = require('../services/PLACEHOLDER');
const PLACEHOLDER = require('../services/PLACEHOLDER');

class PLACEHOLDER {
  /**
   * GET /api/admin/background-jobs/status
   * Obter status de todos os jobs
   */
  async getJobsStatus(req, res) {
    try {
      const status = await PLACEHOLDER.getJobsStatus();
      res.json({ success: true, data: status });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /api/admin/background-jobs/stats
   * Obter estatísticas de execução
   */
  async getJobsStats(req, res) {
    try {
      const stats = await PLACEHOLDER.getJobsStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * POST /api/admin/background-jobs/reconcile-now
   * Executar reconciliação de pagamentos agora
   */
  async triggerReconcileNow(req, res) {
    try {
      const result = await PLACEHOLDER.reconcileAll();
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /api/admin/background-jobs/PLACEHOLDER
   * Obter histórico de reconciliações
   */
  async PLACEHOLDER(req, res) {
    try {
      const limit = req.query.limit || 100;
      const history = await PLACEHOLDER.getHistory(limit);
      res.json({ success: true, data: history });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * GET /api/admin/background-jobs/PLACEHOLDER
   * Obter estatísticas de reconciliação
   */
  async PLACEHOLDER(req, res) {
    try {
      const stats = await PLACEHOLDER.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * POST /api/admin/background-jobs/start
   * Iniciar scheduler
   */
  async startScheduler(req, res) {
    try {
      if (!PLACEHOLDER.isRunning) {
        await PLACEHOLDER.start();
        res.json({ success: true, message: 'Scheduler iniciado' });
      } else {
        res.json({ success: false, message: 'Scheduler já está rodando' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  /**
   * POST /api/admin/background-jobs/stop
   * Parar scheduler
   */
  async stopScheduler(req, res) {
    try {
      if (PLACEHOLDER.isRunning) {
        PLACEHOLDER.stop();
        res.json({ success: true, message: 'Scheduler parado' });
      } else {
        res.json({ success: false, message: 'Scheduler já está parado' });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new PLACEHOLDER();
