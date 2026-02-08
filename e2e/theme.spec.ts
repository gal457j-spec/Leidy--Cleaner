import { test, expect } from '@playwright/test';

// Basic E2E: verifica aplicação do tema verde e variável CSS
test('aplica tema verde e persiste accent-color', async ({ page }) => {
  await page.goto('/');

  // abrir seletor de tema (assume existe um botão com aria-label)
  const btn = page.getByRole('button', { name: /Selecionar tema/i });
  await btn.click();

  // clicar na opção 'Verde'
  const verde = page.getByRole('button', { name: /Verde/i });
  await verde.click();

  // esperar que html tenha data-theme="green"
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'green');

  // verificar variável CSS --accent-color
  const accent = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim());
  expect(accent).toBe('rgb(6 120 80)');
});
