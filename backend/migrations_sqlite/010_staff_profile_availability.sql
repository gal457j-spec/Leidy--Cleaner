-- add bio and photo_url to users for staff profiles
-- Add bio and photo_url columns to users (separate ALTERs for sqlite compatibility)
ALTER TABLE users ADD COLUMN bio TEXT;
ALTER TABLE users ADD COLUMN photo_url TEXT;

-- table to store staff availability slots
CREATE TABLE IF NOT EXISTS staff_availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  staff_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day TEXT(10) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  UNIQUE (staff_id, day, start_time, end_time)
);

CREATE INDEX IF NOT EXISTS idx_staff_availability_staff_id ON staff_availability(staff_id);
