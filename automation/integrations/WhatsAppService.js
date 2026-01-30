/**
 * WhatsApp Service
 * Integração com WhatsApp Business API
 */

class WhatsAppService {
  /**
   * Enviar mensagem WhatsApp
   */
  async sendMessage(phoneNumber, message) {
    try {
      // Implementar com Twilio ou Meta Business API
      // const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
      // await twilio.messages.create({
      //   body: message,
      //   from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      //   to: `whatsapp:${phoneNumber}`
      // });
      
      console.log(`Mensagem WhatsApp enviada para ${phoneNumber}`);
      return true;
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      return false;
    }
  }

  /**
   * Enviar confirmação de agendamento
   */
  async sendBookingConfirmation(booking, user) {
    const message = `
Olá ${user.name}! 🎉

Seu agendamento foi confirmado!

📅 Data: ${booking.date}
📍 Local: ${booking.address}
🧹 Serviço: ${booking.services.map(s => s.name).join(', ')}

Código: ${booking.id}

Obrigado por escolher LimpezaPro!
    `;
    
    return this.sendMessage(user.phone, message);
  }

  /**
   * Enviar lembrete
   */
  async sendReminder(booking, user) {
    const message = `
Olá ${user.name}! 👋

Não se esqueça! Seu agendamento é amanhã.

📅 Hora: ${booking.date}
📍 Local: ${booking.address}

Nos vemos amanhã! ✨
    `;
    
    return this.sendMessage(user.phone, message);
  }
}

module.exports = new WhatsAppService();
