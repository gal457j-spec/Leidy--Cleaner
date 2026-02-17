import { test, expect } from '@playwright/test';

test('cadastro — cria conta e vai ao dashboard', async ({ page }) => {
  await page.goto('/cadastro', { waitUntil: 'networkidle' });

  await page.fill('input[name="name"]', 'Playwright Test User');
  const email = `pw.test.${Date.now()}@example.com`;
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="phone"]', '+5511999000112');
  await page.selectOption('select[name="role"]', 'cliente');
  await page.fill('input[name="password"]', 'pwscript1234');

  await Promise.all([
    page.waitForURL(/\/dashboard/, { timeout: 10000 }).catch(() => {}),
    page.click('button:has-text("Criar conta")'),
  ]);

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('text=Bem-vindo')).toHaveCount(1);
});
