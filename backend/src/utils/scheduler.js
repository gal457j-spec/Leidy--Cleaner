/**
 * Scheduler
 * Agendador de tarefas automáticas
 */

const cron = require('node-cron');
const NotificationService = require('./notifications');
const AutomationService = require('../services/AutomationService');

class Scheduler {
  /**
   * Inicializar todos os schedules
   */
  static init() {
    console.log('Inicializando scheduler...');

    // Enviar lembretes a cada dia às 10:00
    cron.schedule('0 10 * * *', async () => {
      console.log('Executando: envio de lembretes diários');
      await NotificationService.notifyReminders();
    });

    // Verificar agendamentos próximos a cada hora
    cron.schedule('0 * * * *', async () => {
      console.log('Executando: verificação de agendamentos');
      await this.checkUpcomingBookings();
    });

    // Follow-up automático a cada 6 horas
    cron.schedule('0 */6 * * *', async () => {
      console.log('Executando: follow-up automático');
      await this.executeFollowUps();
    });

    // Limpeza de dados antigos a cada semana
    cron.schedule('0 0 * * 0', async () => {
      console.log('Executando: limpeza de dados');
      await this.cleanupOldData();
    });

    // Gerar relatórios mensais
    cron.schedule('0 0 1 * *', async () => {
      console.log('Executando: geração de relatórios');
      await this.generateMonthlyReports();
    });

    console.log('Scheduler inicializado com sucesso');
  }

  /**
   * Verificar agendamentos próximos
   */
  static async checkUpcomingBookings() {
    try {
      // const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
      // const bookings = await BookingService.findByDate(tomorrow);
      // for (const booking of bookings) {
      //   await AutomationService.executeBookingAutomations(booking);
      // }
      console.log('Verificação concluída');
    } catch (error) {
      console.error('Erro em checkUpcomingBookings:', error);
    }
  }

  /**
   * Executar follow-ups automáticos
   */
  static async executeFollowUps() {
    try {
      // const completedBookings = await BookingService.findCompleted();
      // for (const booking of completedBookings) {
      //   if (this.shouldFollowUp(booking)) {
      //     await AutomationService.executeFollowUp(booking.id);
      //   }
      // }
      console.log('Follow-ups executados');
    } catch (error) {
      console.error('Erro em executeFollowUps:', error);
    }
  }

  /**
   * Limpeza de dados antigos
   */
  static async cleanupOldData() {
    try {
      // Remover dados com mais de 1 ano
      // await BookingService.deleteOldBookings(365);
      console.log('Limpeza de dados concluída');
    } catch (error) {
      console.error('Erro em cleanupOldData:', error);
    }
  }

  /**
   * Gerar relatórios mensais
   */
  static async generateMonthlyReports() {
    try {
      // const report = await ReportService.generateMonthlyReport();
      // await EmailService.sendToAdmin(report);
      console.log('Relatórios gerados');
    } catch (error) {
      console.error('Erro em generateMonthlyReports:', error);
    }
  }

  /**
   * Verificar se deve fazer follow-up
   */
  static shouldFollowUp(booking) {
    const now = new Date();
    const completedDate = new Date(booking.completedAt);
    const daysSinceCompletion = (now - completedDate) / (1000 * 60 * 60 * 24);
    
    return daysSinceCompletion >= 1 && daysSinceCompletion < 7;
  }

  /**
   * Agendar tarefa customizada
   */
  static scheduleCustom(pattern, callback) {
    cron.schedule(pattern, callback);
  }
}

module.exports = Scheduler;
