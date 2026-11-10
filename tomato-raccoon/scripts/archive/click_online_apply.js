const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  // 搜索 "个体工商户开办" 或者 "企业开办"
  const searchInput = page.locator('input[placeholder*="搜索"], input[type="text"]').first();
  await searchInput.fill('个体工商户开办');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(3000);

  // 截一张图
  const shotPath = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/zhejiang-gov-search.png';
  await page.screenshot({ path: shotPath });
  console.log('Saved screenshot:', shotPath);

  // 获取页面可见的办理链接
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button'))
      .map(el => ({ text: el.innerText.trim().replace(/\n/g, ' '), href: el.href || null }))
      .filter(x => x.text.includes('办理') || x.text.includes('设立') || x.text.includes('个体'));
  });
  console.log('APPLY_LINKS:', JSON.stringify(links.slice(0, 10), null, 2));
})();
