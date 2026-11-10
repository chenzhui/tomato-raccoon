const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  const btn = page.locator('text="掌上办理", text="在线办理"').first();
  if (await btn.isVisible()) {
    console.log('Clicking 掌上办理...');
    await btn.click();
    await page.waitForTimeout(3000);
  }

  // 截一张图
  const shotPath = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/zhejiang-gov-modal.png';
  await page.screenshot({ path: shotPath });
  console.log('Saved screenshot to:', shotPath);

  // 查看页面是否有二维码或者提示
  const texts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.modal, .dialog, [role="dialog"], [class*="popup"], [class*="qr"]'))
      .map(el => el.innerText ? el.innerText.trim().replace(/\n/g, ' ') : '');
  });
  console.log('POPUP_TEXTS:', JSON.stringify(texts));
})();
