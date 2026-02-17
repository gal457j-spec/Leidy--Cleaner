import { Response } from 'express';
import { AuthRequest } from '../middleware/errorHandler';
export declare class ServiceController {
    static getAll: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    static getById: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    static create: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    static update: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    static delete: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    static getCategories: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=ServiceController.d.ts.map