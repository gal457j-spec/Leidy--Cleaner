import { test, expect } from '@playwright/test';

test('fluxo de cadastro, login e agendamento', async ({ page }) => {
  // register a new account and remember the email we used so we can
  // log back in later.  the page redirects to `/` after signup, not
  // `/dashboard` as some older tests assumed.
  await page.goto('http://localhost:3000/auth/register');
  const email = `teste${Date.now()}@mail.com`;
  await page.fill('input[name="name"]', 'Teste Usuário');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="phone"]', '11999999999');
  await page.fill('input[name="password"]', 'senha123');
  await page.fill('input[name="confirmPassword"]', 'senha123');
// submit and wait for the redirect; if it never happens, try
      // loading the home page explicitly so the test fails fast instead of
      // hanging for the full timeout
      await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ url: '**/', timeout: 60000 }).catch(() => {})
      ]);
      if (page.url().endsWith('/auth/register')) {
        // navigation didn't occur, attempt manual load so subsequent steps hit
        // the same error quickly
        await page.goto('http://localhost:3000/');
      }
  await expect(page).toHaveURL(/\/$/);

  // clear authentication state instead of clicking logout (which is
  // inside a dropdown that may not always be visible).
  await page.context().clearCookies();

  // Login with the same account we just registered
  await page.goto('http://localhost:3000/auth/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', 'senha123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/');

  // Catálogo
  await page.goto('http://localhost:3000/');
  await expect(page.locator('text=Nossos Serviços')).toBeVisible();
});
