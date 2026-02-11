import { test, expect } from '@playwright/test';

test('cadastro E2E: preencher e submeter formulário', async ({ page }) => {
  // Ajuste a URL se seu dev server estiver em outra porta
  await page.goto('http://localhost:3000/cadastro');

  await page.fill('input[name="name"]', 'Playwright User');
  const email = `pw.user.${Date.now()}@example.com`;
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="phone"]', '+5511999000111');
  await page.fill('input[name="password"]', 'pwtest1234');
  await page.fill('input[name="confirmPassword"]', 'pwtest1234');
  await page.selectOption('select[name="role"]', 'cliente');
  await page.check('input[name="acceptTerms"]');

  await Promise.all([
    page.waitForNavigation({ url: /\/dashboard/ }),
    page.click('button:has-text("Criar Conta")')
  ]);

  // Verificar se foi redirecionado ao dashboard e saudação aparece
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('text=Bem-vindo')).toBeVisible();
});
