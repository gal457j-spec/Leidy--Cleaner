/**
 * TwoFactorAuth.js - 2FA com TOTP (Time-based One-Time Password)
 */

const speakeasy = require('speakeasy');
const logger = require('../utils/logger');
const db = require('../db');

class TwoFactorAuth {
  /**
   * Gerar secret para novo 2FA
   */
  static generateSecret(email) {
    return speakeasy.generateSecret({
      name: `Limpeza Pro (${email})`,
      issuer: 'Limpeza Pro',
      length: 32
    });
  }

  /**
   * Gerar backup codes (9 códigos para caso perca acesso)
   */
  static generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 9; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    return codes;
  }

  /**
   * Verificar token TOTP
   */
  static verify(secret, token, options = {}) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: options.window || 2 // ±2 passos = ±60 segundos
    });
  }

  /**
   * Setup 2FA - Gerar QR e secret
   */
  static async setupTwoFactor(userId) {
    try {
      const user = await db.get('SELECT email FROM users WHERE id = ?', userId);
      if (!user) {
        return { success: false, error: 'Usuário não encontrado' };
      }

      const secret = this.generateSecret(user.email);
      const backupCodes = this.generateBackupCodes();

      // Salvar como "pending" (não ativado ainda)
      await db.run(
        `UPDATE users 
         SET two_fa_pending = ?, two_fa_backup_codes = ?
         WHERE id = ?`,
        secret.base32,
        JSON.stringify(backupCodes),
        userId
      );

      logger.info('2FA setup initiated', { userId });

      return {
        success: true,
        secret: secret.base32,
        qrCode: secret.otpauth_url,
        backupCodes
      };
    } catch (err) {
      logger.error('2FA setup failed', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Confirmar 2FA com token
   */
  static async confirmTwoFactor(userId, token) {
    try {
      const user = await db.get(
        'SELECT two_fa_pending FROM users WHERE id = ?',
        userId
      );

      if (!user || !user.two_fa_pending) {
        return { success: false, error: '2FA não foi iniciado' };
      }

      // Verificar token
      if (!this.verify(user.two_fa_pending, token)) {
        return { success: false, error: 'Token inválido' };
      }

      // Ativar 2FA
      await db.run(
        `UPDATE users 
         SET two_fa_secret = ?, two_fa_enabled = 1, two_fa_pending = NULL
         WHERE id = ?`,
        user.two_fa_pending,
        userId
      );

      logger.info('2FA enabled', { userId });

      return {
        success: true,
        message: '2FA ativado com sucesso'
      };
    } catch (err) {
      logger.error('2FA confirmation failed', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Verificar 2FA durante login
   */
  static async verifyLogin2FA(userId, token, useBackupCode = false) {
    try {
      const user = await db.get(
        'SELECT two_fa_secret, two_fa_backup_codes FROM users WHERE id = ?',
        userId
      );

      if (!user || !user.two_fa_secret) {
        return { success: false, error: '2FA não ativado' };
      }

      if (useBackupCode) {
        // Verificar backup code
        const backupCodes = JSON.parse(user.two_fa_backup_codes || '[]');
        if (!backupCodes.includes(token)) {
          return { success: false, error: 'Código de backup inválido' };
        }

        // Remover código usado
        const newCodes = backupCodes.filter(code => code !== token);
        await db.run(
          'UPDATE users SET two_fa_backup_codes = ? WHERE id = ?',
          JSON.stringify(newCodes),
          userId
        );

        logger.warn('Backup code used', { userId });
      } else {
        // Verificar TOTP token
        if (!this.verify(user.two_fa_secret, token)) {
          return { success: false, error: 'Token 2FA inválido' };
        }
      }

      return { success: true, message: '2FA verificado' };
    } catch (err) {
      logger.error('2FA verification failed', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Desabilitar 2FA
   */
  static async disableTwoFactor(userId, password) {
    try {
      // Verificar senha antes de desabilitar security
      const user = await db.get('SELECT password FROM users WHERE id = ?', userId);
      const bcrypt = require('bcrypt');
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return { success: false, error: 'Senha incorreta' };
      }

      await db.run(
        `UPDATE users 
         SET two_fa_secret = NULL, two_fa_enabled = 0, two_fa_backup_codes = NULL
         WHERE id = ?`,
        userId
      );

      logger.info('2FA disabled', { userId });

      return { success: true, message: '2FA desativado' };
    } catch (err) {
      logger.error('2FA disable failed', err);
      return { success: false, error: err.message };
    }
  }
}

module.exports = TwoFactorAuth;
