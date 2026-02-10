const { randomUUID } = require('crypto');
const PixService = require('./PixService');

const payments = new Map();

function cents(amount) {
  return Math.round(Number(amount) * 100);
}

module.exports = {
  async createStripePayment(data) {
    const id = `pi_${randomUUID().slice(0,8)}`;
    const amount = String(cents(data.amount));
    const payment = {
      id,
      status: 'succeeded',
      amount,
      currency: data.currency || 'BRL',
      metadata: data.metadata || {},
      createdAt: new Date()
    };
    payments.set(id, payment);
    return payment;
  },

  async createPixPayment(data) {
    const id = `pix_${randomUUID().slice(0,8)}`;
    const qr = `QR_${randomUUID().slice(0,6)}`;
    const payment = {
      id,
      qrCode: qr,
      status: 'pending',
      amount: (Number(data.amount)).toFixed(2),
      expiresAt: new Date(Date.now() + (process.env.PIX_EXPIRES_MS ? Number(process.env.PIX_EXPIRES_MS) : 3600 * 1000)),
      createdAt: new Date()
    };
    payments.set(id, payment);
    return payment;
  },

  async processWebhook(event) {
    try {
      if (event.type === 'pix.payment_confirmed' || event.source === 'pix') {
        const pixId = event.data.pixTransactionId || event.data.id;
        const bankTx = event.data.bankTransactionId || null;
        // call PixService.confirmPayment if available
        if (PixService && typeof PixService.confirmPayment === 'function') {
          await PixService.confirmPayment(pixId, bankTx);
        }
        return { success: true };
      }
      // Generic accept
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  async requestRefund(paymentId, amount) {
    const id = `rf_${randomUUID().slice(0,8)}`;
    const refund = { id, status: 'pending', amount };
    return refund;
  },

  async reconcilePayments() {
    return { reconciled: 0, failed: 0, timestamp: Date.now() };
  },

  async getPaymentHistory(customerId) {
    const list = Array.from(payments.values()).filter(p => (p.metadata && p.metadata.customerId) === customerId || true);
    return { customerId, payments: list };
  },

  async getPaymentStatus(id) {
    const p = payments.get(id);
    if (!p) throw new Error('Payment not found');
    return { id: p.id, status: p.status, amount: Number(p.amount || p.amount) };
  }
};
