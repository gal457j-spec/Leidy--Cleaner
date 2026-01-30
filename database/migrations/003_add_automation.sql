-- Migração 003: Adicionar suporte a automações
-- Adiciona tabelas para rastrear automações e histórico

BEGIN;

CREATE TABLE IF NOT EXISTS automation_logs (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  automation_type VARCHAR(100),
  status VARCHAR(50),
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  booking_id INTEGER REFERENCES bookings(id),
  type VARCHAR(100),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE bookings ADD COLUMN frequency VARCHAR(50) DEFAULT 'once';
ALTER TABLE bookings ADD COLUMN urgency VARCHAR(50) DEFAULT 'normal';

COMMIT;
