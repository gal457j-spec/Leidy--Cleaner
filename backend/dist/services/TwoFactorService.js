"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoFactorService = void 0;
const speakeasy_1 = __importDefault(require("speakeasy"));
const qrcode_1 = __importDefault(require("qrcode"));
const database_1 = require("../utils/database");
const logger_advanced_1 = require("../utils/logger-advanced");
class TwoFactorService {
    /**
     * Gera um segredo TOTP para um usuário
     */
    static async generateTOTPSecret(email) {
        try {
            const secret = speakeasy_1.default.generateSecret({
                name: `Leidy Cleaner (${email})`,
                issuer: 'Leidy Cleaner',
                length: 32
            });
            const otpauthUrl = speakeasy_1.default.otpauthURL({
                secret: secret.base32,
                label: encodeURIComponent(`Leidy Cleaner (${email})`),
                issuer: 'Leidy Cleaner',
                encoding: 'base32'
            });
            const qrCode = await qrcode_1.default.toDataURL(otpauthUrl);
            return {
                secret: secret.base32,
                otpauthUrl,
                qrCode
            };
        }
        catch (error) {
            logger_advanced_1.logger.error('Error generating TOTP secret:', error);
            throw new Error('Failed to generate 2FA secret');
        }
    }
    /**
     * Verifica um código TOTP
     */
    static verifyTOTPCode(secret, token) {
        try {
            return speakeasy_1.default.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: token,
                window: 2 // Permite uma janela de 2 códigos (30 segundos antes/depois)
            });
        }
        catch (error) {
            logger_advanced_1.logger.error('Error verifying TOTP code:', error);
            return false;
        }
    }
    /**
     * Ativa 2FA para um usuário
     */
    static async enable2FA(userId, secret) {
        try {
            await (0, database_1.query)('UPDATE users SET two_factor_secret = $1, two_factor_enabled = true WHERE id = $2', [secret, userId]);
            logger_advanced_1.logger.info(`2FA enabled for user ${userId}`);
        }
        catch (error) {
            logger_advanced_1.logger.error('Error enabling 2FA:', error);
            throw new Error('Failed to enable 2FA');
        }
    }
    /**
     * Desativa 2FA para um usuário
     */
    static async disable2FA(userId) {
        try {
            await (0, database_1.query)('UPDATE users SET two_factor_secret = NULL, two_factor_enabled = false WHERE id = $1', [userId]);
            logger_advanced_1.logger.info(`2FA disabled for user ${userId}`);
        }
        catch (error) {
            logger_advanced_1.logger.error('Error disabling 2FA:', error);
            throw new Error('Failed to disable 2FA');
        }
    }
    /**
     * Verifica se 2FA está ativado para um usuário
     */
    static async is2FAEnabled(userId) {
        try {
            const result = await (0, database_1.query)('SELECT two_factor_enabled FROM users WHERE id = $1', [userId]);
            return result.length > 0 && result[0].two_factor_enabled === true;
        }
        catch (error) {
            logger_advanced_1.logger.error('Error checking 2FA status:', error);
            return false;
        }
    }
    /**
     * Obtém o segredo 2FA de um usuário
     */
    static async get2FASecret(userId) {
        try {
            const result = await (0, database_1.query)('SELECT two_factor_secret FROM users WHERE id = $1', [userId]);
            return result.length > 0 ? result[0].two_factor_secret : null;
        }
        catch (error) {
            logger_advanced_1.logger.error('Error getting 2FA secret:', error);
            return null;
        }
    }
    /**
     * Valida um código 2FA durante o login
     */
    static async validate2FACode(userId, token) {
        try {
            const secret = await this.get2FASecret(userId);
            if (!secret) {
                return {
                    verified: false,
                    message: '2FA not enabled for this user'
                };
            }
            const isValid = this.verifyTOTPCode(secret, token);
            if (isValid) {
                // Registrar tentativa bem-sucedida
                await (0, database_1.query)('UPDATE users SET last_2fa_verification = NOW() WHERE id = $1', [userId]);
                return {
                    verified: true,
                    message: '2FA verification successful'
                };
            }
            else {
                // Registrar tentativa falhada
                await (0, database_1.query)('UPDATE users SET failed_2fa_attempts = COALESCE(failed_2fa_attempts, 0) + 1 WHERE id = $1', [userId]);
                return {
                    verified: false,
                    message: 'Invalid 2FA code'
                };
            }
        }
        catch (error) {
            logger_advanced_1.logger.error('Error validating 2FA code:', error);
            return {
                verified: false,
                message: '2FA validation failed'
            };
        }
    }
    /**
     * Gera códigos de backup para recuperação
     */
    static generateBackupCodes() {
        const codes = [];
        for (let i = 0; i < 10; i++) {
            codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
        }
        return codes;
    }
    /**
     * Salva códigos de backup para um usuário
     */
    static async saveBackupCodes(userId, codes) {
        try {
            const hashedCodes = codes.map(code => require('crypto').createHash('sha256').update(code).digest('hex'));
            await (0, database_1.query)('UPDATE users SET backup_codes = $1 WHERE id = $2', [JSON.stringify(hashedCodes), userId]);
        }
        catch (error) {
            logger_advanced_1.logger.error('Error saving backup codes:', error);
            throw new Error('Failed to save backup codes');
        }
    }
    /**
     * Valida um código de backup
     */
    static async validateBackupCode(userId, code) {
        try {
            const result = await (0, database_1.query)('SELECT backup_codes FROM users WHERE id = $1', [userId]);
            if (result.length === 0 || !result[0].backup_codes) {
                return false;
            }
            const hashedCodes = JSON.parse(result[0].backup_codes);
            const hashedCode = require('crypto').createHash('sha256').update(code).digest('hex');
            const index = hashedCodes.indexOf(hashedCode);
            if (index === -1) {
                return false;
            }
            // Remove o código usado
            hashedCodes.splice(index, 1);
            await (0, database_1.query)('UPDATE users SET backup_codes = $1 WHERE id = $2', [JSON.stringify(hashedCodes), userId]);
            return true;
        }
        catch (error) {
            logger_advanced_1.logger.error('Error validating backup code:', error);
            return false;
        }
    }
    /**
     * Obtém estatísticas de 2FA
     */
    static async getStats() {
        try {
            const totalResult = await (0, database_1.query)('SELECT COUNT(*) as count FROM users');
            const enabledResult = await (0, database_1.query)('SELECT COUNT(*) as count FROM users WHERE two_factor_enabled = true');
            const recentResult = await (0, database_1.query)("SELECT COUNT(*) as count FROM users WHERE last_2fa_verification > NOW() - INTERVAL '24 hours'");
            return {
                totalUsers: parseInt(totalResult[0].count),
                usersWith2FA: parseInt(enabledResult[0].count),
                recentVerifications: parseInt(recentResult[0].count)
            };
        }
        catch (error) {
            logger_advanced_1.logger.error('Error getting 2FA stats:', error);
            return { totalUsers: 0, usersWith2FA: 0, recentVerifications: 0 };
        }
    }
}
exports.TwoFactorService = TwoFactorService;
//# sourceMappingURL=TwoFactorService.js.map