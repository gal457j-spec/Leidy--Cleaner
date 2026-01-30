/**
 * Admin Routes
 * Rotas administrativas
 */

const express = require('express');
const router = express.Router();

const { authenticateToken, authorizeRole } = require('../middleware/auth');

/**
 * Dashboard - Métricas
 */
router.get('/dashboard', authenticateToken, authorizeRole(['admin']), (req, res) => {
  try {
    const metrics = {
      totalBookings: 342,
      revenue: 45280.50,
      customers: 156,
      teamMembers: 12,
      satisfaction: 4.7,
      todaysScheduled: 8,
      pendingReviews: 23,
    };
    res.json({ success: true, metrics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Gestão de Equipa
 */
router.get('/team', authenticateToken, authorizeRole(['admin']), (req, res) => {
  try {
    // Listar membros da equipa
    res.json({ success: true, team: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/team', authenticateToken, authorizeRole(['admin']), (req, res) => {
  try {
    // Adicionar membro
    res.json({ success: true, message: 'Membro adicionado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Gestão de Serviços
 */
router.get('/services', authenticateToken, authorizeRole(['admin']), (req, res) => {
  try {
    // Listar serviços
    res.json({ success: true, services: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/services', authenticateToken, authorizeRole(['admin']), (req, res) => {
  try {
    // Criar serviço
    res.json({ success: true, message: 'Serviço criado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Relatórios
 */
router.get('/reports/financial', authenticateToken, authorizeRole(['admin']), (req, res) => {
  try {
    const report = {
      period: 'monthly',
      revenue: 45280.50,
      expenses: 12500,
      profit: 32780.50,
      averageTransactionValue: 132.45,
    };
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/reports/performance', authenticateToken, authorizeRole(['admin']), (req, res) => {
  try {
    const report = {
      totalBookings: 342,
      completedBookings: 335,
      cancelledBookings: 7,
      averageRating: 4.7,
      teamUtilization: 87,
    };
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
