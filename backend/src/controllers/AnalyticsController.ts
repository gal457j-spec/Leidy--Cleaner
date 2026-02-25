import { Response } from 'express';
import { AuthRequest, asyncHandler, ApiError } from '../middleware/errorHandler';
import { AnalyticsService } from '../services/AnalyticsService';
import { analyticsQuerySchema } from '../utils/schemas';

export class AnalyticsController {
  /**
   * Obtém métricas gerais de analytics
   */
  static getMetrics = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user!.role !== 'admin') {
      throw ApiError('Only admins can access analytics', 403);
    }

    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      throw ApiError(error.details[0].message, 400);
    }

    const { startDate, endDate } = value;
    const metrics = await AnalyticsService.getMetrics(startDate, endDate);

    res.status(200).json({
      message: 'Analytics metrics retrieved',
      data: { metrics }
    });
  });

  /**
   * Obtém estatísticas do dashboard
   */
  static getDashboardStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user!.role !== 'admin') {
      throw ApiError('Only admins can access dashboard stats', 403);
    }

    const stats = await AnalyticsService.getDashboardStats();

    res.status(200).json({
      message: 'Dashboard stats retrieved',
      data: { stats }
    });
  });

  /**
   * Obtém performance dos funcionários
   */
  static getStaffPerformance = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user!.role !== 'admin') {
      throw ApiError('Only admins can access staff performance', 403);
    }

    const performance = await AnalyticsService.getStaffPerformance();

    res.status(200).json({
      message: 'Staff performance retrieved',
      data: { performance }
    });
  });

  /**
   * Exporta bookings em CSV
   */
  static exportBookingsCSV = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user!.role !== 'admin') {
      throw ApiError('Only admins can export data', 403);
    }

    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      throw ApiError(error.details[0].message, 400);
    }

    const { startDate, endDate } = value;
    const csvData = await AnalyticsService.exportBookingsCSV(startDate, endDate);

    // Configurar headers para download de CSV
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="bookings-${new Date().toISOString().split('T')[0]}.csv"`);

    res.status(200).send(csvData);
  });

  /**
   * Obtém relatório de receita por período
   */
  static getRevenueReport = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user!.role !== 'admin') {
      throw ApiError('Only admins can access revenue reports', 403);
    }

    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      throw ApiError(error.details[0].message, 400);
    }

    const { startDate, endDate } = value;
    const metrics = await AnalyticsService.getMetrics(startDate, endDate);

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
  static getUserReport = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user!.role !== 'admin') {
      throw ApiError('Only admins can access user reports', 403);
    }

    const { error, value } = analyticsQuerySchema.validate(req.query);
    if (error) {
      throw ApiError(error.details[0].message, 400);
    }

    const { startDate, endDate } = value;
    const metrics = await AnalyticsService.getMetrics(startDate, endDate);

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
  static getCustomerSatisfactionReport = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user!.role !== 'admin') {
      throw ApiError('Only admins can access customer satisfaction reports', 403);
    }

    const metrics = await AnalyticsService.getMetrics();

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
}