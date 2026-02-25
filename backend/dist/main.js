"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = void 0;
exports.startServer = startServer;
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const logger_advanced_1 = require("./utils/logger-advanced");
const socket_io_1 = require("socket.io");
const chat_1 = require("./socket/chat");
const ReminderService_1 = require("./services/ReminderService");
const CacheService_1 = require("./services/CacheService");
let server = null;
exports.server = server;
let io = null;
exports.io = io;
function startServer() {
    exports.server = server = http_1.default.createServer(app_1.default);
    // Initialize Socket.IO
    exports.io = io = new socket_io_1.Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    // Setup socket handlers
    (0, chat_1.setupSocketHandlers)(io);
    server.listen(config_1.PORT, async () => {
        logger_advanced_1.logger.info(`✅ Backend running on http://localhost:${config_1.PORT}`);
        logger_advanced_1.logger.info(`✅ Socket.IO enabled for real-time chat`);
        // Initialize existing reminders
        await ReminderService_1.ReminderService.initializeExistingReminders();
        // Initialize Redis cache
        await CacheService_1.cacheService.connect();
    });
}
if (require.main === module) {
    startServer();
}
//# sourceMappingURL=main.js.map