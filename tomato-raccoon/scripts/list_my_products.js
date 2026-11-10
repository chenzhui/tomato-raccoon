const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];
  await page.waitForTimeout(3000);
  const titles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, p, span, h3'))
      .map(el => el.innerText ? el.innerText.trim() : '')
      .filter(t => t.includes('Hooded') || t.includes('Garment-Dyed') || t.includes('Gildan') || t.includes('Comfort Colors'));
  });
  console.log('PRODUCTS_FOUND:', JSON.stringify([...new Set(titles)], null, 2));
})();
