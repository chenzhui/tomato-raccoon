const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];
  const items = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/app/products/"]'))
      .map(a => ({ text: a.innerText.trim().replace(/\n/g, ' '), href: a.href }))
      .filter(x => x.href.match(/\/app\/products\/\d+/));
  });
  console.log('STICKER_ITEMS:', JSON.stringify(items.slice(0, 5), null, 2));
})();
