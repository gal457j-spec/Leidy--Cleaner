import { Response } from 'express';
import { AuthRequest, asyncHandler, ApiError } from '../middleware/errorHandler';
import { ChatService } from '../services/ChatService';
import { chatMessageSchema } from '../utils/schemas';
import { camelize } from '../utils/transformers';

export class ChatController {
  /**
   * Obtém ou cria uma sala de chat para um booking
   */
  static getRoom = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.params as { bookingId: string };

    // Verificar se o usuário tem acesso ao booking
    const { BookingService } = await import('../services/BookingService');
    const booking = await BookingService.getById(bookingId);

    if (!booking) {
      throw ApiError('Booking not found', 404);
    }

    // Verificar permissões
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole !== 'admin' &&
        booking.user_id !== userId &&
        booking.team_member_id !== userId) {
      throw ApiError('Not authorized to access this chat', 403);
    }

    const room = await ChatService.getOrCreateChatRoom(bookingId);
    if (!room) {
      throw ApiError('Failed to create chat room', 500);
    }

    res.status(200).json({
      message: 'Chat room retrieved',
      data: { room: camelize(room) }
    });
  });

  /**
   * Envia uma mensagem no chat
   */
  static sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.params as { bookingId: string };
    const { error, value } = chatMessageSchema.validate(req.body);

    if (error) {
      throw ApiError(error.details[0].message, 400);
    }

    // Verificar se o usuário tem acesso ao booking
    const { BookingService } = await import('../services/BookingService');
    const booking = await BookingService.getById(bookingId);

    if (!booking) {
      throw ApiError('Booking not found', 404);
    }

    // Verificar permissões
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole !== 'admin' &&
        booking.user_id !== userId &&
        booking.team_member_id !== userId) {
      throw ApiError('Not authorized to send messages in this chat', 403);
    }

    // Determinar o role do sender
    let senderRole: 'customer' | 'staff' | 'admin' = 'customer';
    if (userRole === 'admin') {
      senderRole = 'admin';
    } else if (booking.team_member_id === userId) {
      senderRole = 'staff';
    }

    const savedMessage = await ChatService.saveMessage(
      bookingId,
      userId,
      senderRole,
      value.message,
      value.messageType || 'text',
      value.fileUrl
    );

    if (!savedMessage) {
      throw ApiError('Failed to save message', 500);
    }

    res.status(201).json({
      message: 'Message sent',
      data: { message: camelize(savedMessage) }
    });
  });

  /**
   * Obtém mensagens do chat
   */
  static getMessages = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.params as { bookingId: string };
    const { limit = 50, offset = 0 } = req.query as { limit?: string; offset?: string };

    // Verificar se o usuário tem acesso ao booking
    const { BookingService } = await import('../services/BookingService');
    const booking = await BookingService.getById(bookingId);

    if (!booking) {
      throw ApiError('Booking not found', 404);
    }

    // Verificar permissões
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole !== 'admin' &&
        booking.user_id !== userId &&
        booking.team_member_id !== userId) {
      throw ApiError('Not authorized to view this chat', 403);
    }

    const messages = await ChatService.getMessages(
      bookingId,
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.status(200).json({
      message: 'Messages retrieved',
      data: { messages: camelize(messages) }
    });
  });

  /**
   * Marca mensagens como lidas
   */
  static markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { bookingId } = req.params as { bookingId: string };

    // Verificar se o usuário tem acesso ao booking
    const { BookingService } = await import('../services/BookingService');
    const booking = await BookingService.getById(bookingId);

    if (!booking) {
      throw ApiError('Booking not found', 404);
    }

    // Verificar permissões
    const userId = req.user!.id;
    const userRole = req.user!.role;

    if (userRole !== 'admin' &&
        booking.user_id !== userId &&
        booking.team_member_id !== userId) {
      throw ApiError('Not authorized to mark messages as read', 403);
    }

    await ChatService.markAsRead(bookingId, userId);

    res.status(200).json({
      message: 'Messages marked as read'
    });
  });

  /**
   * Obtém salas de chat do usuário
   */
  static getUserRooms = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const rooms = await ChatService.getUserChatRooms(userId, userRole);

    res.status(200).json({
      message: 'Chat rooms retrieved',
      data: { rooms: camelize(rooms) }
    });
  });

  /**
   * Obtém estatísticas do chat (admin only)
   */
  static getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user!.role !== 'admin') {
      throw ApiError('Only admins can view chat stats', 403);
    }

    const stats = await ChatService.getStats();

    res.status(200).json({
      message: 'Chat stats retrieved',
      data: { stats }
    });
  });
}