"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChatController_1 = require("../controllers/ChatController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(auth_1.authenticate);
// Obtém salas de chat do usuário
router.get('/rooms', ChatController_1.ChatController.getUserRooms);
// Obtém ou cria sala de chat para um booking
router.get('/room/:bookingId', ChatController_1.ChatController.getRoom);
// Envia mensagem no chat
router.post('/room/:bookingId/messages', ChatController_1.ChatController.sendMessage);
// Obtém mensagens do chat
router.get('/room/:bookingId/messages', ChatController_1.ChatController.getMessages);
// Marca mensagens como lidas
router.put('/room/:bookingId/read', ChatController_1.ChatController.markAsRead);
// Estatísticas do chat (admin only)
router.get('/stats', ChatController_1.ChatController.getStats);
exports.default = router;
//# sourceMappingURL=chat.js.map