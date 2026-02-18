export declare class BookingService {
    static createBooking(userId: string, serviceId: string, scheduledDate: string, totalPrice: number, notes?: string): Promise<any>;
    static getBookingsByUser(userId: string): Promise<any[]>;
    static getById(id: string): Promise<any>;
    static updateStatus(id: string, status: string): Promise<any>;
    static delete(id: string): Promise<boolean>;
}
export default BookingService;
//# sourceMappingURL=BookingService.d.ts.map