import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação de admin
router.use(authenticate);

// Dashboard e métricas gerais
router.get('/dashboard', AnalyticsController.getDashboardStats);
router.get('/metrics', AnalyticsController.getMetrics);

// Relatórios específicos
router.get('/revenue', AnalyticsController.getRevenueReport);
router.get('/users', AnalyticsController.getUserReport);
router.get('/satisfaction', AnalyticsController.getCustomerSatisfactionReport);

// Performance e dados operacionais
router.get('/staff-performance', AnalyticsController.getStaffPerformance);

// Export de dados
router.get('/export/bookings', AnalyticsController.exportBookingsCSV);

export default router;