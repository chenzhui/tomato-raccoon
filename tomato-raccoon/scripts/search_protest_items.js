const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('Searching yard signs...');
  await page.goto('https://printify.com/app/products/search-catalog?searchKey=yard%20sign', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const yardSigns = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/app/products/"]'))
      .map(a => ({ title: a.innerText.trim().replace(/\n/g, ' '), href: a.href }))
      .filter(x => x.title.toLowerCase().includes('yard sign') && x.href.match(/\/app\/products\/\d+/));
  });
  console.log('YARD_SIGNS:', JSON.stringify(yardSigns.slice(0, 3), null, 2));

  console.log('Searching bumper stickers...');
  await page.goto('https://printify.com/app/products/search-catalog?searchKey=bumper%20sticker', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const bumperStickers = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a[href*="/app/products/"]'))
      .map(a => ({ title: a.innerText.trim().replace(/\n/g, ' '), href: a.href }))
      .filter(x => x.title.toLowerCase().includes('bumper') && x.href.match(/\/app\/products\/\d+/));
  });
  console.log('BUMPER_STICKERS:', JSON.stringify(bumperStickers.slice(0, 3), null, 2));
})();
