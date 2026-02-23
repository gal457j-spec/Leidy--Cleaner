import { query } from '../utils/database';
import { logger } from '../utils/logger';
import { hashPassword } from '../utils/password';

async function seedDatabase() {
  try {
    logger.info('🌱 Starting database seeding...');

    // For tests, use direct database connection to avoid module conflicts
    let testQuery = query;
    if (process.env.NODE_ENV === 'test' && process.env.DB_TYPE !== 'sqlite') {
      const { Pool } = require('pg');
      const testPool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'postgres',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
      });

      // Use direct pool query for tests
      testQuery = async (sql: string, params?: any[]) => {
        const client = await testPool.connect();
        try {
          const result = await client.query(sql, params);
          return result.rows;
        } finally {
          client.release();
        }
      };

      // Clean up test pool after seeding
      process.on('exit', () => testPool.end());
    }

    // Check admin (skip if SKIP_ADMIN_SEED is set)
    if (!process.env.SKIP_ADMIN_SEED) {
      const existingAdmin = await testQuery(
        "SELECT COUNT(*) as count FROM users WHERE role = 'admin'"
      );
      const adminCount = parseInt(((existingAdmin as any[])[0] as any).count || '0', 10);
      if (adminCount === 0) {
        const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123456');
        await testQuery(
          `INSERT INTO users (email, password_hash, full_name, phone, role, is_active)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            'admin@leidycleaner.com',
            adminPassword,
            'Administrador',
            '+55 11 98765-4321',
            'admin',
            true
          ]
        );
        logger.info('✨ Admin user created: admin@leidycleaner.com');
      } else {
        logger.info('✅ Admin user already exists');
      }
    } else {
      logger.info('⏭️ Skipping admin seed (SKIP_ADMIN_SEED=true)');
    }

    // Services
    const existingServices = await testQuery('SELECT COUNT(*) as count FROM services');
    const servicesCount = parseInt((existingServices[0] as any).count || '0', 10);
    if (servicesCount === 0) {
      const services = [
        { name: 'Limpeza Residencial Básica', description: 'Varredura, limpeza de pisos, banheiros e cozinha. Serviço de até 2 horas (máx 8 horas total).', category: 'Residencial', base_price: 0, duration_minutes: 120 },
        { name: 'Limpeza Residencial Profunda', description: 'Limpeza completa e detalhada em todas as áreas. Até 4 horas (máx 8 horas total).', category: 'Residencial', base_price: 0, duration_minutes: 240 },
        { name: 'Limpeza Pós-Obra', description: 'Remoção de poeira e resíduos após reformas. Até 6 horas (máx 8 horas total).', category: 'Residencial', base_price: 0, duration_minutes: 360 },
        { name: 'Limpeza Comercial', description: 'Limpeza profissional para escritórios e comércios. Até 4 horas (máx 8 horas total).', category: 'Comercial', base_price: 0, duration_minutes: 240 },
        { name: 'Limpeza de Carpete', description: 'Higienização profissional de tapetes e carpetes. Até 3 horas (máx 8 horas total).', category: 'Especializada', base_price: 0, duration_minutes: 180 },
        { name: 'Limpeza de Janelas', description: 'Limpeza de vidros e fachada. Até 2 horas (máx 8 horas total).', category: 'Especializada', base_price: 0, duration_minutes: 90 },
        { name: 'Limpeza de Estofados', description: 'Higienização de sofás e poltronas. Até 2 horas (máx 8 horas total).', category: 'Especializada', base_price: 0, duration_minutes: 120 },
        { name: 'Limpeza Verde Ecológica', description: 'Limpeza com produtos eco-friendly. Até 2 horas (máx 8 horas total).', category: 'Especializada', base_price: 0, duration_minutes: 120 },
      ];

      for (const service of services) {
        await testQuery(
          `INSERT INTO services (name, description, category, base_price, duration_minutes, is_active)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [service.name, service.description, service.category, service.base_price, service.duration_minutes, true]
        );
      }
      logger.info(`✨ ${services.length} services created`);
    } else {
      logger.info('✅ Services already exist');
    }

    // Company
    const existingCompany = await testQuery('SELECT COUNT(*) as count FROM company_info');
    const companyCount = parseInt((existingCompany[0] as any).count || '0', 10);
    if (companyCount === 0) {
      await testQuery(
        `INSERT INTO company_info (name, legal_name, email, phone, address, city, state, country, postal_code, logo_url, description, terms, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
        [
          process.env.COMPANY_NAME || 'Leidy Cleaner',
          process.env.COMPANY_LEGAL_NAME || 'Leidy Cleaner Serviços de Limpeza Ltda',
          process.env.COMPANY_EMAIL || 'contato@leidycleaner.com.br',
          process.env.COMPANY_PHONE || '(11) 98765-4321',
          process.env.COMPANY_ADDRESS || 'Av. Paulista, 1000',
          process.env.COMPANY_CITY || 'São Paulo',
          process.env.COMPANY_STATE || 'SP',
          process.env.COMPANY_COUNTRY || 'Brasil',
          process.env.COMPANY_POSTAL_CODE || '01311-100',
          process.env.COMPANY_LOGO_URL || 'https://example.com/logo.png',
          process.env.COMPANY_DESCRIPTION || 'Leidy Cleaner é uma empresa especializada em serviços de limpeza profissional de alta qualidade.',
          process.env.COMPANY_TERMS || 'Termos e políticas padrão.'
        ]
      );
      logger.info('✨ Company info seeded');
    } else {
      logger.info('✅ Company info already exists');
    }

    logger.info('✅ Database seeding completed successfully!');
    // Only exit if called directly, not when imported
    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    logger.error('❌ Seeding failed:', err);
    // Only exit if called directly, not when imported
    if (require.main === module) {
      process.exit(1);
    } else {
      throw err; // Re-throw for Jest to catch
    }
  }
}

if (require.main === module) seedDatabase();

export { seedDatabase };
