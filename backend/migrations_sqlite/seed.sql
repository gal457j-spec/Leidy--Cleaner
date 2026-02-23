-- Seed data script per SQLite
-- Run this file if migrations fail

-- Create migrations table (if not exists)
CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'customer',
  is_active INTEGER DEFAULT 1,
  last_login DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  base_price REAL,
  duration_minutes INTEGER,
  is_active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  service_id TEXT,
  scheduled_date DATETIME,
  booking_date DATETIME,
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  total_price REAL,
  payment_status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(service_id) REFERENCES services(id)
);

-- Seed admin user 
INSERT OR IGNORE INTO users (id, email, password_hash, full_name, phone, role) 
VALUES ('1', 'admin@leidycleaner.com', '$2b$10$YrdOvGxcKAc3E6PXH4v.UeVglM5LVB8zB3VqQ5YZ6h8HcXg6GNQAm', 'Admin Leidy', '11999999999', 'admin');

-- Seed services
INSERT OR IGNORE INTO services (id, name, description, category, base_price, duration_minutes) VALUES
('1', 'Limpeza Residencial Básica', 'Limpeza completa de sua casa, incluindo varredura, limpeza de pisos, banheiro e cozinha', 'Residencial', 150, 120),
('2', 'Limpeza Comercial', 'Limpeza profissional para escritórios, consultórios e pequenos comércios', 'Comercial', 250, 240),
('3', 'Limpeza Pós-Obra', 'Limpeza especializada após reformas, construção ou pintura', 'Especializada', 400, 360),
('4', 'Limpeza de Carpete', 'Limpeza e higienização profissional de carpetes e tapetes', 'Especializada', 200, 180),
('5', 'Limpeza de Janelas', 'Limpeza profissional de janelas, fachada e vidros', 'Especializada', 120, 90),
('6', 'Limpeza de Estofados', 'Limpeza e higienização de sofás, poltronas e almofadas', 'Especializada', 180, 120),
('7', 'Limpeza Pesada', 'Limpeza profunda de ambientes muito sujos ou descuidados', 'Residencial', 300, 300),
('8', 'Limpeza Verde (Ecológica)', 'Limpeza utilizando produtos ecológicos e biodegradáveis', 'Especializada', 200, 120);
