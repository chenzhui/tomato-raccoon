const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('Navigating to Shengzhou City Home on Zhejiang Gov...');
  await page.goto('https://www.zjzwfw.gov.cn/zjservice-fe/#/home?webId=330683', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('Current page title:', await page.title());
  console.log('Current URL:', page.url());

  // 截一张图
  const shotPath = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/shengzhou-home-loggedin.png';
  await page.screenshot({ path: shotPath });
  console.log('Screenshot saved to:', shotPath);
})();
