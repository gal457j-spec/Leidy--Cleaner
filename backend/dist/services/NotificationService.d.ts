export interface EmailTemplate {
    subject: string;
    html: string;
    text?: string;
}
export interface BookingData {
    id: string;
    customerName: string;
    customerEmail: string;
    serviceName: string;
    scheduledDate: string;
    totalPrice: number;
    address?: string;
    notes?: string;
}
export interface PaymentData {
    bookingId: string;
    customerName: string;
    customerEmail: string;
    amount: number;
    serviceName: string;
}
export interface StaffAssignmentData {
    staffName: string;
    staffEmail: string;
    customerName: string;
    serviceName: string;
    scheduledDate: string;
    address?: string;
}
export declare class NotificationService {
    private transporter;
    constructor();
    private getBookingConfirmationTemplate;
    private getBookingReminderTemplate;
    private getPaymentConfirmationTemplate;
    private getReviewRequestTemplate;
    private getStaffAssignmentTemplate;
    private sendEmail;
    sendBookingConfirmation(data: BookingData): Promise<void>;
    sendBookingReminder(data: BookingData, hoursUntil: number): Promise<void>;
    sendPaymentConfirmation(data: PaymentData): Promise<void>;
    sendReviewRequest(data: BookingData): Promise<void>;
    sendStaffAssignment(data: StaffAssignmentData): Promise<void>;
    testConnection(): Promise<boolean>;
    static sendEmail(to: string, subject: string, text: string): Promise<void>;
    static sendSMS(to: string, text: string): Promise<void>;
    static notifyBookingCreated(booking: any): Promise<void>;
}
export declare const notificationService: NotificationService;
export default NotificationService;
//# sourceMappingURL=NotificationService.d.ts.map