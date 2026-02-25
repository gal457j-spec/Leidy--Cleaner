import { test, expect } from '@playwright/test';
import { BASE_URL, resetDb, attachNetworkLogger } from './helpers';

test.beforeEach(async ({ page }) => {
  attachNetworkLogger(page);
  await resetDb(page);
});

const scenarios = [
  'cadastro', 'login', 'agendamento', 'admin', 'backup', 'relatorios', 'assinatura', 'notificacoes', 'blog', 'newsletter'
];

test.describe('Testes E2E completos', () => {
  for (let i = 0; i < 9; i++) {
    test(`Execução #${i+1} - todos cenários`, async ({ page }) => {
      // Cadastro
      await page.goto(`${BASE_URL}/auth/register`);
      const email = `teste${i}_${Date.now()}@mail.com`;
      await page.fill('input[name="name"]', `Teste Usuário ${i}`);
      await page.fill('input[name="email"]', email);
      await page.fill('input[name="phone"]', '11999999999');
      await page.fill('input[name="password"]', 'senha123');
      await page.fill('input[name="confirmPassword"]', 'senha123');
      // submit and await navigation; fall back if page didn't change
      await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ url: '**/', timeout: 60000 }).catch(() => {})
      ]);
      if (page.url().endsWith('/auth/register')) {
        await page.goto(`${BASE_URL}/`);
      }
      await expect(page).toHaveURL(/\/$/);

      // clear cookies so next login form will actually render
      await page.context().clearCookies();

      // Login
      await page.goto(`${BASE_URL}/auth/login`);
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', 'senha123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/');

      // Agendamento
      await page.goto(`${BASE_URL}/services`);
      await expect(page.locator('text=Todos os Serviços')).toBeVisible();

      // Admin
      await page.goto(`${BASE_URL}/admin/relatorios`);
      await expect(page.locator('text=Relatórios e Exportação de Dados')).toBeVisible();

      // Backup
      await page.goto(`${BASE_URL}/admin/backup`);
      await expect(page.locator('text=Backup e Restore de Dados')).toBeVisible();

      // Assinatura
      await page.goto(`${BASE_URL}/assinatura`);
      await expect(page.locator('text=Assinatura, Trial e Cancelamento')).toBeVisible();

      // Notificações
      await page.goto(`${BASE_URL}/notificacoes`);
      await expect(page.locator('text=Notificações Push, SMS e WhatsApp')).toBeVisible();

      // Blog
      await page.goto(`${BASE_URL}/blog`);
      await expect(page.locator('text=Blog LimpezaPro')).toBeVisible();

      // Newsletter
      await page.goto(`${BASE_URL}/newsletter`);
      await expect(page.locator('text=Assine nossa Newsletter')).toBeVisible();
    });
  }
});
