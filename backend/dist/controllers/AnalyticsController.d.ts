import { Response } from 'express';
import { AuthRequest } from '../middleware/errorHandler';
export declare class AnalyticsController {
    /**
     * Obtém métricas gerais de analytics
     */
    static getMetrics: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Obtém estatísticas do dashboard
     */
    static getDashboardStats: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Obtém performance dos funcionários
     */
    static getStaffPerformance: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Exporta bookings em CSV
     */
    static exportBookingsCSV: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Obtém relatório de receita por período
     */
    static getRevenueReport: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Obtém relatório de usuários
     */
    static getUserReport: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Obtém relatório de satisfação do cliente
     */
    static getCustomerSatisfactionReport: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=AnalyticsController.d.ts.map