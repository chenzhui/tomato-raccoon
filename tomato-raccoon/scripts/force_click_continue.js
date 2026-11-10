const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('Force clicking 继续访问...');
  const continueBtn = page.locator('.zjzw-footer__external-continue, button:has-text("继续访问")').first();
  await continueBtn.click({ force: true });
  await page.waitForTimeout(5000);

  const pages = browser.contexts()[0].pages();
  const current = pages[pages.length - 1];
  console.log('JUMPED_TO_URL:', current.url());
  console.log('JUMPED_PAGE_TITLE:', await current.title());

  const shotPath = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/zhejiang-open-business-final.png';
  await current.screenshot({ path: shotPath });
  console.log('Screenshot saved to:', shotPath);
})();
