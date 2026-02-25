"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../utils/database");
const router = express_1.default.Router();
// Only expose this endpoint in test environment.  It's used by the
// Playwright fixtures to clear everything between runs so records from one
// test don't leak into the next.  The handler runs simple DELETEs; you can
// expand it if new tables are added.
router.post('/reset', async (_req, res) => {
    if (process.env.NODE_ENV !== 'test') {
        return res.status(404).json({ error: 'Not available' });
    }
    try {
        // order matters because of foreign keys
        await (0, database_1.query)('DELETE FROM bookings');
        await (0, database_1.query)("DELETE FROM users WHERE role <> 'admin'");
        await (0, database_1.query)('DELETE FROM services');
        await (0, database_1.query)('DELETE FROM reviews');
        await (0, database_1.query)('DELETE FROM company_info');
        // keep migrations table intact so subsequent runs don't reapply them
        return res.json({ ok: true });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=test.js.map