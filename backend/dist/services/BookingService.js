import { query } from '../utils/database';
export class BookingService {
    static async createBooking(userId, serviceId, scheduledDate, totalPrice, notes) {
        const result = await query(`INSERT INTO bookings (user_id, service_id, scheduled_date, total_price, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`, [userId, serviceId, scheduledDate, totalPrice, notes || null]);
        return result[0];
    }
    static async getBookingsByUser(userId) {
        const result = await query(`SELECT b.*, s.name as service_name FROM bookings b JOIN services s ON s.id = b.service_id WHERE b.user_id = $1 ORDER BY b.scheduled_date DESC`, [userId]);
        return result;
    }
    static async getById(id) {
        const result = await query('SELECT * FROM bookings WHERE id = $1', [id]);
        return result.length > 0 ? result[0] : null;
    }
    static async updateStatus(id, status) {
        const result = await query(`UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [status, id]);
        return result.length > 0 ? result[0] : null;
    }
    static async delete(id) {
        await query('DELETE FROM bookings WHERE id = $1', [id]);
        return true;
    }
}
export default BookingService;
//# sourceMappingURL=BookingService.js.map