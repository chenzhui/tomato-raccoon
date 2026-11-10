const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('[Step 1] 启动可见 Chrome 浏览器并载入已登录会话...');
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
  
  console.log('[Step 2] 正在打开 Comfort Colors 1717 产品详情页...');
  await page.goto('https://printify.com/app/products/706/comfort-colors-print-on-demand/unisex-garment-dyed-t-shirt', {
    waitUntil: 'domcontentloaded',
    timeout: 45000
  });

  console.log('[Step 3] 点击 Start designing 进入设计编辑器...');
  const startBtn = page.locator('a[href*="/app/editor/"], button:has-text("Start designing")').first();
  await startBtn.waitFor({ state: 'visible', timeout: 20000 });
  await startBtn.click();

  console.log('[Step 4] 等待编辑器加载...');
  await page.waitForURL('**/app/editor/**', { timeout: 30000 });
  await page.waitForTimeout(4000);

  // 清除任何新手引导遮罩或弹窗
  console.log('[Step 4.1] 清除新手引导遮罩与弹窗...');
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  }
  const skipBtn = page.locator('button:has-text("Got it"), button:has-text("Skip"), button:has-text("Next"), button[aria-label="Close"]').first();
  if (await skipBtn.isVisible()) {
    await skipBtn.click({ force: true }).catch(() => {});
  }

  console.log('[Step 5] 准备上传印花文件...');
  const designImage = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/grow-tomatoes-transparent.png';
  
  // 注入文件到文件上传 input (若存在直接注入，若没有则点击 My device)
  let uploaded = false;
  const fileInputs = page.locator('input[type="file"]');
  if (await fileInputs.count() > 0) {
    try {
      await fileInputs.first().setInputFiles(designImage);
      console.log('[Step 5.1] 直接通过 input[type="file"] 注入成功！');
      uploaded = true;
    } catch (e) {
      console.log('Direct input failed, fallback to filechooser:', e.message);
    }
  }

  if (!uploaded) {
    console.log('[Step 5.2] 触发文件选择器...');
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser', { timeout: 15000 }),
      page.locator('button:has-text("My device"), [data-analyticsid="newUploadOption"]').first().click({ force: true })
    ]);
    await fileChooser.setFiles(designImage);
    console.log('[Step 5.3] 文件已注入！');
  }

  console.log('[Step 6] 等待画布生成并居中图案...');
  await page.waitForTimeout(8000);

  // 截取编辑器设计效果图
  const editorShot = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/editor-design-preview.png';
  await page.screenshot({ path: editorShot });
  console.log('[Step 7] 编辑器设计效果图已保存至:', editorShot);

  // 点击 Save product
  console.log('[Step 8] 点击 Save product...');
  const saveBtn = page.locator('button:has-text("Save product")').first();
  if (await saveBtn.isVisible()) {
    await saveBtn.click({ force: true });
    console.log('[Step 9] 已点击 Save product，等待保存完成...');
    await page.waitForTimeout(10000);
  }

  // 截取最终效果
  const finalShot = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/final-result.png';
  await page.screenshot({ path: finalShot });
  console.log('[Step 10] 最终成品截图已保存至:', finalShot);
  console.log('ALL_DONE_SUCCESS');
})();
