import { Response } from 'express';
import { AuthRequest, asyncHandler, ApiError } from '../middleware/errorHandler';
import { TwoFactorService } from '../services/TwoFactorService';
import { twoFactorSetupSchema, twoFactorVerifySchema, backupCodeSchema } from '../utils/schemas';
import { logger } from '../utils/logger-advanced';

export class TwoFactorController {
  /**
   * Inicia configuração do 2FA
   */
  static setup2FA = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;
    const userEmail = req.user!.email;

    // Verificar se 2FA já está ativado
    const isEnabled = await TwoFactorService.is2FAEnabled(userId);
    if (isEnabled) {
      throw ApiError('2FA is already enabled for this account', 400);
    }

    const secretData = await TwoFactorService.generateTOTPSecret(userEmail);

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
  static enable2FA = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = twoFactorSetupSchema.validate(req.body);
    if (error) {
      throw ApiError(error.details[0].message, 400);
    }

    const userId = req.user!.id;
    const { secret, token } = value;

    // Verificar se 2FA já está ativado
    const isEnabled = await TwoFactorService.is2FAEnabled(userId);
    if (isEnabled) {
      throw ApiError('2FA is already enabled for this account', 400);
    }

    // Verificar o código TOTP
    const isValid = TwoFactorService.verifyTOTPCode(secret, token);
    if (!isValid) {
      throw ApiError('Invalid 2FA code', 400);
    }

    // Ativar 2FA
    await TwoFactorService.enable2FA(userId, secret);

    // Gerar códigos de backup
    const backupCodes = TwoFactorService.generateBackupCodes();
    await TwoFactorService.saveBackupCodes(userId, backupCodes);

    logger.info(`2FA enabled for user ${userId}`);

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
  static disable2FA = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    // Verificar se 2FA está ativado
    const isEnabled = await TwoFactorService.is2FAEnabled(userId);
    if (!isEnabled) {
      throw ApiError('2FA is not enabled for this account', 400);
    }

    await TwoFactorService.disable2FA(userId);

    logger.info(`2FA disabled for user ${userId}`);

    res.status(200).json({
      message: '2FA disabled successfully'
    });
  });

  /**
   * Verifica código 2FA (durante login)
   */
  static verify2FA = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = twoFactorVerifySchema.validate(req.body);
    if (error) {
      throw ApiError(error.details[0].message, 400);
    }

    const userId = req.user!.id;
    const { token } = value;

    const result = await TwoFactorService.validate2FACode(userId, token);

    if (!result.verified) {
      throw ApiError(result.message, 400);
    }

    res.status(200).json({
      message: result.message
    });
  });

  /**
   * Verifica código de backup
   */
  static verifyBackupCode = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { error, value } = backupCodeSchema.validate(req.body);
    if (error) {
      throw ApiError(error.details[0].message, 400);
    }

    const userId = req.user!.id;
    const { code } = value;

    const isValid = await TwoFactorService.validateBackupCode(userId, code);

    if (!isValid) {
      throw ApiError('Invalid backup code', 400);
    }

    res.status(200).json({
      message: 'Backup code verified successfully'
    });
  });

  /**
   * Regenera códigos de backup
   */
  static regenerateBackupCodes = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    // Verificar se 2FA está ativado
    const isEnabled = await TwoFactorService.is2FAEnabled(userId);
    if (!isEnabled) {
      throw ApiError('2FA must be enabled to regenerate backup codes', 400);
    }

    const backupCodes = TwoFactorService.generateBackupCodes();
    await TwoFactorService.saveBackupCodes(userId, backupCodes);

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
  static getStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.id;

    const isEnabled = await TwoFactorService.is2FAEnabled(userId);

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
  static getStats = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (req.user!.role !== 'admin') {
      throw ApiError('Only admins can view 2FA stats', 403);
    }

    const stats = await TwoFactorService.getStats();

    res.status(200).json({
      message: '2FA stats retrieved',
      data: { stats }
    });
  });
}