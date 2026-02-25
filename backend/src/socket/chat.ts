import { Server as SocketServer, Socket } from 'socket.io';
import { logger } from '../utils/logger-advanced';

interface ChatMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  bookingId?: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ConnectedUser {
  userId: string;
  socketId: string;
  role: 'customer' | 'staff' | 'admin';
}

// Store connected users
const connectedUsers = new Map<string, ConnectedUser>();
const userSockets = new Map<string, string[]>();

export function setupSocketHandlers(io: SocketServer) {
  io.on('connection', (socket: Socket) => {
    logger.info(`🔌 User connected: ${socket.id}`);

    // User authentication
    socket.on('authenticate', (data: { userId: string; role: string }) => {
      const { userId, role } = data;

      // Store user connection
      connectedUsers.set(socket.id, {
        userId,
        socketId: socket.id,
        role: role as 'customer' | 'staff' | 'admin'
      });

      // Track user sockets
      if (!userSockets.has(userId)) {
        userSockets.set(userId, []);
      }
      userSockets.get(userId)!.push(socket.id);

      logger.info(`👤 User ${userId} authenticated with role ${role}`);

      // Join user-specific room
      socket.join(`user_${userId}`);

      // Notify user is online
      socket.broadcast.emit('user_online', { userId, role });
    });

    // Handle private messages
    socket.on('private_message', (data: {
      toUserId: string;
      message: string;
      bookingId?: string;
    }) => {
      const fromUser = connectedUsers.get(socket.id);
      if (!fromUser) {
        socket.emit('error', { message: 'User not authenticated' });
        return;
      }

      const message: ChatMessage = {
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

      logger.info(`💬 Message from ${fromUser.userId} to ${data.toUserId}: ${data.message.substring(0, 50)}...`);
    });

    // Handle typing indicators
    socket.on('typing_start', (data: { toUserId: string }) => {
      const fromUser = connectedUsers.get(socket.id);
      if (!fromUser) return;

      const recipientSockets = userSockets.get(data.toUserId);
      if (recipientSockets) {
        recipientSockets.forEach(socketId => {
          io.to(socketId).emit('typing_start', { fromUserId: fromUser.userId });
        });
      }
    });

    socket.on('typing_stop', (data: { toUserId: string }) => {
      const fromUser = connectedUsers.get(socket.id);
      if (!fromUser) return;

      const recipientSockets = userSockets.get(data.toUserId);
      if (recipientSockets) {
        recipientSockets.forEach(socketId => {
          io.to(socketId).emit('typing_stop', { fromUserId: fromUser.userId });
        });
      }
    });

    // Handle booking chat rooms
    socket.on('join_booking_chat', (data: { bookingId: string }) => {
      const user = connectedUsers.get(socket.id);
      if (!user) return;

      socket.join(`booking_${data.bookingId}`);
      logger.info(`📋 User ${user.userId} joined booking chat ${data.bookingId}`);
    });

    socket.on('leave_booking_chat', (data: { bookingId: string }) => {
      socket.leave(`booking_${data.bookingId}`);
    });

    // Handle booking messages
    socket.on('booking_message', (data: {
      bookingId: string;
      message: string;
    }) => {
      const fromUser = connectedUsers.get(socket.id);
      if (!fromUser) return;

      const message: ChatMessage = {
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

      logger.info(`📋 Booking message in ${data.bookingId} from ${fromUser.userId}`);
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

        logger.info(`🔌 User ${user.userId} disconnected`);
      }
    });
  });
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}