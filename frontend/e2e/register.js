const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    console.log('Visiting /cadastro');
    await page.goto('http://localhost:3000/cadastro', { waitUntil: 'networkidle' });

    await page.fill('input[name="name"]', 'PlaywrightScript User');
    const email = `pw.script.${Date.now()}@example.com`;
    console.log('Using email:', email);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="phone"]', '+5511999000112');
    await page.selectOption('select[name="role"]', 'cliente');
    await page.fill('input[name="password"]', 'pwscript1234');

    // submit and wait navigation (button text on the page is 'Criar conta')
    await Promise.all([
      page.waitForNavigation({ url: /\/dashboard/, waitUntil: 'networkidle', timeout: 10000 }).catch(e => { /* ignore */ }),
      page.click('button:has-text("Criar conta")')
    ]);

    const url = page.url();
    console.log('Final URL:', url);
    const hasWelcome = await page.locator('text=Bem-vindo').count();
    console.log('Bem-vindo visible:', !!hasWelcome);

    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('E2E error:', err);
    await browser.close();
    process.exit(2);
  }
})();
