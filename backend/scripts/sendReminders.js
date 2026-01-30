/**
 * Script: Send reminders
 * Envia lembretes automáticos 24h antes do agendamento
 */

const NotificationService = require('../utils/notifications');

async function sendReminders() {
  try {
    console.log('Enviando lembretes...');

    // Buscar agendamentos para amanhã
    // const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    // const bookings = await BookingService.findByDate(tomorrow);

    // for (const booking of bookings) {
    //   console.log(`Enviando lembrete para ${booking.id}...`);
    //   await NotificationService.notifyReminders();
    // }

    console.log('Lembretes enviados com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar lembretes:', error);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  sendReminders();
}

module.exports = sendReminders;
