const { getDb } = require('./sqlite');
const { runMigrations } = require('./runMigrations');
const logger = require('../utils/logger');

async function ensureSchema() {
  let db;
  try {
    // Executa migrations (cria tabelas se faltarem)
    await runMigrations();

    db = await getDb();

    // Verifica existência da tabela bookings
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='bookings';");
    if (!tables || tables.length === 0) {
      logger.warn('Tabela bookings ausente após migrations; tentando criar novamente');
      await runMigrations();
    }

    // Verifica coluna final_price na tabela bookings
    const cols = await db.all("PRAGMA table_info('bookings');");
    const hasFinalPrice = Array.isArray(cols) && cols.some(c => c.name === 'final_price');
    if (!hasFinalPrice) {
      try {
        await db.run('ALTER TABLE bookings ADD COLUMN final_price REAL DEFAULT 0.0;');
        logger.info('Coluna final_price adicionada à tabela bookings');
      } catch (err) {
        // Em alguns casos ALTER TABLE falha por limitações; apenas logamos
        logger.warn('Falha ao adicionar coluna final_price (pode já existir):', err.message);
      }
    } else {
      logger.info('Coluna final_price já existe na tabela bookings');
    }

  } catch (error) {
    logger.error('Erro em ensureSchema:', error);
    throw error;
  } finally {
    if (db && db.close) {
      try { await db.close(); } catch (e) { /* ignore */ }
    }
  }
}

module.exports = { ensureSchema };