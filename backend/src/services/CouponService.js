/**
 * CouponService.js - Gerenciar cupons, descontos e códigos promocionais
 */

const db = require('../db');
const logger = require('../utils/logger');

class CouponService {
  /**
   * Validar cupom
   */
  static async validateCoupon(code, userId = null) {
    try {
      const coupon = await db.get(
        'SELECT * FROM coupons WHERE UPPER(code) = UPPER(?) AND is_active = 1',
        code
      );

      if (!coupon) {
        return { valid: false, error: 'Cupom inválido ou expirado' };
      }

      // Validar datas
      const now = new Date();
      if (coupon.valid_from && new Date(coupon.valid_from) > now) {
        return { valid: false, error: 'Cupom ainda não é válido' };
      }

      if (coupon.valid_until && new Date(coupon.valid_until) < now) {
        return { valid: false, error: 'Cupom expirado' };
      }

      // Verificar limite de uses
      if (coupon.max_uses) {
        const [{ uses }] = await db.all(
          'SELECT COUNT(*) as uses FROM coupon_uses WHERE coupon_id = ?',
          coupon.id
        );

        if (uses >= coupon.max_uses) {
          return { valid: false, error: 'Cupom atingiu limite de usos' };
        }
      }

      // Verificar se usuário já usou (limite por usuário)
      if (userId && coupon.limit_per_user) {
        const [{ userUses }] = await db.all(
          'SELECT COUNT(*) as userUses FROM coupon_uses WHERE coupon_id = ? AND user_id = ?',
          coupon.id,
          userId
        );

        if (userUses >= coupon.limit_per_user) {
          return { valid: false, error: `Você já usou este cupom (máx ${coupon.limit_per_user}x)` };
        }
      }

      return {
        valid: true,
        coupon: {
          code: coupon.code,
          discountPercent: coupon.discount_percent,
          discountFlat: coupon.discount_flat,
          minAmount: coupon.min_amount || 0,
          description: coupon.description
        }
      };
    } catch (err) {
      logger.error('Coupon validation failed', err);
      return { valid: false, error: 'Erro ao validar cupom' };
    }
  }

  /**
   * Aplicar cupom a um booking
   */
  static async applyCoupon(bookingId, couponCode, userId) {
    try {
      const booking = await db.get(
        'SELECT id, user_id, total_price FROM bookings WHERE id = ?',
        bookingId
      );

      if (!booking) {
        return { success: false, error: 'Agendamento não encontrado' };
      }

      // Validar cupom
      const validation = await this.validateCoupon(couponCode, userId);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      const coupon = validation.coupon;

      // Validar valor mínimo
      if (booking.total_price < coupon.minAmount) {
        return {
          success: false,
          error: `Valor mínimo não atingido (mín: R$ ${coupon.minAmount})`
        };
      }

      // Calcular desconto
      let discountAmount = 0;
      if (coupon.discountPercent) {
        discountAmount = (booking.total_price * coupon.discountPercent) / 100;
      } else if (coupon.discountFlat) {
        discountAmount = coupon.discountFlat;
      }

      // Não deixar desconto maior que o valor
      discountAmount = Math.min(discountAmount, booking.total_price * 0.9);

      // Buscar coupon ID
      const couponRecord = await db.get(
        'SELECT id FROM coupons WHERE UPPER(code) = UPPER(?)',
        couponCode
      );

      // Registrar uso do cupom
      await db.run(
        `INSERT INTO coupon_uses (coupon_id, user_id, booking_id, discount_amount, used_at)
         VALUES (?, ?, ?, ?, datetime('now'))`,
        couponRecord.id,
        userId,
        bookingId,
        discountAmount
      );

      // Atualizar booking com desconto
      const newTotal = booking.total_price - discountAmount;
      await db.run(
        `UPDATE bookings 
         SET discount_amount = ?, final_price = ?
         WHERE id = ?`,
        discountAmount,
        newTotal,
        bookingId
      );

      logger.info('Coupon applied', {
        bookingId,
        couponCode,
        discountAmount,
        userId
      });

      return {
        success: true,
        discountAmount,
        newTotal,
        message: `R$ ${discountAmount.toFixed(2)} de desconto aplicado!`
      };
    } catch (err) {
      logger.error('Coupon application failed', err);
      return { success: false, error: 'Erro ao aplicar cupom' };
    }
  }

