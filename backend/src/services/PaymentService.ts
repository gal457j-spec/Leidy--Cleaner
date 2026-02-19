import { query } from '../utils/database';

export class PaymentService {
  // mark booking as paid/confirmed
  static async markBookingPaid(bookingId: string) {
    const result = await query(
      `UPDATE bookings SET status = 'confirmed', payment_status = 'paid', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [bookingId]
    );
    return result.length > 0 ? result[0] : null;
  }
}

export default PaymentService;
