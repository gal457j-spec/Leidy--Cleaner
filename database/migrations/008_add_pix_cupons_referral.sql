-- PIX Transactions Table
CREATE TABLE IF NOT EXISTS pix_transactions (
  id TEXT PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, paid, expired, failed
  order_id TEXT,
  br_code TEXT,
  bank_transaction_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME,
  paid_at DATETIME,
  FOREIGN KEY (order_id) REFERENCES bookings(id)
);

-- Cupons & Promoções
CREATE TABLE IF NOT EXISTS coupons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  discount_percent INT,
  discount_flat DECIMAL(10, 2),
  max_uses INT,
  uses_count INT DEFAULT 0,
  valid_from DATETIME,
  valid_until DATETIME,
  min_amount DECIMAL(10, 2),
  description TEXT,
  created_by INTEGER,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS coupon_uses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  coupon_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  booking_id TEXT,
  discount_amount DECIMAL(10, 2),
  used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Referral Program
CREATE TABLE IF NOT EXISTS referral_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  code TEXT UNIQUE NOT NULL,
  reward_amount DECIMAL(10, 2) DEFAULT 50.00,
  signup_count INT DEFAULT 0,
  reward_earned DECIMAL(10, 2) DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS referral_signups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  referrer_id INTEGER NOT NULL,
  new_user_id INTEGER NOT NULL,
  reward_amount DECIMAL(10, 2),
  status TEXT DEFAULT 'pending', -- pending, completed
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (referrer_id) REFERENCES users(id),
  FOREIGN KEY (new_user_id) REFERENCES users(id)
);

-- Blog Posts
CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  author_id INTEGER,
  category TEXT,
  keywords TEXT,
  published BOOLEAN DEFAULT 0,
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 2FA Secrets
ALTER TABLE users ADD COLUMN two_fa_secret TEXT;
ALTER TABLE users ADD COLUMN two_fa_enabled BOOLEAN DEFAULT 0;
ALTER TABLE users ADD COLUMN two_fa_backup_codes TEXT; -- JSON array
