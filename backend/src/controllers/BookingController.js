/**
 * Booking Controller
 * Gerencia todas as operações relacionadas a agendamentos
 */

const BookingService = require('../services/BookingService');

class BookingController {
  /**
   * Criar novo agendamento
   */
  async createBooking(req, res) {
    try {
      const { userId, date, services, address, notes, cep, photos, location, metragem, frequencia, urgencia } = req.body;

      // Validar dados
      if (!userId || !date || !services || !address) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      // Verificar disponibilidade da data
      const isAvailable = await this.checkAvailability(date);
      if (!isAvailable) {
        return res.status(400).json({ error: 'Data não disponível' });
      }

      // Criar agendamento via service (encapsula validações e cálculos)
      const bookingData = { userId, date, services, address, notes, cep, photos, location, metragem, frequencia, urgencia };
      const booking = await BookingService.createBooking(bookingData);

      // Persistir no banco quando implementado
      // await Database.Bookings.insert(booking);

      // Disparar automações (ex.: envio de confirmação)
      // await AutomationService.executeBookingAutomations(booking);

      res.status(201).json({ success: true, booking });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obter agendamentos do usuário
   */
  async getUserBookings(req, res) {
    try {
      const { userId } = req.params;
      const bookings = await BookingService.findByUserId(userId);

      res.json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Atualizar agendamento
   */
  async updateBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const { date, services, notes } = req.body;

      // Validar se a nova data está disponível
      if (date) {
        const isAvailable = await this.checkAvailability(date);
        if (!isAvailable) {
          return res.status(400).json({ error: 'Data não disponível' });
        }
      }

      // Atualizar agendamento
      // const updatedBooking = await BookingService.update(bookingId, {...});

      // Enviar notificação de alteração
      // await sendReschedulingNotification(updatedBooking);

      res.json({ success: true, message: 'Agendamento atualizado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Cancelar agendamento
   */
  async cancelBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const { reason } = req.body;

      // Cancelar agendamento
      // await BookingService.updateStatus(bookingId, 'cancelled');

      // Notificar equipa e cliente
      // await sendCancellationNotification(bookingId, reason);

      res.json({ success: true, message: 'Agendamento cancelado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Verificar disponibilidade de data
   */
  async checkAvailability(date) {
    // Implementar lógica de verificação
    return true;
  }
}

module.exports = new BookingController();
