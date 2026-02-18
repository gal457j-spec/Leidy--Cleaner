// Load environment variables for Jest runs
require('dotenv').config({ path: '.env.test' });
// You can set additional test-specific env vars here
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
