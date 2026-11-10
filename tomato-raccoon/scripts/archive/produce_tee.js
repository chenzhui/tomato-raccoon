const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');
const fs = require('fs');

(async () => {
  console.log('>>> [1/6] 启动浏览器会话...');
  const context = await chromium.launchPersistentContext(
    'C:/All/Me/2027/work/Shopify/.playwright-chrome-profile',
    {
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: false,
      proxy: { server: 'http://127.0.0.1:7897' },
      args: ['--start-maximized'],
      viewport: { width: 1440, height: 900 }
    }
  );

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  console.log('>>> [2/6] 进入 Comfort Colors 1717 详情页...');
  await page.goto('https://printify.com/app/products/706/comfort-colors-print-on-demand/unisex-garment-dyed-t-shirt', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForTimeout(3000);

  console.log('>>> [3/6] 点击 Start designing 进入编辑器...');
  const startBtn = page.locator('a[href*="/app/editor/"], button:has-text("Start designing")').first();
  await startBtn.waitFor({ state: 'visible', timeout: 20000 });
  await startBtn.click();

  await page.waitForURL('**/app/editor/**', { timeout: 30000 });
  console.log('>>> 已进入编辑器:', page.url());
  await page.waitForTimeout(5000);

  // 清除新手浮层遮罩
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  console.log('>>> [4/6] 点击 Upload 展开上传面板...');
  const uploadNav = page.locator('[data-analyticsid="newUploadOption"], button:has-text("Upload")').first();
  await uploadNav.click({ force: true });
  await page.waitForTimeout(1500);

  console.log('>>> [5/6] 注入透明底小浣熊高清印花...');
  const designImage = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/grow-tomatoes-transparent.png';

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 20000 }),
    page.locator('button:has-text("My device"), text="My device"').first().click({ force: true })
  ]);
  await fileChooser.setFiles(designImage);
  console.log('>>> 印花文件已成功加载！等待画布渲染与居中...');
  await page.waitForTimeout(10000);

  // 截图画布设计效果
  const previewPath = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/tshirt-designed-preview.png';
  await page.screenshot({ path: previewPath });
  console.log('>>> 设计画布截图已保存至:', previewPath);

  console.log('>>> [6/6] 点击 Save product 保存商品...');
  const saveBtn = page.locator('button:has-text("Save product")').first();
  if (await saveBtn.isVisible()) {
    await saveBtn.click({ force: true });
    console.log('>>> 等待 Printify 保存并生成模特效果图 (Mockups)...');
    await page.waitForTimeout(15000);
  }

  const mockupPath = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/tshirt-final-mockup.png';
  await page.screenshot({ path: mockupPath });
  console.log('>>> 最终成品效果图已保存至:', mockupPath);
  console.log('>>> ALL_COMPLETED_SUCCESSFULLY');

  await context.close();
})();
