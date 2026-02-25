import { Response } from 'express';
import { AuthRequest } from '../middleware/errorHandler';
export declare class TwoFactorController {
    /**
     * Inicia configuração do 2FA
     */
    static setup2FA: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Ativa 2FA após verificação do código
     */
    static enable2FA: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Desativa 2FA
     */
    static disable2FA: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Verifica código 2FA (durante login)
     */
    static verify2FA: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Verifica código de backup
     */
    static verifyBackupCode: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Regenera códigos de backup
     */
    static regenerateBackupCodes: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Verifica status do 2FA
     */
    static getStatus: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Obtém estatísticas de 2FA (admin only)
     */
    static getStats: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=TwoFactorController.d.ts.map