-- Schema principal do banco de dados
-- PostgreSQL

-- Tabela de Usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash VARCHAR(255),
  address TEXT,
  profile_image VARCHAR(500),
  role VARCHAR(50) DEFAULT 'customer',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Serviços
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  base_price DECIMAL(10, 2) NOT NULL,
  icon VARCHAR(50),
  duration_minutes INTEGER,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Agendamentos
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  team_member_id INTEGER REFERENCES users(id),
  booking_date TIMESTAMP NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  metragem DECIMAL(10, 2),
  frequency VARCHAR(50) DEFAULT 'once',
  urgency VARCHAR(50) DEFAULT 'normal',
  total_price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'pending',
  payment_status VARCHAR(50) DEFAULT 'unpaid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Serviços por Agendamento
CREATE TABLE booking_services (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  service_id INTEGER REFERENCES services(id),
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Transações de Pagamento
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(100),
  payment_gateway_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Avaliações
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id),
  user_id INTEGER REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images JSON,
  is_verified BOOLEAN DEFAULT true,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Histórico de Notificações
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  booking_id INTEGER REFERENCES bookings(id),
  type VARCHAR(100),
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_transactions_booking ON transactions(booking_id);
