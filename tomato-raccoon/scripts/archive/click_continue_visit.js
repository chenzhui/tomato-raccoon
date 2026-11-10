const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('Clicking 继续访问...');
  const continueBtn = page.locator('button:has-text("继续访问"), a:has-text("继续访问")').first();
  await continueBtn.click();
  await page.waitForTimeout(5000);

  // 检查是否打开了新页面或跳转了
  const pages = browser.contexts()[0].pages();
  const activePage = pages[pages.length - 1];
  console.log('ACTIVE_PAGE_URL:', activePage.url());
  console.log('ACTIVE_PAGE_TITLE:', await activePage.title());

  const shotPath = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/zhejiang-scjgj-target.png';
  await activePage.screenshot({ path: shotPath });
  console.log('Saved screenshot to:', shotPath);
})();
