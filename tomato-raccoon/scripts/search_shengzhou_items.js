const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('Searching for 个体工商户开办 / 企业开办 in Shengzhou...');
  const searchInput = page.locator('input[placeholder*="搜索"], input[type="text"]').first();
  await searchInput.fill('个体工商户设立登记');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(4000);

  // 截一张图看搜索结果
  const shotPath = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/shengzhou-search-result.png';
  await page.screenshot({ path: shotPath });
  console.log('Saved search screenshot:', shotPath);

  // 打印搜索结果里的列表项
  const items = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a, button, div.item-title, span'))
      .map(el => ({ text: el.innerText ? el.innerText.trim().replace(/\n/g, ' ') : '', href: el.href || null }))
      .filter(x => x.text.includes('设立') || x.text.includes('个体工商户') || x.text.includes('办理'));
  });
  console.log('FOUND_REGISTRATION_ITEMS:', JSON.stringify(items.slice(0, 10), null, 2));
})();
