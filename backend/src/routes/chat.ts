import { Router } from 'express';
import { ChatController } from '../controllers/ChatController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Obtém salas de chat do usuário
router.get('/rooms', ChatController.getUserRooms);

// Obtém ou cria sala de chat para um booking
router.get('/room/:bookingId', ChatController.getRoom);

// Envia mensagem no chat
router.post('/room/:bookingId/messages', ChatController.sendMessage);

// Obtém mensagens do chat
router.get('/room/:bookingId/messages', ChatController.getMessages);

// Marca mensagens como lidas
router.put('/room/:bookingId/read', ChatController.markAsRead);

// Estatísticas do chat (admin only)
router.get('/stats', ChatController.getStats);

export default router;