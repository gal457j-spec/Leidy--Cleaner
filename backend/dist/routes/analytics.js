"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AnalyticsController_1 = require("../controllers/AnalyticsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas as rotas requerem autenticação de admin
router.use(auth_1.authenticate);
// Dashboard e métricas gerais
router.get('/dashboard', AnalyticsController_1.AnalyticsController.getDashboardStats);
router.get('/metrics', AnalyticsController_1.AnalyticsController.getMetrics);
// Relatórios específicos
router.get('/revenue', AnalyticsController_1.AnalyticsController.getRevenueReport);
router.get('/users', AnalyticsController_1.AnalyticsController.getUserReport);
router.get('/satisfaction', AnalyticsController_1.AnalyticsController.getCustomerSatisfactionReport);
// Performance e dados operacionais
router.get('/staff-performance', AnalyticsController_1.AnalyticsController.getStaffPerformance);
// Export de dados
router.get('/export/bookings', AnalyticsController_1.AnalyticsController.exportBookingsCSV);
exports.default = router;
//# sourceMappingURL=analytics.js.map