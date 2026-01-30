/**
 * Booking Model
 * Schema de agendamentos
 */

class Booking {
  constructor(data) {
    this.id = data.id || Math.random().toString(36).substr(2, 9);
    this.userId = data.userId;
    this.teamMemberId = data.teamMemberId;
    this.date = data.date;
    this.services = data.services; // Array de serviços
    this.address = data.address;
    this.notes = data.notes;
    this.metragem = data.metragem;
    this.frequencia = data.frequencia; // 'unica', 'semanal', 'quinzenal', 'mensal'
    this.urgencia = data.urgencia; // 'normal', 'express', 'emergencia'
    this.price = data.price;
    this.status = data.status || 'pending'; // 'pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'
    this.paymentStatus = data.paymentStatus || 'unpaid'; // 'unpaid', 'paid', 'refunded'
    this.route = data.route;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }
}

module.exports = Booking;
