/**
 * Email Templates
 * Templates de e-mail para diferentes cenários
 */

const emailTemplates = {
  bookingConfirmation: {
    subject: 'Agendamento Confirmado - LimpezaPro',
    template: (booking, user) => `
      <h2>Agendamento Confirmado!</h2>
      <p>Olá ${user.name},</p>
      <p>Seu agendamento foi confirmado com sucesso.</p>
      <h3>Detalhes:</h3>
      <ul>
        <li><strong>Data:</strong> ${booking.date}</li>
        <li><strong>Serviços:</strong> ${booking.services.map(s => s.name).join(', ')}</li>
        <li><strong>Endereço:</strong> ${booking.address}</li>
        <li><strong>Preço:</strong> R$ ${booking.price.toFixed(2)}</li>
      </ul>
      <p>Obrigado por escolher LimpezaPro!</p>
    `,
  },

  reminder24h: {
    subject: 'Lembrete: Seu agendamento é amanhã',
    template: (booking, user) => `
      <h2>Não se esqueça!</h2>
      <p>Olá ${user.name},</p>
      <p>Seu agendamento está marcado para <strong>amanhã</strong>.</p>
      <h3>Detalhes:</h3>
      <ul>
        <li><strong>Hora:</strong> ${booking.date}</li>
        <li><strong>Endereço:</strong> ${booking.address}</li>
      </ul>
      <p>Certifique-se de que há acesso à sua residência.</p>
    `,
  },

  followUp: {
    subject: 'Como foi o serviço?',
    template: (booking, user) => `
      <h2>Sua opinião é importante!</h2>
      <p>Olá ${user.name},</p>
      <p>O serviço foi realizado? Gostaríamos de saber sua opinião.</p>
      <p>
        <a href="https://limpezapro.com/review/${booking.id}">
          Deixe sua avaliação agora
        </a>
      </p>
    `,
  },

  invoiceTemplate: {
    subject: 'Sua Fatura - LimpezaPro',
    template: (invoice, user) => `
      <h2>Fatura #${invoice.id}</h2>
      <p>Olá ${user.name},</p>
      <h3>Detalhes da Fatura:</h3>
      <ul>
        <li><strong>Valor:</strong> R$ ${invoice.amount.toFixed(2)}</li>
        <li><strong>Imposto:</strong> R$ ${invoice.tax.toFixed(2)}</li>
        <li><strong>Total:</strong> R$ ${invoice.total.toFixed(2)}</li>
        <li><strong>Data de Vencimento:</strong> ${invoice.dueDate}</li>
      </ul>
      <p>Obrigado!</p>
    `,
  },

  cancellationNotice: {
    subject: 'Agendamento Cancelado',
    template: (booking, user, reason) => `
      <h2>Agendamento Cancelado</h2>
      <p>Olá ${user.name},</p>
      <p>Seu agendamento foi cancelado.</p>
      <p><strong>Motivo:</strong> ${reason}</p>
      <p>Se tiver dúvidas, entre em contato conosco.</p>
    `,
  },
};

module.exports = emailTemplates;
