const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');
const path = require('path');
const fs = require('fs');

(async () => {
  const context = await chromium.launchPersistentContext(
    'C:/All/Me/2027/work/Shopify/.playwright-chrome-profile',
    {
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: false,
      proxy: { server: 'http://127.0.0.1:7897' },
      args: ['--start-maximized'],
      viewport: null
    }
  );

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  
  await page.goto('https://printify.com/app/products/706/comfort-colors-print-on-demand/unisex-garment-dyed-t-shirt', {
    waitUntil: 'domcontentloaded',
    timeout: 45000
  });

  const startBtn = page.locator('a[href*="/app/editor/"], button:has-text("Start designing")').first();
  await startBtn.waitFor({ state: 'visible', timeout: 20000 });
  await startBtn.click();

  await page.waitForURL('**/app/editor/**', { timeout: 30000 });
  await page.waitForTimeout(5000);

  // 清除弹窗
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  // 截取当前完整画面
  await page.screenshot({ path: 'C:/All/Me/2027/work/Shopify/.playwright-mcp/editor-inspect.png' });

  // 收集页面上所有的按钮、文本与 input
  const info = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button, a, [role="button"]')).map(b => ({
      tag: b.tagName,
      text: b.innerText.trim().replace(/\n/g, ' '),
      aria: b.getAttribute('aria-label') || b.getAttribute('data-analyticsid') || null,
      class: b.className
    })).filter(x => x.text || x.aria);

    const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
      type: i.type,
      id: i.id,
      name: i.name,
      accept: i.accept
    }));

    return { buttons, inputs };
  });

  console.log('INPUTS FOUND:', JSON.stringify(info.inputs, null, 2));
  console.log('BUTTONS FOUND:', JSON.stringify(info.buttons.slice(0, 30), null, 2));

  // 保持浏览器打开
  console.log('WAITING_FOR_INSPECTION');
  await new Promise(r => setTimeout(r, 20000));
})();
