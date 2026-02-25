"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorController = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const TwoFactorService_1 = require("../services/TwoFactorService");
const schemas_1 = require("../utils/schemas");
const logger_advanced_1 = require("../utils/logger-advanced");
class TwoFactorController {
}
exports.TwoFactorController = TwoFactorController;
_a = TwoFactorController;
/**
 * Inicia configuração do 2FA
 */
TwoFactorController.setup2FA = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const userEmail = req.user.email;
    // Verificar se 2FA já está ativado
    const isEnabled = await TwoFactorService_1.TwoFactorService.is2FAEnabled(userId);
    if (isEnabled) {
        throw (0, errorHandler_1.ApiError)('2FA is already enabled for this account', 400);
    }
    const secretData = await TwoFactorService_1.TwoFactorService.generateTOTPSecret(userEmail);
    res.status(200).json({
        message: '2FA setup initiated',
        data: {
            secret: secretData.secret,
            qrCode: secretData.qrCode,
            otpauthUrl: secretData.otpauthUrl
        }
    });
});
/**
 * Ativa 2FA após verificação do código
 */
TwoFactorController.enable2FA = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { error, value } = schemas_1.twoFactorSetupSchema.validate(req.body);
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    const userId = req.user.id;
    const { secret, token } = value;
    // Verificar se 2FA já está ativado
    const isEnabled = await TwoFactorService_1.TwoFactorService.is2FAEnabled(userId);
    if (isEnabled) {
        throw (0, errorHandler_1.ApiError)('2FA is already enabled for this account', 400);
    }
    // Verificar o código TOTP
    const isValid = TwoFactorService_1.TwoFactorService.verifyTOTPCode(secret, token);
    if (!isValid) {
        throw (0, errorHandler_1.ApiError)('Invalid 2FA code', 400);
    }
    // Ativar 2FA
    await TwoFactorService_1.TwoFactorService.enable2FA(userId, secret);
    // Gerar códigos de backup
    const backupCodes = TwoFactorService_1.TwoFactorService.generateBackupCodes();
    await TwoFactorService_1.TwoFactorService.saveBackupCodes(userId, backupCodes);
    logger_advanced_1.logger.info(`2FA enabled for user ${userId}`);
    res.status(200).json({
        message: '2FA enabled successfully',
        data: {
            backupCodes: backupCodes // Mostrar apenas uma vez!
        }
    });
});
/**
 * Desativa 2FA
 */
TwoFactorController.disable2FA = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    // Verificar se 2FA está ativado
    const isEnabled = await TwoFactorService_1.TwoFactorService.is2FAEnabled(userId);
    if (!isEnabled) {
        throw (0, errorHandler_1.ApiError)('2FA is not enabled for this account', 400);
    }
    await TwoFactorService_1.TwoFactorService.disable2FA(userId);
    logger_advanced_1.logger.info(`2FA disabled for user ${userId}`);
    res.status(200).json({
        message: '2FA disabled successfully'
    });
});
/**
 * Verifica código 2FA (durante login)
 */
TwoFactorController.verify2FA = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { error, value } = schemas_1.twoFactorVerifySchema.validate(req.body);
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    const userId = req.user.id;
    const { token } = value;
    const result = await TwoFactorService_1.TwoFactorService.validate2FACode(userId, token);
    if (!result.verified) {
        throw (0, errorHandler_1.ApiError)(result.message, 400);
    }
    res.status(200).json({
        message: result.message
    });
});
/**
 * Verifica código de backup
 */
TwoFactorController.verifyBackupCode = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { error, value } = schemas_1.backupCodeSchema.validate(req.body);
    if (error) {
        throw (0, errorHandler_1.ApiError)(error.details[0].message, 400);
    }
    const userId = req.user.id;
    const { code } = value;
    const isValid = await TwoFactorService_1.TwoFactorService.validateBackupCode(userId, code);
    if (!isValid) {
        throw (0, errorHandler_1.ApiError)('Invalid backup code', 400);
    }
    res.status(200).json({
        message: 'Backup code verified successfully'
    });
});
/**
 * Regenera códigos de backup
 */
TwoFactorController.regenerateBackupCodes = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    // Verificar se 2FA está ativado
    const isEnabled = await TwoFactorService_1.TwoFactorService.is2FAEnabled(userId);
    if (!isEnabled) {
        throw (0, errorHandler_1.ApiError)('2FA must be enabled to regenerate backup codes', 400);
    }
    const backupCodes = TwoFactorService_1.TwoFactorService.generateBackupCodes();
    await TwoFactorService_1.TwoFactorService.saveBackupCodes(userId, backupCodes);
    res.status(200).json({
        message: 'Backup codes regenerated',
        data: {
            backupCodes: backupCodes // Mostrar apenas uma vez!
        }
    });
});
/**
 * Verifica status do 2FA
 */
TwoFactorController.getStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const isEnabled = await TwoFactorService_1.TwoFactorService.is2FAEnabled(userId);
    res.status(200).json({
        message: '2FA status retrieved',
        data: {
            enabled: isEnabled
        }
    });
});
/**
 * Obtém estatísticas de 2FA (admin only)
 */
TwoFactorController.getStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    if (req.user.role !== 'admin') {
        throw (0, errorHandler_1.ApiError)('Only admins can view 2FA stats', 403);
    }
    const stats = await TwoFactorService_1.TwoFactorService.getStats();
    res.status(200).json({
        message: '2FA stats retrieved',
        data: { stats }
    });
});
//# sourceMappingURL=TwoFactorController.js.map