const db = require('../db');
const PixPaymentService = require('./PixPaymentService');

/**
 * PaymentReconciliationService
 * Reconcilia pagamentos PIX entre banco e sistema local
 * Verifica se todos os pagamentos foram realmente processados
 */
class PaymentReconciliationService {
  constructor() {
    this.reconciliationWindow = parseInt(process.env.RECONCILIATION_WINDOW_HOURS || '24');
  }

  /**
   * Executar reconciliação completa
   */
  async reconcileAll() {
    console.log('🔄 Iniciando reconciliação de pagamentos...');
    
    try {
      const unreconciled = await db.all(
        `SELECT p.id, p.transaction_id, p.booking_id, p.status, p.created_at 
         FROM payments p 
         WHERE p.method = 'pix' 
         AND p.status IN ('pending', 'waiting')
         AND p.created_at > datetime('now', '-' || ? || ' hours')
         ORDER BY p.created_at ASC`,
        this.reconciliationWindow
      );

      console.log(`📊 Encontrados ${unreconciled.length} pagamentos pendentes para reconciliar`);

      let reconciled = 0;
      let failed = 0;

      for (const payment of unreconciled) {
        const result = await this.reconcilePayment(payment);
        if (result.reconciled) {
          reconciled++;
        } else {
          failed++;
        }
      }

      console.log(`✅ Reconciliação concluída: ${reconciled} reconciliados, ${failed} falhados`);
      
      return {
        success: true,
        total: unreconciled.length,
        reconciled,
        failed,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Erro na reconciliação:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reconciliar um pagamento específico
   */
  async reconcilePayment(payment) {
    const { id, transaction_id, booking_id, status } = payment;

    try {
      // 1. Consultar status real do PIX junto ao banco (placeholder)
      const bankStatus = await this.checkBankStatus(transaction_id);

      // 2. Registrar tentativa de reconciliação
      await db.run(
        `INSERT INTO payment_reconciliation (transaction_id, booking_id, payment_id, pix_status_from_bank, status_in_system)
         VALUES (?, ?, ?, ?, ?)`,
        transaction_id,
        booking_id,
        id,
        bankStatus.status,
        status
      );

      // 3. Se banco confirma pagamento, atualizar no sistema
      if (bankStatus.status === 'confirmed' && status !== 'confirmed') {
        console.log(`📌 Atualizando pagamento ${transaction_id} para confirmed`);

        await db.run(
          `UPDATE payments SET status = 'confirmed', confirmed_at = ? WHERE id = ?`,
          new Date().toISOString(),
          id
        );

        // 4. Atualizar booking para completed
        if (booking_id) {
          await db.run(
            `UPDATE bookings SET status = 'completed', updated_at = ? WHERE id = ?`,
            new Date().toISOString(),
            booking_id
          );
        }

        // 5. Marcar reconciliação como sucesso
        await db.run(
          `UPDATE payment_reconciliation SET reconciled = 1, reconciled_at = ? WHERE transaction_id = ?`,
          new Date().toISOString(),
          transaction_id
        );

        return { reconciled: true, transactionId: transaction_id };
      } else if (bankStatus.status === 'expired' || bankStatus.status === 'rejected') {
        // PIX expirou ou foi rejeitado
        console.log(`⏰ Marcando PIX ${transaction_id} como expirado`);

        await db.run(
          `UPDATE payments SET status = 'expired', updated_at = ? WHERE id = ?`,
          new Date().toISOString(),
          id
        );

        await db.run(
          `UPDATE payment_reconciliation SET reconciled = 1, reconciled_at = ? WHERE transaction_id = ?`,
          new Date().toISOString(),
          transaction_id
        );

        return { reconciled: true, transactionId: transaction_id, expired: true };
      } else {
        // Ainda pendente no banco
        console.log(`⏳ PIX ${transaction_id} ainda está pendente no banco`);
        return { reconciled: false, transactionId: transaction_id, reason: 'pending_in_bank' };
      }
    } catch (error) {
      console.error(`❌ Erro ao reconciliar ${transaction_id}:`, error.message);
      return { reconciled: false, error: error.message };
    }
  }

  /**
   * Consultar status PIX no banco (placeholder)
   * Em produção, chamar API real do banco (BB, Itaú, etc)
   */
  async checkBankStatus(transactionId) {
    try {
      // TODO: Implementar chamada real à API do banco
      // Por enquanto, retornar status fictício para testes

      // Simulação: se QR code tiver mais de 10 minutos, assumir como expirado
      const payment = await db.get(
        `SELECT p.* FROM payments p WHERE p.transaction_id = ?`,
        transactionId
      );

      if (!payment) {
        return { status: 'not_found' };
      }

      const createdAt = new Date(payment.created_at);
      const now = new Date();
      const diffMinutes = (now - createdAt) / (1000 * 60);

      // QR codes PIX têm validade de 10 minutos
      if (diffMinutes > 10 && payment.status !== 'confirmed') {
        return { status: 'expired' };
      }

      // Dados fictícios: 80% de chance de estar pendente, 20% de estar confirmado
      const random = Math.random();
      if (random < 0.2) {
        return { status: 'confirmed' };
      }

      return { status: 'pending' };
    } catch (error) {
      console.error('❌ Erro ao consultar status do banco:', error.message);
      return { status: 'error', error: error.message };
    }
  }

  /**
   * Obter histórico de reconciliações
   */
  async getHistory(limit = 100) {
    try {
      const history = await db.all(
        `SELECT * FROM payment_reconciliation 
         ORDER BY checked_at DESC 
         LIMIT ?`,
        limit
      );
      return history || [];
    } catch (error) {
      console.error('❌ Erro ao obter histórico:', error.message);
      return [];
    }
  }

  /**
   * Obter estatísticas de reconciliação
   */
  async getStats() {
    try {
      const stats = await db.get(
        `SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN reconciled = 1 THEN 1 ELSE 0 END) as reconciled,
          SUM(CASE WHEN reconciled = 0 THEN 1 ELSE 0 END) as pending
         FROM payment_reconciliation`
      );

      return stats || { total: 0, reconciled: 0, pending: 0 };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas:', error.message);
      return { error: error.message };
    }
  }

  /**
   * Limpar eventos antigos (mais de 30 dias)
   */
  async cleanupOldRecords(daysAgo = 30) {
    try {
      const result = await db.run(
        `DELETE FROM payment_reconciliation 
         WHERE checked_at < datetime('now', '-' || ? || ' days')`,
        daysAgo
      );

      console.log(`🧹 Limpeza executada: ${result.changes || 0} registros antigos removidos`);
      return { success: true, removedRecords: result.changes || 0 };
    } catch (error) {
      console.error('❌ Erro ao limpar registros:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PaymentReconciliationService();
