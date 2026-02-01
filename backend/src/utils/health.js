const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

const DB_PATH = path.join(__dirname, '..', 'backend_data', 'limpeza.db');

async function checkDatabase() {
  return new Promise((resolve) => {
    const result = { ok: false, path: DB_PATH, exists: false, size: 0, counts: {}, error: null };
    try {
      if (!fs.existsSync(DB_PATH)) {
        result.error = 'DB file not found';
        return resolve(result);
      }
      result.exists = true;
      const stats = fs.statSync(DB_PATH);
      result.size = stats.size;

      const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
          result.error = err.message;
          return resolve(result);
        }

        db.get('SELECT 1 as ok', [], (err2, row) => {
          if (err2) result.error = err2.message;
          else result.ok = true;

          // gather counts for quick health insight
          db.get('SELECT COUNT(*) as users FROM users', [], (uErr, uRow) => {
            if (!uErr && uRow) result.counts.users = uRow.users;
            db.get('SELECT COUNT(*) as bookings FROM bookings', [], (bErr, bRow) => {
              if (!bErr && bRow) result.counts.bookings = bRow.bookings;
              db.close();
              resolve(result);
            });
          });
        });
      });
    } catch (e) {
      logger.error('checkDatabase error', e);
      result.error = e.message;
      resolve(result);
    }
  });
}

module.exports = { checkDatabase };
