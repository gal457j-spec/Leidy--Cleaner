import { Page } from '@playwright/test';

// base address used by all tests; can be overridden via env var
export const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

export async function resetDb(page: Page) {
  try {
    const response = await page.request.post('http://localhost:3001/api/v1/test/reset');
    if (!response.ok()) {
      console.warn('resetDb failed:', await response.text());
    }
  } catch (err) {
    console.warn('error resetting database:', err);
  }
}

export function attachNetworkLogger(page: Page) {
  page.on('requestfailed', request => {
    console.warn('request failed', request.url(), request.failure()?.errorText);
  });
}
