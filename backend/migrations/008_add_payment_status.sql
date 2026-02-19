-- Add payment_status column to bookings
ALTER TABLE bookings
  ADD COLUMN payment_status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','refunded'));

CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);