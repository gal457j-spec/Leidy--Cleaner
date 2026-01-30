/**
 * Notification Utils
 * Funções auxiliares de notificação
 */

const NotificationController = require('../controllers/NotificationController');

class NotificationService {
  /**
   * Enviar notificação de confirmação de agendamento
   */
  static async notifyBookingConfirmation(bookingId) {
    return NotificationController.sendBookingConfirmation(bookingId);
  }

  /**
   * Enviar lembretes programados
   */
  static async notifyReminders() {
    return NotificationController.sendReminderNotifications();
  }

  /**
   * Notificar problema
   */
  static async notifyIssue(issue) {
    console.log(`Issue reported: ${issue.type} - ${issue.message}`);
    // Implementar envio de alerta
    return true;
  }

  /**
   * Notificar equipa
   */
  static async notifyTeam(bookingId) {
    return NotificationController.notifyTeam(bookingId);
  }

  /**
   * Enviar follow-up
   */
  static async sendFollowUp(bookingId) {
    return NotificationController.sendFollowUpNotification(bookingId);
  }
}

module.exports = NotificationService;
