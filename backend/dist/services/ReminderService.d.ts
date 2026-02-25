export interface ReminderData {
    bookingId: string;
    customerName: string;
    customerEmail: string;
    serviceName: string;
    scheduledDate: string;
    address?: string;
    notes?: string;
    totalPrice: number;
}
export declare class ReminderService {
    private static reminderTimeouts;
    /**
     * Agenda lembretes automáticos para um agendamento
     * - 24 horas antes
     * - 2 horas antes
     */
    static scheduleReminders(bookingData: ReminderData): void;
    /**
     * Cancela lembretes agendados para um agendamento
     */
    static cancelReminders(bookingId: string): void;
    /**
     * Envia lembrete específico
     */
    private static sendReminder;
    /**
     * Inicializa lembretes para agendamentos existentes no banco
     * Chamado na inicialização do servidor
     */
    static initializeExistingReminders(): Promise<void>;
    /**
     * Agenda solicitação de avaliação após conclusão do serviço
     */
    static scheduleReviewRequest(bookingData: ReminderData): void;
    /**
     * Obtém estatísticas dos lembretes agendados
     */
    static getStats(): {
        total: number;
        active: number;
    };
}
//# sourceMappingURL=ReminderService.d.ts.map