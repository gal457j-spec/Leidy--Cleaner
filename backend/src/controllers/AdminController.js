/**
 * Admin Controller - Dashboard
 * Análises, relatórios, estatísticas
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../backend_data/limpeza.db');

const getDb = () => new sqlite3.Database(DB_PATH);
const getAsync = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allAsync = (db, sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
};

class AdminController {
  /**
   * Dashboard principal - Resumo geral
   */
  async getDashboard(req, res) {
    const db = getDb();
    try {
      const dashboardData = {};

      // Receita total do mês (usando date format de SQLite)
      const revenueResult = await getAsync(db, `
        SELECT 
          SUM(final_price) as total_revenue,
          COUNT(*) as total_bookings,
          AVG(CASE WHEN rating IS NOT NULL THEN rating ELSE NULL END) as average_rating
        FROM bookings
        WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')
        AND status IN ('confirmed', 'completed')
      `);
      dashboardData.monthlyRevenue = revenueResult;

      // Agendamentos por status
      const statusResults = await allAsync(db, `
        SELECT 
          status,
          COUNT(*) as count
        FROM bookings
        WHERE date >= date('now')
        GROUP BY status
      `);
      dashboardData.bookingsByStatus = statusResults;

      // Top 5 clientes
      const topClients = await allAsync(db, `
        SELECT 
          u.id,
          u.name,
          COUNT(b.id) as bookings,
          SUM(b.final_price) as total_spent,
          AVG(b.rating) as average_rating
        FROM users u
        LEFT JOIN bookings b ON u.id = b.user_id
        WHERE u.role = 'customer'
        GROUP BY u.id, u.name
        ORDER BY total_spent DESC
        LIMIT 5
      `);
      dashboardData.topClients = topClients;

      // Taxa de cancelamento
      const cancellationStats = await getAsync(db, `
        SELECT 
          COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled,
          COUNT(*) as total,
          ROUND((COUNT(CASE WHEN status = 'cancelled' THEN 1 END) * 100.0 / COUNT(*)), 2) as cancellation_rate
        FROM bookings
        WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')
      `);
      dashboardData.cancellationStats = cancellationStats;

      db.close();
      res.json({ success: true, ...dashboardData });
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
      db.close();
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Gráfico de receita diária/semanal/mensal
   */
  async getRevenueChart(req, res) {
    const db = getDb();
    try {
      const { period = 'daily' } = req.query;

      let groupBy, dateFormat;
      if (period === 'daily') {
        groupBy = 'date(date)';
        dateFormat = "strftime('%d/%m', date)";
      } else if (period === 'weekly') {
        groupBy = "strftime('%Y-W%W', date)";
        dateFormat = "strftime('%d/%m', date)";
      } else {
        groupBy = "strftime('%Y-%m', date)";
        dateFormat = "strftime('%m/%Y', date)";
      }

      const query = `
        SELECT 
          ${dateFormat} as date,
          SUM(final_price) as revenue,
          COUNT(*) as bookings
        FROM bookings
        WHERE status IN ('confirmed', 'completed')
        AND date >= date('now', '-3 months')
        GROUP BY ${groupBy}
        ORDER BY date DESC
      `;

      const result = await allAsync(db, query);
      db.close();
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Erro ao buscar gráfico de receita:', error);
      db.close();
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Lista completa de agendamentos com filtros
   */
  async getBookingsList(req, res) {
    const db = getDb();
    try {
      const { status, startDate, endDate, limit = 50, offset = 0 } = req.query;

      let query = `
        SELECT 
          b.id,
          b.date,
          b.time,
          b.status,
          b.final_price,
          b.rating,
          u.name as customer_name,
          u.phone as customer_phone,
          s.name as service_name,
          b.address
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN services s ON b.service_id = s.id
        WHERE 1=1
      `;

      const params = [];

      if (status) {
        query += ' AND b.status = ?';
        params.push(status);
      }

      if (startDate) {
        query += ' AND b.date >= ?';
        params.push(startDate);
      }

      if (endDate) {
        query += ' AND b.date <= ?';
        params.push(endDate);
      }

      query += ' ORDER BY b.date DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const result = await allAsync(db, query, params);
      db.close();
      res.json({ success: true, bookings: result });
    } catch (error) {
      console.error('Erro ao buscar lista de agendamentos:', error);
      db.close();
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Usuários registrados
   */
  async getUsersStats(req, res) {
    const db = getDb();
    try {
      const result = await allAsync(db, `
        SELECT 
          role,
          COUNT(*) as count,
          COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_users
        FROM users
        GROUP BY role
      `);

      db.close();
      res.json({ success: true, stats: result });
    } catch (error) {
      console.error('Erro ao buscar estatísticas de usuários:', error);
      db.close();
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Avaliações e Reviews
   */
  async getReviewsStats(req, res) {
    const db = getDb();
    try {
      const result = await getAsync(db, `
        SELECT 
          ROUND(AVG(rating), 2) as average_rating,
          COUNT(*) as total_reviews,
          COUNT(CASE WHEN rating = 5 THEN 1 END) as five_stars,
          COUNT(CASE WHEN rating = 4 THEN 1 END) as four_stars,
          COUNT(CASE WHEN rating = 3 THEN 1 END) as three_stars,
          COUNT(CASE WHEN rating = 2 THEN 1 END) as two_stars,
          COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
        FROM reviews
        WHERE approved = 1
      `);

      db.close();
      res.json({ success: true, ...result });
    } catch (error) {
      console.error('Erro ao buscar estatísticas de reviews:', error);
      db.close();
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Próximos agendamentos (hoje + próximos 7 dias)
   */
  async getUpcomingBookings(req, res) {
    const db = getDb();
    try {
      const result = await allAsync(db, `
        SELECT 
          b.id,
          b.date,
          b.time,
          b.status,
          b.final_price,
          u.name as customer_name,
          u.phone as customer_phone,
          s.name as service_name,
          b.address,
          b.duration_hours
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN services s ON b.service_id = s.id
        WHERE b.date BETWEEN date('now') AND date('now', '+7 days')
        AND b.status IN ('pending', 'confirmed')
        ORDER BY b.date, b.time
      `);

      db.close();
      res.json({ success: true, bookings: result });
    } catch (error) {
      console.error('Erro ao buscar próximos agendamentos:', error);
      db.close();
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Ganhos por funcionária (detalhado)
   */
  async getStaffEarnings(req, res) {
    const db = getDb();
    try {
      const { staffId } = req.params;

      let query = `
        SELECT 
          b.id,
          b.date,
          b.time,
          b.final_price,
          b.status,
          u.name as customer_name,
          s.name as service_name,
          ROUND(b.final_price * 0.1, 2) as staff_commission
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN services s ON b.service_id = s.id
        WHERE b.status = 'completed'
      `;

      const params = [];
      if (staffId) {
        query += ' AND b.staff_id = ?';
        params.push(staffId);
      }

      query += ' ORDER BY b.date DESC';

      const result = await allAsync(db, query, params);
      db.close();
      res.json({ success: true, earnings: result });
    } catch (error) {
      console.error('Erro ao buscar ganhos de funcionária:', error);
      db.close();
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AdminController();
