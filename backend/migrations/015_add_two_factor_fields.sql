-- Migration: 015_add_two_factor_fields.sql
-- Description: Add two-factor authentication fields to users table
-- Date: 2026-02-25

-- Add 2FA columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS backup_codes TEXT; -- JSON array of hashed codes
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_2fa_verification TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_2fa_attempts INTEGER DEFAULT 0;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_two_factor_enabled ON users(two_factor_enabled);
CREATE INDEX IF NOT EXISTS idx_users_last_2fa_verification ON users(last_2fa_verification);