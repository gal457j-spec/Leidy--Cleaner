"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const AnalyticsService_1 = require("../services/AnalyticsService");
const schemas_1 = require("../utils/schemas");
class AnalyticsController {
}
exports.AnalyticsController = AnalyticsController;
_a = AnalyticsController;
/**
 * Obtém métricas gerais de analytics
 */
AnalyticsController.getMetrics = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw (0, errorHandler_1.ApiError)('Only admins can access analytics', 403);
    }
    const { error, value } = schemas_1.analyticsQuerySchema.validate(req.query);
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    const { startDate, endDate } = value;
    const metrics = await AnalyticsService_1.AnalyticsService.getMetrics(startDate, endDate);
    res.status(200).json({
        message: 'Analytics metrics retrieved',
        data: { metrics }
    });
});
/**
 * Obtém estatísticas do dashboard
 */
AnalyticsController.getDashboardStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw (0, errorHandler_1.ApiError)('Only admins can access dashboard stats', 403);
    }
    const stats = await AnalyticsService_1.AnalyticsService.getDashboardStats();
    res.status(200).json({
        message: 'Dashboard stats retrieved',
        data: { stats }
    });
});
/**
 * Obtém performance dos funcionários
 */
AnalyticsController.getStaffPerformance = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw (0, errorHandler_1.ApiError)('Only admins can access staff performance', 403);
    }
    const performance = await AnalyticsService_1.AnalyticsService.getStaffPerformance();
    res.status(200).json({
        message: 'Staff performance retrieved',
        data: { performance }
    });
});
/**
 * Exporta bookings em CSV
 */
AnalyticsController.exportBookingsCSV = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw (0, errorHandler_1.ApiError)('Only admins can export data', 403);
    }
    const { error, value } = schemas_1.analyticsQuerySchema.validate(req.query);
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    const { startDate, endDate } = value;
    const csvData = await AnalyticsService_1.AnalyticsService.exportBookingsCSV(startDate, endDate);
    // Configurar headers para download de CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="bookings-${new Date().toISOString().split('T')[0]}.csv"`);
    res.status(200).send(csvData);
});
/**
 * Obtém relatório de receita por período
 */
AnalyticsController.getRevenueReport = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw (0, errorHandler_1.ApiError)('Only admins can access revenue reports', 403);
    }
    const { error, value } = schemas_1.analyticsQuerySchema.validate(req.query);
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    const { startDate, endDate } = value;
    const metrics = await AnalyticsService_1.AnalyticsService.getMetrics(startDate, endDate);
    // Focar apenas nos dados de receita
    const revenueData = {
        totalRevenue: metrics.totalRevenue,
        averageBookingValue: metrics.averageBookingValue,
        revenueByMonth: metrics.revenueByMonth,
        topServices: metrics.topServices
    };
    res.status(200).json({
        message: 'Revenue report retrieved',
        data: { revenue: revenueData }
    });
});
/**
 * Obtém relatório de usuários
 */
AnalyticsController.getUserReport = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw (0, errorHandler_1.ApiError)('Only admins can access user reports', 403);
    }
    const { error, value } = schemas_1.analyticsQuerySchema.validate(req.query);
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    const { startDate, endDate } = value;
    const metrics = await AnalyticsService_1.AnalyticsService.getMetrics(startDate, endDate);
    // Focar apenas nos dados de usuários
    const userData = {
        totalUsers: metrics.totalUsers,
        activeUsers: metrics.activeUsers,
        userGrowth: metrics.userGrowth
    };
    res.status(200).json({
        message: 'User report retrieved',
        data: { users: userData }
    });
});
/**
 * Obtém relatório de satisfação do cliente
 */
AnalyticsController.getCustomerSatisfactionReport = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw (0, errorHandler_1.ApiError)('Only admins can access customer satisfaction reports', 403);
    }
    const metrics = await AnalyticsService_1.AnalyticsService.getMetrics();
    // Focar apenas nos dados de satisfação
    const satisfactionData = {
        averageRating: metrics.averageRating,
        totalReviews: metrics.totalReviews,
        bookingStatusDistribution: metrics.bookingStatusDistribution
    };
    res.status(200).json({
        message: 'Customer satisfaction report retrieved',
        data: { satisfaction: satisfactionData }
    });
});
//# sourceMappingURL=AnalyticsController.js.map