/**
 * Invoice Model
 * Schema de faturas
 */

class Invoice {
  constructor(data) {
    this.id = data.id || Math.random().toString(36).substr(2, 9);
    this.bookingId = data.bookingId;
    this.userId = data.userId;
    this.amount = data.amount;
    this.tax = data.tax || 0;
    this.discount = data.discount || 0;
    this.total = data.total;
    this.status = data.status || 'pending'; // 'pending', 'paid', 'overdue', 'refunded'
    this.dueDate = data.dueDate;
    this.paidDate = data.paidDate;
    this.paymentMethod = data.paymentMethod; // 'stripe', 'mercadopago', 'pix'
    this.notes = data.notes;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

module.exports = Invoice;
