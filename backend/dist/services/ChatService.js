"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const database_1 = require("../utils/database");
const logger_advanced_1 = require("../utils/logger-advanced");
class ChatService {
    /**
     * Cria ou obtém uma sala de chat para um booking
     */
    static async getOrCreateChatRoom(bookingId) {
        try {
            // Verificar se já existe
            const existing = await (0, database_1.query)(`SELECT cr.*, b.user_id as customer_id, b.team_member_id as staff_id
         FROM chat_rooms cr
         JOIN bookings b ON b.id = cr.booking_id
         WHERE cr.booking_id = $1`, [bookingId]);
            if (existing.length > 0) {
                return existing[0];
            }
            // Criar nova sala
            const booking = await (0, database_1.query)('SELECT user_id, team_member_id FROM bookings WHERE id = $1', [bookingId]);
            if (booking.length === 0) {
                throw new Error('Booking not found');
            }
            const result = await (0, database_1.query)(`INSERT INTO chat_rooms (booking_id, customer_id, staff_id, unread_count, created_at, updated_at)
         VALUES ($1, $2, $3, 0, NOW(), NOW()) RETURNING *`, [bookingId, booking[0].user_id, booking[0].team_member_id]);
            return result[0];
        }
        catch (error) {
            logger_advanced_1.logger.error('Error creating/getting chat room:', error);
            return null;
        }
    }
    /**
     * Salva uma mensagem no chat
     */
    static async saveMessage(bookingId, senderId, senderRole, message, messageType = 'text', fileUrl) {
        try {
            const result = await (0, database_1.query)(`INSERT INTO chat_messages (booking_id, sender_id, sender_role, message, message_type, file_url, is_read, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, false, NOW()) RETURNING *`, [bookingId, senderId, senderRole, message, messageType, fileUrl]);
            // Atualizar último mensagem na sala
            await (0, database_1.query)(`UPDATE chat_rooms
         SET last_message = $1, last_message_at = NOW(), updated_at = NOW(),
             unread_count = unread_count + 1
         WHERE booking_id = $2`, [message.substring(0, 100), bookingId] // Limitar tamanho da preview
            );
            return result[0];
        }
        catch (error) {
            logger_advanced_1.logger.error('Error saving chat message:', error);
            return null;
        }
    }
    /**
     * Obtém mensagens de um chat
     */
    static async getMessages(bookingId, limit = 50, offset = 0) {
        try {
            const result = await (0, database_1.query)(`SELECT * FROM chat_messages
         WHERE booking_id = $1
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`, [bookingId, limit, offset]);
            return result.reverse(); // Retornar em ordem cronológica
        }
        catch (error) {
            logger_advanced_1.logger.error('Error getting chat messages:', error);
            return [];
        }
    }
    /**
     * Marca mensagens como lidas
     */
    static async markAsRead(bookingId, userId) {
        try {
            await (0, database_1.query)(`UPDATE chat_messages
         SET is_read = true
         WHERE booking_id = $1 AND sender_id != $2`, [bookingId, userId]);
            // Resetar contador de não lidas
            await (0, database_1.query)('UPDATE chat_rooms SET unread_count = 0 WHERE booking_id = $1', [bookingId]);
        }
        catch (error) {
            logger_advanced_1.logger.error('Error marking messages as read:', error);
        }
    }
    /**
     * Obtém salas de chat do usuário
     */
    static async getUserChatRooms(userId, userRole) {
        try {
            let sql;
            let params;
            if (userRole === 'admin') {
                // Admin vê todas as salas
                sql = 'SELECT * FROM chat_rooms ORDER BY updated_at DESC';
                params = [];
            }
            else if (userRole === 'staff') {
                // Staff vê salas onde é atribuído
                sql = 'SELECT * FROM chat_rooms WHERE staff_id = $1 ORDER BY updated_at DESC';
                params = [userId];
            }
            else {
                // Cliente vê suas próprias salas
                sql = 'SELECT * FROM chat_rooms WHERE customer_id = $1 ORDER BY updated_at DESC';
                params = [userId];
            }
            const result = await (0, database_1.query)(sql, params);
            return result;
        }
        catch (error) {
            logger_advanced_1.logger.error('Error getting user chat rooms:', error);
            return [];
        }
    }
    /**
     * Obtém estatísticas do chat
     */
    static async getStats() {
        try {
            const roomsResult = await (0, database_1.query)('SELECT COUNT(*) as count FROM chat_rooms');
            const messagesResult = await (0, database_1.query)('SELECT COUNT(*) as count FROM chat_messages');
            const activeResult = await (0, database_1.query)("SELECT COUNT(*) as count FROM chat_rooms WHERE updated_at > NOW() - INTERVAL '24 hours'");
            return {
                totalRooms: parseInt(roomsResult[0].count),
                totalMessages: parseInt(messagesResult[0].count),
                activeChats: parseInt(activeResult[0].count)
            };
        }
        catch (error) {
            logger_advanced_1.logger.error('Error getting chat stats:', error);
            return { totalRooms: 0, totalMessages: 0, activeChats: 0 };
        }
    }
}
exports.ChatService = ChatService;
//# sourceMappingURL=ChatService.js.map