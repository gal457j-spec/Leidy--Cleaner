import { Response } from 'express';
import { AuthRequest } from '../middleware/errorHandler';
export declare class AIController {
    getServiceRecommendations(req: AuthRequest, res: Response): Promise<void>;
    getStaffRecommendations(req: AuthRequest, res: Response): Promise<void>;
    processChatbotQuery(req: AuthRequest, res: Response): Promise<void>;
    getBookingAnalytics(req: AuthRequest, res: Response): Promise<void>;
}
//# sourceMappingURL=AIController.d.ts.map