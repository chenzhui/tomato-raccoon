const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];
  console.log('CURRENT_URL:', page.url());
  console.log('CURRENT_TITLE:', await page.title());

  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, a, [role="button"]'))
      .map(b => b.innerText ? b.innerText.trim().replace(/\n/g, ' ') : '')
      .filter(t => t.length > 0 && (
        t.toLowerCase().includes('save') || 
        t.toLowerCase().includes('add') || 
        t.toLowerCase().includes('submit') ||
        t.toLowerCase().includes('card') ||
        t.toLowerCase().includes('confirm')
      ));
  });
  console.log('ACTION_BUTTONS:', JSON.stringify(buttons, null, 2));
})();
