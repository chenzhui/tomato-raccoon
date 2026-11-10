const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  const buttons = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button'))
      .map(b => ({ text: b.innerText.trim(), class: b.className, disabled: b.disabled }));
  });
  console.log('ALL_PAGE_BUTTONS:', JSON.stringify(buttons, null, 2));

  // 截一张当前支付页面的图
  const shotPath = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/payment-screen.png';
  await page.screenshot({ path: shotPath });
  console.log('SCREENSHOT_SAVED:', shotPath);
})();
