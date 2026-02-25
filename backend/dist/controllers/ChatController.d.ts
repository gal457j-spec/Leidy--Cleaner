import { Response } from 'express';
import { AuthRequest } from '../middleware/errorHandler';
export declare class ChatController {
    /**
     * Obtém ou cria uma sala de chat para um booking
     */
    static getRoom: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Envia uma mensagem no chat
     */
    static sendMessage: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Obtém mensagens do chat
     */
    static getMessages: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Marca mensagens como lidas
     */
    static markAsRead: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Obtém salas de chat do usuário
     */
    static getUserRooms: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
    /**
     * Obtém estatísticas do chat (admin only)
     */
    static getStats: (req: AuthRequest, res: Response, next: import("express").NextFunction) => void;
}
//# sourceMappingURL=ChatController.d.ts.map