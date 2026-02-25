export interface AnalyticsMetrics {
    totalUsers: number;
    activeUsers: number;
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    topServices: Array<{
        name: string;
        count: number;
        revenue: number;
    }>;
    revenueByMonth: Array<{
        month: string;
        revenue: number;
        bookings: number;
    }>;
    userGrowth: Array<{
        month: string;
        newUsers: number;
        totalUsers: number;
    }>;
    bookingStatusDistribution: Record<string, number>;
    averageRating: number;
    totalReviews: number;
}
export interface DashboardStats {
    todayBookings: number;
    todayRevenue: number;
    pendingBookings: number;
    activeChats: number;
    systemHealth: 'healthy' | 'warning' | 'critical';
    alerts: string[];
}
export declare class AnalyticsService {
    /**
     * Obtém métricas gerais de analytics
     */
    static getMetrics(startDate?: string, endDate?: string): Promise<AnalyticsMetrics>;
    /**
     * Obtém estatísticas do dashboard
     */
    static getDashboardStats(): Promise<DashboardStats>;
    /**
     * Gera relatório de performance de staff
     */
    static getStaffPerformance(): Promise<Array<{
        staffId: string;
        staffName: string;
        totalBookings: number;
        completedBookings: number;
        averageRating: number;
        totalRevenue: number;
        efficiency: number;
    }>>;
    /**
     * Exporta dados para CSV
     */
    static exportBookingsCSV(startDate?: string, endDate?: string): Promise<string>;
}
//# sourceMappingURL=AnalyticsService.d.ts.map