"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = setupSocketHandlers;
const logger_advanced_1 = require("../utils/logger-advanced");
// Store connected users
const connectedUsers = new Map();
const userSockets = new Map();
function setupSocketHandlers(io) {
    io.on('connection', (socket) => {
        logger_advanced_1.logger.info(`🔌 User connected: ${socket.id}`);
        // User authentication
        socket.on('authenticate', (data) => {
            const { userId, role } = data;
            // Store user connection
            connectedUsers.set(socket.id, {
                userId,
                socketId: socket.id,
                role: role
            });
            // Track user sockets
            if (!userSockets.has(userId)) {
                userSockets.set(userId, []);
            }
            userSockets.get(userId).push(socket.id);
            logger_advanced_1.logger.info(`👤 User ${userId} authenticated with role ${role}`);
            // Join user-specific room
            socket.join(`user_${userId}`);
            // Notify user is online
            socket.broadcast.emit('user_online', { userId, role });
        });
        // Handle private messages
        socket.on('private_message', (data) => {
            const fromUser = connectedUsers.get(socket.id);
            if (!fromUser) {
                socket.emit('error', { message: 'User not authenticated' });
                return;
            }
            const message = {
                id: generateMessageId(),
                fromUserId: fromUser.userId,
                toUserId: data.toUserId,
                bookingId: data.bookingId,
                message: data.message,
                timestamp: new Date(),
                read: false
            };
            // Send to recipient if online
            const recipientSockets = userSockets.get(data.toUserId);
            if (recipientSockets && recipientSockets.length > 0) {
                // Send to all sockets of the recipient
                recipientSockets.forEach(socketId => {
                    io.to(socketId).emit('private_message', message);
                });
            }
            // Send confirmation to sender
            socket.emit('message_sent', message);
            logger_advanced_1.logger.info(`💬 Message from ${fromUser.userId} to ${data.toUserId}: ${data.message.substring(0, 50)}...`);
        });
        // Handle typing indicators
        socket.on('typing_start', (data) => {
            const fromUser = connectedUsers.get(socket.id);
            if (!fromUser)
                return;
            const recipientSockets = userSockets.get(data.toUserId);
            if (recipientSockets) {
                recipientSockets.forEach(socketId => {
                    io.to(socketId).emit('typing_start', { fromUserId: fromUser.userId });
                });
            }
        });
        socket.on('typing_stop', (data) => {
            const fromUser = connectedUsers.get(socket.id);
            if (!fromUser)
                return;
            const recipientSockets = userSockets.get(data.toUserId);
            if (recipientSockets) {
                recipientSockets.forEach(socketId => {
                    io.to(socketId).emit('typing_stop', { fromUserId: fromUser.userId });
                });
            }
        });
        // Handle booking chat rooms
        socket.on('join_booking_chat', (data) => {
            const user = connectedUsers.get(socket.id);
            if (!user)
                return;
            socket.join(`booking_${data.bookingId}`);
            logger_advanced_1.logger.info(`📋 User ${user.userId} joined booking chat ${data.bookingId}`);
        });
        socket.on('leave_booking_chat', (data) => {
            socket.leave(`booking_${data.bookingId}`);
        });
        // Handle booking messages
        socket.on('booking_message', (data) => {
            const fromUser = connectedUsers.get(socket.id);
            if (!fromUser)
                return;
            const message = {
                id: generateMessageId(),
                fromUserId: fromUser.userId,
                toUserId: 'booking', // Special identifier for booking chats
                bookingId: data.bookingId,
                message: data.message,
                timestamp: new Date(),
                read: false
            };
            // Send to booking room
            io.to(`booking_${data.bookingId}`).emit('booking_message', message);
            logger_advanced_1.logger.info(`📋 Booking message in ${data.bookingId} from ${fromUser.userId}`);
        });
        // Handle disconnection
        socket.on('disconnect', () => {
            const user = connectedUsers.get(socket.id);
            if (user) {
                // Remove from connected users
                connectedUsers.delete(socket.id);
                // Remove from user sockets
                const sockets = userSockets.get(user.userId);
                if (sockets) {
                    const index = sockets.indexOf(socket.id);
                    if (index > -1) {
                        sockets.splice(index, 1);
                    }
                    if (sockets.length === 0) {
                        userSockets.delete(user.userId);
                        // Notify others user is offline
                        socket.broadcast.emit('user_offline', { userId: user.userId });
                    }
                }
                logger_advanced_1.logger.info(`🔌 User ${user.userId} disconnected`);
            }
        });
    });
}
function generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
//# sourceMappingURL=chat.js.map