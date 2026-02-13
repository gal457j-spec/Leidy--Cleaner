/**
 * Environment Variables Validator (ZOD)
 * Valida e tipifica variáveis de environment no startup
 */

const { z } = require('zod');

// Helper to validate SENTRY_DSN - allows empty, placeholder, or valid URL
const sentryDsnSchema = z.string()
  .transform(val => {
    // Allow empty or placeholder values to be undefined
    if (!val || val === '<SET_ME_SENTRY_DSN>' || val.startsWith('<')) {
      return undefined;
    }
    // Validate as URL if it looks like it should be one
    try {
      new URL(val);
      return val;
    } catch (e) {
      return undefined;
    }
  })
  .optional();

const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),
  
  // Database
  DATABASE_URL: z.string().includes('://'),
  
  // JWT
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRE: z.string().default('7d'),
  
  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3001'),
  
  // Email (SMTP)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // Twilio
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  PLACEHOLDER: z.string().optional(),
  
  // PIX
  PLACEHOLDER: z.string().min(32),
  
  // Sentry
  SENTRY_DSN: sentryDsnSchema,
  SENTRY_ENVIRONMENT: z.string().default('development'),
  
  // S3/Upload
  AWS_S3_BUCKET: z.string().optional(),
  AWS_REGION: z.string().optional(),
  PLACEHOLDER: z.string().optional(),
  PLACEHOLDER: z.string().optional(),
  
  // Redis (optional)
  REDIS_URL: z.string().optional(),
  
  // 2FA / ENCRYPTION
  ENCRYPTION_KEY: z.string().min(32).optional(),
  TWO_FACTOR_ISSUER: z.string().default('Leidy Cleaner'),
});

/**
 * Valida e retorna env vars tipificadas
 * @throws {Error} Se validação falhar
 */
function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    // Log validation success (use simple log since logger may not be ready)
    if (process.env.NODE_ENV !== 'test') {
      // Validation successful - no need to log in production
    }
    return env;
  } catch (error) {
    console.error('❌ Environment validation failed:');
    if (error.errors) {
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
    }
    // Silently return defaults in test mode
    if (process.env.NODE_ENV === 'test') {
      return {
        NODE_ENV: 'test',
        PORT: 3000,
        HOST: 'localhost',
        DATABASE_URL: 'sqlite:///:memory:',
        JWT_SECRET: 'PLACEHOLDER!!',
        PLACEHOLDER: 'PLACEHOLDER!!',
        SENTRY_DSN: undefined,
        SENTRY_ENVIRONMENT: 'test'
      };
    }
    // Return defaults in development if env vars missing
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      return {
        NODE_ENV: process.env.NODE_ENV || 'development',
        PORT: process.env.PORT || 3001,
        HOST: process.env.HOST || 'localhost',
        DATABASE_URL: process.env.DATABASE_URL || 'sqlite:///:memory:',
        JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-key-min-32-chars-long!',
        PLACEHOLDER: process.env.PLACEHOLDER || undefined,
        SENTRY_DSN: undefined,
        SENTRY_ENVIRONMENT: 'development'
      };
    }
    throw new Error('Invalid environment configuration');
  }
}

module.exports = {
  validateEnv,
  envSchema
};
