"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
exports.startServer = startServer;
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const config_1 = require("./config");
const logger_advanced_1 = require("./utils/logger-advanced");
let server = null;
exports.server = server;
function startServer() {
    exports.server = server = http_1.default.createServer(app_1.default);
    server.listen(config_1.PORT, () => {
        logger_advanced_1.logger.info(`✅ Backend running on http://localhost:${config_1.PORT}`);
    });
}
if (require.main === module) {
    startServer();
}
//# sourceMappingURL=main.js.map