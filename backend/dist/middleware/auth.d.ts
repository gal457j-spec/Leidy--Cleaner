import { Response, NextFunction } from 'express';
import { AuthRequest } from './errorHandler';
export declare const authenticateToken: (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const authorizeRole: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.d.ts.map