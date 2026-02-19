import { query } from '../utils/database';

export class AdminService {
  static async getStats() {
    const [usersRes, servicesRes, bookingsRes, reviewsRes] = await Promise.all([
      query('SELECT COUNT(*) as count FROM users'),
      query('SELECT COUNT(*) as count FROM services'),
      query('SELECT COUNT(*) as count FROM bookings'),
      query('SELECT COUNT(*) as count FROM reviews WHERE is_approved = FALSE'),
    ]);

    return {
      users: Number((usersRes[0] as any).count || 0),
      services: Number((servicesRes[0] as any).count || 0),
      bookings: Number((bookingsRes[0] as any).count || 0),
      pendingReviews: Number((reviewsRes[0] as any).count || 0),
    };
  }
}

export default AdminService;
