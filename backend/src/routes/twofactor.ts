import { Router } from 'express';
import { TwoFactorController } from '../controllers/TwoFactorController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

// Configuração e gerenciamento 2FA
router.get('/setup', TwoFactorController.setup2FA);
router.post('/enable', TwoFactorController.enable2FA);
router.post('/disable', TwoFactorController.disable2FA);
router.get('/status', TwoFactorController.getStatus);

// Verificação durante login/processos
router.post('/verify', TwoFactorController.verify2FA);
router.post('/verify-backup', TwoFactorController.verifyBackupCode);

// Códigos de backup
router.post('/regenerate-backup', TwoFactorController.regenerateBackupCodes);

// Admin stats
router.get('/stats', TwoFactorController.getStats);

export default router;