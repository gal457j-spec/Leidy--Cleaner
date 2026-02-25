import request from 'supertest';
import express from 'express';
import analyticsRoutes from '../analytics';
import authRoutes from '../auth';
import { errorHandler } from '../../middleware/errorHandler';
import { query } from '../../utils/database';

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use(errorHandler);

describe('Analytics API', () => {
  let adminToken: string;
  let adminId: string;

  beforeAll(async () => {
    // Criar admin de teste
    const adminResponse = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'analytics-admin@test.com',
        password: 'password123',
        name: 'Analytics Admin'
      });

    adminToken = adminResponse.body.data.token;
    adminId = adminResponse.body.data.user.id;

    // Atualizar role para admin
    await query('UPDATE users SET role = $1 WHERE id = $2', ['admin', adminId]);

    // Fazer login novamente para obter token com role atualizado
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'analytics-admin@test.com',
        password: 'password123'
      });

    adminToken = loginResponse.body.data?.tokens?.accessToken;
  });

  describe('GET /api/v1/analytics/dashboard', () => {
    it('should return dashboard stats for admin', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Dashboard stats retrieved');
      expect(response.body.data.stats).toHaveProperty('todayBookings');
      expect(response.body.data.stats).toHaveProperty('todayRevenue');
      expect(response.body.data.stats).toHaveProperty('pendingBookings');
      expect(response.body.data.stats).toHaveProperty('activeChats');
      expect(response.body.data.stats).toHaveProperty('systemHealth');
      expect(response.body.data.stats).toHaveProperty('alerts');
    });

    it('should deny access to non-admin users', async () => {
      // Criar usuário não-admin
      const userResponse = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'regular-user@test.com',
          password: 'password123',
          name: 'Regular User'
        });

      const userToken = userResponse.body.data.token;

      const response = await request(app)
        .get('/api/v1/analytics/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toContain('Only admins');
    });
  });

  describe('GET /api/v1/analytics/metrics', () => {
    it('should return analytics metrics', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/metrics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Analytics metrics retrieved');
      expect(response.body.data.metrics).toHaveProperty('totalUsers');
      expect(response.body.data.metrics).toHaveProperty('totalBookings');
      expect(response.body.data.metrics).toHaveProperty('totalRevenue');
      expect(response.body.data.metrics).toHaveProperty('topServices');
      expect(response.body.data.metrics).toHaveProperty('revenueByMonth');
    });

    it('should filter by date range', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/metrics?startDate=2026-01-01&endDate=2026-12-31')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.metrics).toBeDefined();
    });
  });

  describe('GET /api/v1/analytics/staff-performance', () => {
    it('should return staff performance data', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/staff-performance')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Staff performance retrieved');
      expect(Array.isArray(response.body.data.performance)).toBe(true);
    });
  });

  describe('GET /api/v1/analytics/export/bookings', () => {
    it('should export bookings as CSV', async () => {
      const response = await request(app)
        .get('/api/v1/analytics/export/bookings')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('text/csv');
      expect(response.headers['content-disposition']).toContain('attachment');
      expect(response.headers['content-disposition']).toContain('bookings-');
      expect(response.headers['content-disposition']).toContain('.csv');
      expect(typeof response.text).toBe('string');
      expect(response.text).toContain('ID,Data Agendamento,Status');
    });
  });

  afterAll(async () => {
    // Limpar apenas o admin de teste
    if (adminId) {
      await query('DELETE FROM bookings WHERE user_id = $1', [adminId]);
      await query('DELETE FROM users WHERE id = $1', [adminId]);
    }
  });
});