import { Request, Response, NextFunction } from 'express';
export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}
export interface CustomError extends Error {
    status?: number;
    code?: string;
}
export declare const errorHandler: (err: CustomError, req: Request, res: Response, _next: NextFunction) => void;
export declare const asyncHandler: (fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>) => (req: AuthRequest, res: Response, next: NextFunction) => void;
export declare const ApiError: (message: string, status?: number) => CustomError;
//# sourceMappingURL=errorHandler.d.ts.map