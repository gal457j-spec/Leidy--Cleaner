-- Migração 002: Adicionar coluna de pagamentos
-- Adiciona suporte a múltiplos métodos de pagamento

BEGIN;

ALTER TABLE bookings ADD COLUMN payment_method VARCHAR(50) DEFAULT 'stripe';
ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(50) DEFAULT 'unpaid';
ALTER TABLE bookings ADD COLUMN payment_date TIMESTAMP;

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_gateway_id VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMIT;
