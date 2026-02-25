"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TwoFactorController_1 = require("../controllers/TwoFactorController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Todas as rotas requerem autenticação
router.use(auth_1.authenticate);
// Configuração e gerenciamento 2FA
router.get('/setup', TwoFactorController_1.TwoFactorController.setup2FA);
router.post('/enable', TwoFactorController_1.TwoFactorController.enable2FA);
router.post('/disable', TwoFactorController_1.TwoFactorController.disable2FA);
router.get('/status', TwoFactorController_1.TwoFactorController.getStatus);
// Verificação durante login/processos
router.post('/verify', TwoFactorController_1.TwoFactorController.verify2FA);
router.post('/verify-backup', TwoFactorController_1.TwoFactorController.verifyBackupCode);
// Códigos de backup
router.post('/regenerate-backup', TwoFactorController_1.TwoFactorController.regenerateBackupCodes);
// Admin stats
router.get('/stats', TwoFactorController_1.TwoFactorController.getStats);
exports.default = router;
//# sourceMappingURL=twofactor.js.map