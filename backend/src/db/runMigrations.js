const fs = require('fs');
const path = require('path');
const { getDb } = require('./sqlite');

const MIGRATIONS_PATH = path.join(__dirname, 'migrations.sql');

async function runMigrations() {
  try {
    const db = await getDb();
    // Log DB path if available (sqlite module uses a candidate path)
    try {
      console.log('DB path:', require('./sqlite').__filename || 'unknown');
    } catch (e) {
      // ignore
    }

    const sql = fs.readFileSync(MIGRATIONS_PATH, 'utf8');

    // Executar cada statement SQL e logar para debug
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        console.log('Executando statement:', statement.slice(0, 120).replace(/\s+/g, ' '));
        await db.exec(statement + ';');
      } catch (error) {
        console.warn('⚠️  Erro ao executar statement (trunc):', statement.slice(0,120));
        if (!error.message.includes('already exists')) {
          console.warn('⚠️  Aviso:', error.message);
        }
      }
    }

    await db.close();
  } catch (error) {
    console.error('❌ Erro ao executar migrations:', error);
    process.exit(1);
  }
}

module.exports = { runMigrations };

// Executa migrations quando o script for chamado diretamente
if (require.main === module) {
  runMigrations().catch(err => {
    console.error('Erro ao executar migrations diretamente:', err);
    process.exit(1);
  });
}
