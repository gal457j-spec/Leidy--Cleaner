-- Create staff/providers table
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    photo_url VARCHAR(500),
    experience_years INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    service_radius_km INTEGER DEFAULT 10,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'Brazil',
    specialties TEXT[], -- Array of service categories
    hourly_rate DECIMAL(10,2),
    languages TEXT[] DEFAULT ARRAY['Portuguese'],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create staff_services junction table
CREATE TABLE IF NOT EXISTS staff_services (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    custom_price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, service_id)
);

-- Create staff_availability table
CREATE TABLE IF NOT EXISTS staff_availability (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, day_of_week, start_time, end_time)
);

-- Create staff_reviews table
CREATE TABLE IF NOT EXISTS staff_reviews (
    id SERIAL PRIMARY KEY,
    staff_id INTEGER REFERENCES staff(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_staff_location ON staff USING gist (point(longitude, latitude));
CREATE INDEX IF NOT EXISTS idx_staff_services ON staff_services(staff_id, service_id);
CREATE INDEX IF NOT EXISTS idx_staff_availability ON staff_availability(staff_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_staff_rating ON staff(rating DESC);

-- Function to update staff rating
CREATE OR REPLACE FUNCTION update_staff_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE staff
    SET rating = (
        SELECT AVG(rating)::DECIMAL(3,2)
        FROM staff_reviews
        WHERE staff_id = NEW.staff_id AND is_approved = true
    ),
    total_reviews = (
        SELECT COUNT(*)
        FROM staff_reviews
        WHERE staff_id = NEW.staff_id AND is_approved = true
    )
    WHERE id = NEW.staff_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update rating when review is added/updated
CREATE TRIGGER trigger_update_staff_rating
    AFTER INSERT OR UPDATE ON staff_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_staff_rating();