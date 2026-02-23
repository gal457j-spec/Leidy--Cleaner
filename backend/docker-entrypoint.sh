#!/usr/bin/env bash
set -euo pipefail

DB_TYPE=${DB_TYPE:-postgres}
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-5432}
MAX_WAIT=${MAX_WAIT:-60}

# Skip database check for SQLite
if [ "${DB_TYPE}" == "sqlite" ]; then
  echo "✅ Using SQLite, skipping database connectivity check"
  
  # Create database if not exists
  DATABASE_LOCAL=${DATABASE_LOCAL:-./data/data.db}
  if [ ! -f "$DATABASE_LOCAL" ] || [ ! -s "$DATABASE_LOCAL" ]; then
    echo "📁 Initializing SQLite database..."
    node -e "
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('$DATABASE_LOCAL');
const schema = \`
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS services;

CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT UNIQUE, password_hash TEXT, full_name TEXT, phone TEXT, role TEXT DEFAULT 'customer', is_active INTEGER DEFAULT 1, bio TEXT, photo_url TEXT, last_login DATETIME, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE services (id TEXT PRIMARY KEY, name TEXT, description TEXT, category TEXT, base_price REAL, duration_minutes INTEGER, is_active INTEGER DEFAULT 1);
CREATE TABLE bookings (id TEXT PRIMARY KEY, user_id TEXT, service_id TEXT, scheduled_date DATETIME, address TEXT, notes TEXT, status TEXT DEFAULT 'pending', total_price REAL, payment_status TEXT DEFAULT 'pending');

INSERT OR IGNORE INTO users VALUES ('1', 'admin@leidycleaner.com', '$2a$10$YiX20E2aZjgOoalsUDfWEeit6GHxU9dBUcM/G6m44v2O5.JZqTshO', 'Admin Leidy', '11999999999', 'admin', 1, NULL, NULL, NULL, datetime('now'), datetime('now'));
INSERT OR IGNORE INTO services VALUES ('1','Limpeza Residencial','Básica','Residencial',40,120,1),('2','Comercial','Pro','Comercial',60,240,1),('3','Pós-Obra','Especial','Especializada',80,360,1),('4','Carpete','Higienização','Especializada',50,180,1),('5','Janelas','Vidros','Especializada',30,90,1),('6','Estofados','Sofás','Especializada',45,120,1),('7','Pesada','Profunda','Residencial',75,300,1),('8','Verde','Ecológica','Especializada',50,120,1);
\`;
db.exec(schema, (err) => { if(err) console.log('❌',err);  else console.log('✅ DB initialized'); db.close(); });
" 2>&1 || echo "Database already initialized"
  fi
else
  echo "⏳ Waiting for database ${DB_HOST}:${DB_PORT} (max ${MAX_WAIT}s)"
  start_ts=$(date +%s)
  while true; do
    # try TCP connect
    if (echo > /dev/tcp/${DB_HOST}/${DB_PORT}) >/dev/null 2>&1; then
      echo "✅ Database reachable"
      break
    fi
    now_ts=$(date +%s)
    if [ $((now_ts - start_ts)) -ge ${MAX_WAIT} ]; then
      echo "❌ Timeout waiting for database" >&2
      exit 1
    fi
    sleep 1
  done
fi

# Run migrations if compiled JS exists
if [ -f ./dist/db/runMigrations.js ]; then
  echo "➡️ Running migrations: node ./dist/db/runMigrations.js"
  node ./dist/db/runMigrations.js || echo "warning: migrations exited with non-zero status"
else
  echo "ℹ️ No compiled migrations found (./dist/db/runMigrations.js)"
fi

if [ -f ./dist/db/seed.js ]; then
  echo "➡️ Running seed: node ./dist/db/seed.js"
  node ./dist/db/seed.js || echo "warning: seed exited with non-zero status"
else
  echo "ℹ️ No compiled seed found (./dist/db/seed.js)"
fi

echo "▶️ Starting backend: exec node ./dist/main.js"
exec node ./dist/main.js
