-- Add address column to bookings table
-- SQLite: add address column; use single ADD COLUMN (IF NOT EXISTS not supported in some sqlite versions)
ALTER TABLE bookings ADD COLUMN address TEXT;
