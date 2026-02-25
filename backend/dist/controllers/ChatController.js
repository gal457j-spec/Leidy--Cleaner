"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const ChatService_1 = require("../services/ChatService");
const schemas_1 = require("../utils/schemas");
const transformers_1 = require("../utils/transformers");
class ChatController {
}
exports.ChatController = ChatController;
_a = ChatController;
/**
 * Obtém ou cria uma sala de chat para um booking
 */
ChatController.getRoom = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { bookingId } = req.params;
    // Verificar se o usuário tem acesso ao booking
    const { BookingService } = await Promise.resolve().then(() => __importStar(require('../services/BookingService')));
    const booking = await BookingService.getById(bookingId);
    if (!booking) {
        throw (0, errorHandler_1.ApiError)('Booking not found', 404);
    }
    // Verificar permissões
    const userId = req.user.id;
    const userRole = req.user.role;
    if (userRole !== 'admin' &&
        booking.user_id !== userId &&
        booking.team_member_id !== userId) {
        throw (0, errorHandler_1.ApiError)('Not authorized to access this chat', 403);
    }
    const room = await ChatService_1.ChatService.getOrCreateChatRoom(bookingId);
    if (!room) {
        throw (0, errorHandler_1.ApiError)('Failed to create chat room', 500);
    }
    res.status(200).json({
        message: 'Chat room retrieved',
        data: { room: (0, transformers_1.camelize)(room) }
    });
});
/**
 * Envia uma mensagem no chat
 */
ChatController.sendMessage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { bookingId } = req.params;
    const { error, value } = schemas_1.chatMessageSchema.validate(req.body);
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    // Verificar se o usuário tem acesso ao booking
    const { BookingService } = await Promise.resolve().then(() => __importStar(require('../services/BookingService')));
    const booking = await BookingService.getById(bookingId);
    if (!booking) {
        throw (0, errorHandler_1.ApiError)('Booking not found', 404);
    }
    // Verificar permissões
    const userId = req.user.id;
    const userRole = req.user.role;
    if (userRole !== 'admin' &&
        booking.user_id !== userId &&
        booking.team_member_id !== userId) {
        throw (0, errorHandler_1.ApiError)('Not authorized to send messages in this chat', 403);
    }
    // Determinar o role do sender
    let senderRole = 'customer';
    if (userRole === 'admin') {
        senderRole = 'admin';
    }
    else if (booking.team_member_id === userId) {
        senderRole = 'staff';
    }
    const savedMessage = await ChatService_1.ChatService.saveMessage(bookingId, userId, senderRole, value.message, value.messageType || 'text', value.fileUrl);
    if (!savedMessage) {
        throw (0, errorHandler_1.ApiError)('Failed to save message', 500);
    }
    res.status(201).json({
        message: 'Message sent',
        data: { message: (0, transformers_1.camelize)(savedMessage) }
    });
});
/**
 * Obtém mensagens do chat
 */
ChatController.getMessages = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { bookingId } = req.params;
    const { limit = 50, offset = 0 } = req.query;
    // Verificar se o usuário tem acesso ao booking
    const { BookingService } = await Promise.resolve().then(() => __importStar(require('../services/BookingService')));
    const booking = await BookingService.getById(bookingId);
    if (!booking) {
        throw (0, errorHandler_1.ApiError)('Booking not found', 404);
    }
    // Verificar permissões
    const userId = req.user.id;
    const userRole = req.user.role;
    if (userRole !== 'admin' &&
        booking.user_id !== userId &&
        booking.team_member_id !== userId) {
        throw (0, errorHandler_1.ApiError)('Not authorized to view this chat', 403);
    }
    const messages = await ChatService_1.ChatService.getMessages(bookingId, parseInt(limit), parseInt(offset));
    res.status(200).json({
        message: 'Messages retrieved',
        data: { messages: (0, transformers_1.camelize)(messages) }
    });
});
/**
 * Marca mensagens como lidas
 */
ChatController.markAsRead = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { bookingId } = req.params;
    // Verificar se o usuário tem acesso ao booking
    const { BookingService } = await Promise.resolve().then(() => __importStar(require('../services/BookingService')));
    const booking = await BookingService.getById(bookingId);
    if (!booking) {
        throw (0, errorHandler_1.ApiError)('Booking not found', 404);
    }
    // Verificar permissões
    const userId = req.user.id;
    const userRole = req.user.role;
    if (userRole !== 'admin' &&
        booking.user_id !== userId &&
        booking.team_member_id !== userId) {
        throw (0, errorHandler_1.ApiError)('Not authorized to mark messages as read', 403);
    }
    await ChatService_1.ChatService.markAsRead(bookingId, userId);
    res.status(200).json({
        message: 'Messages marked as read'
    });
});
/**
 * Obtém salas de chat do usuário
 */
ChatController.getUserRooms = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;
    const rooms = await ChatService_1.ChatService.getUserChatRooms(userId, userRole);
    res.status(200).json({
        message: 'Chat rooms retrieved',
        data: { rooms: (0, transformers_1.camelize)(rooms) }
    });
});
/**
 * Obtém estatísticas do chat (admin only)
 */
ChatController.getStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw (0, errorHandler_1.ApiError)('Only admins can view chat stats', 403);
    }
    const stats = await ChatService_1.ChatService.getStats();
    res.status(200).json({
        message: 'Chat stats retrieved',
        data: { stats }
    });
});
//# sourceMappingURL=ChatController.js.map