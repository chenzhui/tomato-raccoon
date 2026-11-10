const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');
const fs = require('fs');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('Clicking visibility icon to reveal token...');
  const eyeBtn = page.locator('button:has-text("visibility"), [aria-label*="visibility"], span:has-text("visibility")').first();
  if (await eyeBtn.isVisible()) {
    await eyeBtn.click();
    await page.waitForTimeout(1000);
  }

  // 获取真实 token 字符串
  const token = await page.evaluate(() => {
    // 寻找弹出的包含 token 的 input 或模态框
    const inputs = Array.from(document.querySelectorAll('input[type="text"], input[readonly], code, pre'))
      .map(el => (el.value || el.innerText || '').trim())
      .filter(t => t.length > 30);
    if (inputs.length > 0) return inputs[0];

    const copyBtn = document.querySelector('[data-testid*="copy"], button:has-text("Copy")');
    if (copyBtn) {
      copyBtn.click();
    }
    return document.body.innerText;
  });

  console.log('TOKEN_REVEAL_RESULT:', token.slice(0, 100));

  // 截一张图确认
  const tokenShot = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/token-revealed.png';
  await page.screenshot({ path: tokenShot });
  console.log('Saved screenshot to:', tokenShot);
})();
