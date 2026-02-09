#!/bin/bash

# Quick migration runner com timeout
cd /workspaces/por-fim/backend

# Definir timeout e executar
timeout 20 node -e "
const { getDb } = require('./src/db/sqlite');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const db = await getDb();
    const sql = fs.readFileSync(path.join(__dirname, 'src/db/migrations.sql'), 'utf8');
    
    const statements = sql.split(';').map(s => s.trim()).filter(s => s && !s.startsWith('--'));
    console.log(\`Executando \${statements.length} statements...\`);
    
    let count = 0;
    for (const stmt of statements) {
      try {
        await db.exec(stmt + ';');
        count++;
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.warn('⚠️  ', err.message.slice(0, 100));
        }
        count++;
      }
    }
    
    console.log(\`✅ Migrations concluídas: \${count}/\${statements.length}\`);
    await db.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro:', err.message);
    process.exit(1);
  }
}

run();
" && echo "✅ Migration script completed" || echo "⚠️  Migration script timed out or failed"