  /**
   * Criar novo cupom (admin only)
   */
  static async createCoupon(data) {
    try {
      const {
        code,
        discountPercent,
        discountFlat,
        maxUses,
        limitPerUser,
        minAmount,
        description,
        validFrom,
        validUntil,
        createdBy
      } = data;

      // Validar código único
      const existing = await db.get(
        'SELECT id FROM coupons WHERE UPPER(code) = UPPER(?)',
        code
      );

      if (existing) {
        return { success: false, error: 'Código de cupom já existe' };
      }

      // Validar desconto
      if (!discountPercent && !discountFlat) {
        return { success: false, error: 'Defina desconto percentual ou fixo' };
      }

      if (discountPercent && (discountPercent < 1 || discountPercent > 100)) {
        return { success: false, error: 'Desconto deve ser entre 1 e 100%' };
      }

      await db.run(
        `INSERT INTO coupons (code, discount_percent, discount_flat, max_uses, limit_per_user, 
                             min_amount, description, valid_from, valid_until, created_by, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        code,
        discountPercent || null,
        discountFlat || null,
        maxUses || null,
        limitPerUser || 1,
        minAmount || 0,
        description || '',
        validFrom || null,
        validUntil || null,
        createdBy
      );

      logger.info('Coupon created', { code, createdBy });

      return {
        success: true,
        message: `Cupom "${code}" criado com sucesso!`
      };
    } catch (err) {
      logger.error('Coupon creation failed', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Listar cupons (admin only)
   */
  static async listCoupons(filters = {}) {
    try {
      let query = 'SELECT * FROM coupons WHERE 1=1';
      const params = [];

      if (filters.active !== undefined) {
        query += ' AND is_active = ?';
        params.push(filters.active ? 1 : 0);
      }

      query += ' ORDER BY created_at DESC LIMIT 100';

      const coupons = await db.all(query, ...params);

      // Enriquecer com dados de uso
      for (const coupon of coupons) {
        const [{ uses }] = await db.all(
          'SELECT COUNT(*) as uses FROM coupon_uses WHERE coupon_id = ?',
          coupon.id
        );
        coupon.totalUses = uses;
      }

      return { success: true, coupons };
    } catch (err) {
      logger.error('List coupons failed', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Desabilitar cupom
   */
  static async disableCoupon(couponId) {
    try {
      await db.run(
        'UPDATE coupons SET is_active = 0 WHERE id = ?',
        couponId
      );

      logger.info('Coupon disabled', { couponId });

      return { success: true, message: 'Cupom desativado' };
    } catch (err) {
      logger.error('Disable coupon failed', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Relatório de cupons
   */
  static async getCouponReport(couponId) {
    try {
      const coupon = await db.get('SELECT * FROM coupons WHERE id = ?', couponId);

      const [{ totalUses }] = await db.all(
        'SELECT COUNT(*) as totalUses FROM coupon_uses WHERE coupon_id = ?',
        couponId
      );

      const [{ totalDiscount }] = await db.all(
        'SELECT SUM(discount_amount) as totalDiscount FROM coupon_uses WHERE coupon_id = ?',
        couponId
      );

      return {
        success: true,
        report: {
          ...coupon,
          totalUses,
          totalDiscount: totalDiscount || 0,
          usageRate: coupon.max_uses ? `${((totalUses / coupon.max_uses) * 100).toFixed(1)}%` : 'Ilimitado'
        }
      };
    } catch (err) {
      logger.error('Coupon report failed', err);
      return { success: false, error: err.message };
    }
  }
}

module.exports = CouponService;
