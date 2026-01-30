const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, '..', '..', 'backend_data', 'database.sqlite');

function ensureDir() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function promisifyDb(db) {
  return {
    run(sql, ...params) {
      return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
          if (err) return reject(err);
          resolve({ lastID: this.lastID, changes: this.changes });
        });
      });
    },
    get(sql, ...params) {
      return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) return reject(err);
          resolve(row);
        });
      });
    },
    all(sql, ...params) {
      return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      });
    },
    exec(sql) {
      return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    },
    close() {
      return new Promise((resolve, reject) => {
        db.close((err) => err ? reject(err) : resolve());
      });
    }
  };
}

async function getDb() {
  ensureDir();
  const db = new sqlite3.Database(DB_PATH);
  const pdb = promisifyDb(db);
  await pdb.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      userId TEXT,
      date TEXT,
      services TEXT,
      address TEXT,
      cep TEXT,
      notes TEXT,
      photos TEXT,
      location TEXT,
      finalPrice REAL,
      status TEXT,
      createdAt TEXT,
      cancellationPolicy TEXT,
      achievements TEXT
    );
  `);
  return pdb;
}

module.exports = { getDb };
