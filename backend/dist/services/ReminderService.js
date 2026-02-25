"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderService = void 0;
const NotificationService_1 = require("./NotificationService");
const database_1 = require("../utils/database");
const logger_advanced_1 = require("../utils/logger-advanced");
class ReminderService {
    /**
     * Agenda lembretes automáticos para um agendamento
     * - 24 horas antes
     * - 2 horas antes
     */
    static scheduleReminders(bookingData) {
        const bookingId = bookingData.bookingId;
        const scheduledTime = new Date(bookingData.scheduledDate);
        const now = new Date();
        // Cancelar lembretes anteriores se existirem
        this.cancelReminders(bookingId);
        // Agendar lembrete de 24 horas
        const twentyFourHoursBefore = new Date(scheduledTime.getTime() - 24 * 60 * 60 * 1000);
        if (twentyFourHoursBefore > now) {
            const timeout24h = setTimeout(async () => {
                try {
                    await this.sendReminder(bookingData, 24);
                    logger_advanced_1.logger.info(`⏰ Lembrete 24h enviado para agendamento ${bookingId}`);
                }
                catch (error) {
                    logger_advanced_1.logger.error(`Erro ao enviar lembrete 24h para ${bookingId}:`, error);
                }
            }, twentyFourHoursBefore.getTime() - now.getTime());
            this.reminderTimeouts.set(`${bookingId}-24h`, timeout24h);
        }
        // Agendar lembrete de 2 horas
        const twoHoursBefore = new Date(scheduledTime.getTime() - 2 * 60 * 60 * 1000);
        if (twoHoursBefore > now) {
            const timeout2h = setTimeout(async () => {
                try {
                    await this.sendReminder(bookingData, 2);
                    logger_advanced_1.logger.info(`⏰ Lembrete 2h enviado para agendamento ${bookingId}`);
                }
                catch (error) {
                    logger_advanced_1.logger.error(`Erro ao enviar lembrete 2h para ${bookingId}:`, error);
                }
            }, twoHoursBefore.getTime() - now.getTime());
            this.reminderTimeouts.set(`${bookingId}-2h`, timeout2h);
        }
        logger_advanced_1.logger.info(`📅 Lembretes agendados para agendamento ${bookingId}`);
    }
    /**
     * Cancela lembretes agendados para um agendamento
     */
    static cancelReminders(bookingId) {
        const keysToDelete = [];
        for (const [key, timeout] of this.reminderTimeouts.entries()) {
            if (key.startsWith(`${bookingId}-`)) {
                clearTimeout(timeout);
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => this.reminderTimeouts.delete(key));
        logger_advanced_1.logger.info(`❌ Lembretes cancelados para agendamento ${bookingId}`);
    }
    /**
     * Envia lembrete específico
     */
    static async sendReminder(bookingData, hoursUntil) {
        const reminderData = {
            id: bookingData.bookingId,
            customerName: bookingData.customerName,
            customerEmail: bookingData.customerEmail,
            serviceName: bookingData.serviceName,
            scheduledDate: bookingData.scheduledDate,
            totalPrice: bookingData.totalPrice,
            address: bookingData.address,
            notes: bookingData.notes
        };
        await NotificationService_1.notificationService.sendBookingReminder(reminderData, hoursUntil);
    }
    /**
     * Inicializa lembretes para agendamentos existentes no banco
     * Chamado na inicialização do servidor
     */
    static async initializeExistingReminders() {
        try {
            logger_advanced_1.logger.info('🔄 Inicializando lembretes para agendamentos existentes...');
            // Buscar agendamentos futuros (próximos 30 dias)
            const futureBookings = await (0, database_1.query)(`
        SELECT
          b.id,
          b.scheduled_date,
          b.total_price,
          b.address,
          b.notes,
          u.name as customer_name,
          u.email as customer_email,
          s.name as service_name
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN services s ON b.service_id = s.id
        WHERE b.scheduled_date > NOW()
          AND b.scheduled_date < NOW() + INTERVAL '30 days'
          AND b.status NOT IN ('cancelled', 'completed')
        ORDER BY b.scheduled_date ASC
      `);
            logger_advanced_1.logger.info(`📅 Encontrados ${futureBookings.length} agendamentos futuros para lembretes`);
            for (const booking of futureBookings) {
                const bookingData = {
                    bookingId: booking.id,
                    customerName: booking.customer_name,
                    customerEmail: booking.customer_email,
                    serviceName: booking.service_name,
                    scheduledDate: booking.scheduled_date,
                    totalPrice: parseFloat(booking.total_price),
                    address: booking.address,
                    notes: booking.notes
                };
                this.scheduleReminders(bookingData);
            }
            logger_advanced_1.logger.info('✅ Lembretes inicializados com sucesso');
        }
        catch (error) {
            logger_advanced_1.logger.error('❌ Erro ao inicializar lembretes existentes:', error);
        }
    }
    /**
     * Agenda solicitação de avaliação após conclusão do serviço
     */
    static scheduleReviewRequest(bookingData) {
        const bookingId = bookingData.bookingId;
        const scheduledTime = new Date(bookingData.scheduledDate);
        const now = new Date();
        // Agendar solicitação de avaliação 2 horas após o serviço
        const twoHoursAfter = new Date(scheduledTime.getTime() + 2 * 60 * 60 * 1000);
        if (twoHoursAfter > now) {
            const timeout = setTimeout(async () => {
                try {
                    const reviewData = {
                        id: bookingData.bookingId,
                        customerName: bookingData.customerName,
                        customerEmail: bookingData.customerEmail,
                        serviceName: bookingData.serviceName,
                        scheduledDate: bookingData.scheduledDate,
                        totalPrice: bookingData.totalPrice,
                        address: bookingData.address,
                        notes: bookingData.notes
                    };
                    await NotificationService_1.notificationService.sendReviewRequest(reviewData);
                    logger_advanced_1.logger.info(`⭐ Solicitação de avaliação enviada para agendamento ${bookingId}`);
                }
                catch (error) {
                    logger_advanced_1.logger.error(`Erro ao enviar solicitação de avaliação para ${bookingId}:`, error);
                }
            }, twoHoursAfter.getTime() - now.getTime());
            this.reminderTimeouts.set(`${bookingId}-review`, timeout);
            logger_advanced_1.logger.info(`📝 Solicitação de avaliação agendada para agendamento ${bookingId}`);
        }
    }
    /**
     * Obtém estatísticas dos lembretes agendados
     */
    static getStats() {
        return {
            total: this.reminderTimeouts.size,
            active: this.reminderTimeouts.size
        };
    }
}
exports.ReminderService = ReminderService;
ReminderService.reminderTimeouts = new Map();
//# sourceMappingURL=ReminderService.js.map