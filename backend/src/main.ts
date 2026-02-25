import http from 'http';
import app from './app';
import { PORT } from './config';
import { logger } from './utils/logger-advanced';
import { Server as SocketServer } from 'socket.io';
import { setupSocketHandlers } from './socket/chat';
import { ReminderService } from './services/ReminderService';
import { cacheService } from './services/CacheService';

let server: http.Server | null = null;
let io: SocketServer | null = null;

function startServer() {
  server = http.createServer(app);

  // Initialize Socket.IO
  io = new SocketServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Setup socket handlers
  setupSocketHandlers(io);

  server.listen(PORT, async () => {
    logger.info(`✅ Backend running on http://localhost:${PORT}`);
    logger.info(`✅ Socket.IO enabled for real-time chat`);

    // Initialize existing reminders
    await ReminderService.initializeExistingReminders();

    // Initialize Redis cache
    await cacheService.connect();
  });
}

if (require.main === module) {
  startServer();
}

export { server, startServer, io };
