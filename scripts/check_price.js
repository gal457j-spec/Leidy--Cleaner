const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3000/services', { waitUntil: 'networkidle' });
    // wait for a price element to appear
    await page.waitForSelector('span.text-2xl', { timeout: 10000 });
    const priceText = await page.locator('span.text-2xl').first().innerText();
    console.log('PRICE_TEXT::', priceText.trim());
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
