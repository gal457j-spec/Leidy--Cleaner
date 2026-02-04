/**
 * PixService.js - Integração PIX via Brcode
 * Gera QR codes e valida pagamentos PIX
 */

const logger = require('../utils/logger');
const crypto = require('crypto');
const db = require('../db');

class PixService {
  /**
   * Gerar QR Code PIX dinâmico
   * @param {number} amount - Valor em reais
   * @param {string} orderId - ID do agendamento/transação
   * @param {string} description - Descrição do pagamento
   */
  static async generateQRCode(amount, orderId, description = 'Limpeza Pro') {
    try {
      // Como não temos dependência de brcode, vamos gerar o formato manual
      // Format: 00020126580014br.gov.bcb.pix...
      
      const pixKey = process.env.PIX_KEY || 'limpezapro@pix.com';
      const merchantName = 'LIMPEZA PRO LTDA';
      const merchantCity = 'SAO PAULO';
      
      // Braz QR Code (Simplified format)
      const brCode = this.generateBRCode({
        pixKey,
        amount,
        merchantName,
        merchantCity,
        description,
        orderId
      });

      // Salvar PIX pendente no BD
      const pixTransactionId = crypto.randomUUID();
      await db.run(
        `INSERT INTO pix_transactions (id, amount, status, order_id, br_code, expires_at)
         VALUES (?, ?, 'pending', ?, ?, datetime('now', '+30 minutes'))`,
        pixTransactionId, amount, orderId, brCode
      );

      logger.info('PIX QR Code generated', { pixTransactionId, amount });

      return {
        success: true,
        pixTransactionId,
        brCode,
        amount,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        message: 'Escaneie o código QR com seu banco'
      };
    } catch (err) {
      logger.error('PIX generation failed', err);
      return { 
        success: false, 
        error: 'Erro ao gerar QR Code PIX',
        code: 'PIX_GENERATION_FAILED'
      };
    }
  }

  /**
   * Verificar se PIX foi pago
   * Em produção, usar API do banco (Banco do Brasil, Bradesco, etc)
   */
  static async verifyPayment(pixTransactionId) {
    try {
      const pix = await db.get(
        `SELECT * FROM pix_transactions WHERE id = ?`,
        pixTransactionId
      );

      if (!pix) {
        return { success: false, error: 'Transação PIX não encontrada' };
      }

      if (pix.status === 'paid') {
        return { success: true, status: 'paid', amount: pix.amount };
      }

      // TODO: Integrar com API do banco para verificar status real
      // Por agora, usar webhook quando chegar pagamento
      
      return { 
        success: true, 
        status: pix.status, 
        amount: pix.amount,
        expiresAt: pix.expires_at
      };
    } catch (err) {
      logger.error('PIX verification failed', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Confirmar pagamento PIX (via webhook do banco)
   */
  static async confirmPayment(pixTransactionId, bankTransactionId) {
    try {
      const pix = await db.get(
        `SELECT * FROM pix_transactions WHERE id = ?`,
        pixTransactionId
      );

      if (!pix) {
        return { success: false, error: 'PIX não encontrado' };
      }

      // Atualizar status
      await db.run(
        `UPDATE pix_transactions SET status = 'paid', bank_transaction_id = ? WHERE id = ?`,
        bankTransactionId, pixTransactionId
      );

      // Atualizar booking relacionado
      if (pix.order_id) {
        await db.run(
          `UPDATE bookings SET status = 'confirmed', paid = 1 WHERE id = ?`,
          pix.order_id
        );
      }

      logger.info('PIX payment confirmed', { pixTransactionId, bankTransactionId });

      return { success: true, message: 'Pagamento PIX confirmado' };
    } catch (err) {
      logger.error('PIX confirmation failed', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Gerar BRCode manualmente (formato ABNT)
   * Simplificado - em produção usar biblioteca especializada
   */
  static generateBRCode(data) {
    const { pixKey, amount, merchantName, merchantCity, description, orderId } = data;
    
    // Formato: um formato bem simplificado
    // Em produção usar: npm install brcode
    const brCode = [
      '00020126360014br.gov.bcb.pix',
      '0136' + pixKey,
      '52040000',
      '5303986', // Código da moeda (986 = BRL)
      '540' + String(Math.round(amount * 100)).padStart(10, '0'),
      '60' + description.substring(0, 14),
      '62' + orderId.substring(0, 25)
    ].join('');

    return brCode;
  }

  /**
   * Calcular hash para CRC16 (necessário para BRCode válido)
   */
  static calculateCRC16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = (crc << 1) ^ ((crc & 0x8000) ? 0x1021 : 0);
      }
    }
    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }
}

module.exports = PixService;
