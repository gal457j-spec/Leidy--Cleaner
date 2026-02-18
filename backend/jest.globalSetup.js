const { Pool } = require('pg');
const path = require('path');
const { execSync } = require('child_process');

module.exports = async () => {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'chega_test',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    // Clean relevant tables to ensure deterministic tests
    await pool.query('TRUNCATE TABLE bookings, reviews, services, users RESTART IDENTITY CASCADE');

    // Run seed script to populate default services (skip creating admin so tests can register their own)
    const cwd = path.join(__dirname, './src/db');
    // Use tsx to run the TypeScript seed file, skip admin creation for tests
    execSync('SKIP_ADMIN_SEED=true npx tsx seed.ts', { cwd, stdio: 'inherit' });
  } catch (err) {
    console.error('Error in globalSetup:', err);
    throw err;
  } finally {
    await pool.end();
  }
};
