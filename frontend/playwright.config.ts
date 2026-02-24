import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// __dirname isn't defined in ES module scope, replicate it using import.meta.url
const rootDir = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  testDir: './tests',
  timeout: 60_000, // give a bit more headroom for slow machines
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  webServer: {
    // start the frontend only from the frontend directory; root has a separate
    // monorepo script which confuses Next/lockfile detection
    command: 'npm run dev',
    cwd: rootDir,
    port: 3000,
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ]
});
