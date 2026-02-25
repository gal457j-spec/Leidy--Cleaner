"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const database_1 = require("../utils/database");
const logger_advanced_1 = require("../utils/logger-advanced");
class AnalyticsService {
    /**
     * Obtém métricas gerais de analytics
     */
    static async getMetrics(startDate, endDate) {
        try {
            const dateFilter = startDate && endDate
                ? `WHERE created_at BETWEEN '${startDate}' AND '${endDate}'`
                : '';
            // Usuários
            const usersResult = await (0, database_1.query)('SELECT COUNT(*) as count FROM users');
            const activeUsersResult = await (0, database_1.query)("SELECT COUNT(*) as count FROM users WHERE last_login > NOW() - INTERVAL '30 days'");
            // Bookings
            const bookingsResult = await (0, database_1.query)(`SELECT COUNT(*) as count FROM bookings ${dateFilter.replace('created_at', 'created_at')}`);
            const completedResult = await (0, database_1.query)(`SELECT COUNT(*) as count FROM bookings WHERE status = 'completed' ${dateFilter ? 'AND ' + dateFilter.replace('WHERE', '').replace('created_at', 'created_at') : ''}`);
            const cancelledResult = await (0, database_1.query)(`SELECT COUNT(*) as count FROM bookings WHERE status = 'cancelled' ${dateFilter ? 'AND ' + dateFilter.replace('WHERE', '').replace('created_at', 'created_at') : ''}`);
            // Receita
            const revenueResult = await (0, database_1.query)(`
        SELECT COALESCE(SUM(total_price), 0) as revenue,
               COUNT(*) as booking_count
        FROM bookings
        WHERE status = 'completed' ${dateFilter ? 'AND ' + dateFilter.replace('WHERE', '').replace('created_at', 'created_at') : ''}
      `);
            // Serviços mais populares
            const topServicesResult = await (0, database_1.query)(`
        SELECT s.name, COUNT(b.id) as count, COALESCE(SUM(b.total_price), 0) as revenue
        FROM services s
        LEFT JOIN bookings b ON b.service_id = s.id AND b.status = 'completed'
        GROUP BY s.id, s.name
        ORDER BY count DESC
        LIMIT 10
      `);
            // Receita por mês
            const revenueByMonthResult = await (0, database_1.query)(`
        SELECT
          TO_CHAR(created_at, 'YYYY-MM') as month,
          COALESCE(SUM(total_price), 0) as revenue,
          COUNT(*) as bookings
        FROM bookings
        WHERE status = 'completed'
        GROUP BY TO_CHAR(created_at, 'YYYY-MM')
        ORDER BY month DESC
        LIMIT 12
      `);
            // Crescimento de usuários
            const userGrowthResult = await (0, database_1.query)(`
        SELECT
          TO_CHAR(created_at, 'YYYY-MM') as month,
          COUNT(*) as new_users,
          SUM(COUNT(*)) OVER (ORDER BY TO_CHAR(created_at, 'YYYY-MM')) as total_users
        FROM users
        GROUP BY TO_CHAR(created_at, 'YYYY-MM')
        ORDER BY month DESC
        LIMIT 12
      `);
            // Distribuição de status
            const statusDistributionResult = await (0, database_1.query)(`
        SELECT status, COUNT(*) as count
        FROM bookings
        GROUP BY status
      `);
            // Reviews
            const reviewsResult = await (0, database_1.query)(`
        SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
        FROM reviews
        WHERE is_approved = true
      `);
            const statusDistribution = {};
            statusDistributionResult.forEach((row) => {
                statusDistribution[row.status] = parseInt(row.count);
            });
            return {
                totalUsers: parseInt(usersResult[0].count),
                activeUsers: parseInt(activeUsersResult[0].count),
                totalBookings: parseInt(bookingsResult[0].count),
                completedBookings: parseInt(completedResult[0].count),
                cancelledBookings: parseInt(cancelledResult[0].count),
                totalRevenue: parseFloat(revenueResult[0].revenue),
                averageBookingValue: revenueResult[0].booking_count > 0
                    ? parseFloat(revenueResult[0].revenue) / parseInt(revenueResult[0].booking_count)
                    : 0,
                topServices: topServicesResult.map((row) => ({
                    name: row.name,
                    count: parseInt(row.count),
                    revenue: parseFloat(row.revenue)
                })),
                revenueByMonth: revenueByMonthResult.map((row) => ({
                    month: row.month,
                    revenue: parseFloat(row.revenue),
                    bookings: parseInt(row.bookings)
                })),
                userGrowth: userGrowthResult.map((row) => ({
                    month: row.month,
                    newUsers: parseInt(row.new_users),
                    totalUsers: parseInt(row.total_users)
                })),
                bookingStatusDistribution: statusDistribution,
                averageRating: parseFloat(reviewsResult[0].avg_rating || 0),
                totalReviews: parseInt(reviewsResult[0].total_reviews || 0)
            };
        }
        catch (error) {
            logger_advanced_1.logger.error('Error getting analytics metrics:', error);
            throw new Error('Failed to get analytics metrics');
        }
    }
    /**
     * Obtém estatísticas do dashboard
     */
    static async getDashboardStats() {
        try {
            // Bookings de hoje
            const todayBookingsResult = await (0, database_1.query)(`
        SELECT COUNT(*) as count
        FROM bookings
        WHERE DATE(created_at) = CURRENT_DATE
      `);
            // Receita de hoje
            const todayRevenueResult = await (0, database_1.query)(`
        SELECT COALESCE(SUM(total_price), 0) as revenue
        FROM bookings
        WHERE DATE(created_at) = CURRENT_DATE AND status = 'completed'
      `);
            // Bookings pendentes
            const pendingBookingsResult = await (0, database_1.query)(`
        SELECT COUNT(*) as count
        FROM bookings
        WHERE status IN ('pending', 'confirmed')
      `);
            // Chats ativos (últimas 24h)
            const activeChatsResult = await (0, database_1.query)(`
        SELECT COUNT(*) as count
        FROM chat_rooms
        WHERE updated_at > NOW() - INTERVAL '24 hours'
      `);
            // Verificar saúde do sistema
            const alerts = [];
            let systemHealth = 'healthy';
            // Verificar se há bookings sem staff atribuído
            const unassignedBookings = await (0, database_1.query)(`
        SELECT COUNT(*) as count
        FROM bookings
        WHERE status = 'confirmed' AND (team_member_id IS NULL OR team_member_id = '')
      `);
            if (parseInt(unassignedBookings[0].count) > 0) {
                alerts.push(`${unassignedBookings[0].count} bookings sem staff atribuído`);
                systemHealth = 'warning';
            }
            // Verificar reviews pendentes
            const pendingReviews = await (0, database_1.query)(`
        SELECT COUNT(*) as count
        FROM reviews
        WHERE is_approved = false
      `);
            if (parseInt(pendingReviews[0].count) > 10) {
                alerts.push(`${pendingReviews[0].count} reviews aguardando aprovação`);
                if (systemHealth === 'warning') {
                    systemHealth = 'critical';
                }
                else {
                    systemHealth = 'warning';
                }
            }
            return {
                todayBookings: parseInt(todayBookingsResult[0].count),
                todayRevenue: parseFloat(todayRevenueResult[0].revenue),
                pendingBookings: parseInt(pendingBookingsResult[0].count),
                activeChats: parseInt(activeChatsResult[0].count),
                systemHealth,
                alerts
            };
        }
        catch (error) {
            logger_advanced_1.logger.error('Error getting dashboard stats:', error);
            throw new Error('Failed to get dashboard stats');
        }
    }
    /**
     * Gera relatório de performance de staff
     */
    static async getStaffPerformance() {
        try {
            const result = await (0, database_1.query)(`
        SELECT
          u.id as staff_id,
          u.name as staff_name,
          COUNT(b.id) as total_bookings,
          COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
          AVG(r.rating) as average_rating,
          COALESCE(SUM(b.total_price), 0) as total_revenue,
          CASE
            WHEN COUNT(b.id) > 0 THEN ROUND(COUNT(CASE WHEN b.status = 'completed' THEN 1 END)::decimal / COUNT(b.id) * 100, 2)
            ELSE 0
          END as efficiency
        FROM users u
        LEFT JOIN bookings b ON b.team_member_id = u.id
        LEFT JOIN reviews r ON r.booking_id = b.id AND r.is_approved = true
        WHERE u.role = 'staff'
        GROUP BY u.id, u.name
        ORDER BY total_bookings DESC
      `);
            return result.map((row) => ({
                staffId: row.staff_id,
                staffName: row.staff_name,
                totalBookings: parseInt(row.total_bookings),
                completedBookings: parseInt(row.completed_bookings),
                averageRating: parseFloat(row.average_rating || 0),
                totalRevenue: parseFloat(row.total_revenue),
                efficiency: parseFloat(row.efficiency)
            }));
        }
        catch (error) {
            logger_advanced_1.logger.error('Error getting staff performance:', error);
            throw new Error('Failed to get staff performance');
        }
    }
    /**
     * Exporta dados para CSV
     */
    static async exportBookingsCSV(startDate, endDate) {
        try {
            const dateFilter = startDate && endDate
                ? `WHERE b.created_at BETWEEN '${startDate}' AND '${endDate}'`
                : '';
            const result = await (0, database_1.query)(`
        SELECT
          b.id,
          b.scheduled_date,
          b.status,
          b.total_price,
          b.address,
          u.name as customer_name,
          u.email as customer_email,
          s.name as service_name,
          st.name as staff_name,
          b.created_at
        FROM bookings b
        JOIN users u ON u.id = b.user_id
        JOIN services s ON s.id = b.service_id
        LEFT JOIN users st ON st.id = b.team_member_id
        ${dateFilter}
        ORDER BY b.created_at DESC
      `);
            // Criar CSV
            const headers = [
                'ID',
                'Data Agendamento',
                'Status',
                'Valor Total',
                'Endereço',
                'Cliente',
                'Email Cliente',
                'Serviço',
                'Staff',
                'Data Criação'
            ];
            const csvRows = result.map((row) => [
                row.id,
                row.scheduled_date,
                row.status,
                row.total_price,
                `"${row.address}"`,
                `"${row.customer_name}"`,
                row.customer_email,
                `"${row.service_name}"`,
                `"${row.staff_name || ''}"`,
                row.created_at
            ]);
            return [headers, ...csvRows].map(row => row.join(',')).join('\n');
        }
        catch (error) {
            logger_advanced_1.logger.error('Error exporting bookings CSV:', error);
            throw new Error('Failed to export bookings CSV');
        }
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=AnalyticsService.js.map