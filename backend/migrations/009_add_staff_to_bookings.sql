-- add staff_id to bookings table
ALTER TABLE bookings
  ADD COLUMN staff_id INTEGER REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_staff_id ON bookings(staff_id);
