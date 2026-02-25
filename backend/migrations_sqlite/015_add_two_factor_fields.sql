-- Migration: 015_add_two_factor_fields.sql
-- Description: Add two-factor authentication fields to users table (SQLite)
-- Date: 2026-02-25

-- Add 2FA columns to users table
ALTER TABLE users ADD COLUMN two_factor_secret TEXT;
ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT 0;
ALTER TABLE users ADD COLUMN backup_codes TEXT; -- JSON array of hashed codes
ALTER TABLE users ADD COLUMN last_2fa_verification DATETIME;
ALTER TABLE users ADD COLUMN failed_2fa_attempts INTEGER DEFAULT 0;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_two_factor_enabled ON users(two_factor_enabled);
CREATE INDEX IF NOT EXISTS idx_users_last_2fa_verification ON users(last_2fa_verification);