const { firefox } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');
const fs = require('fs');

(async () => {
  console.log('[Step 1] 启动 Firefox 引擎加载用户配置...');
  const context = await firefox.launchPersistentContext(
    'C:/All/Me/2026/bevy_game_a_3d/util/playwright/firefox-profile',
    {
      executablePath: 'C:/Program Files/Firefox Developer Edition/firefox.exe',
      headless: true,
      proxy: { server: 'http://127.0.0.1:7897' },
      viewport: { width: 1440, height: 900 }
    }
  );

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  console.log('[Step 2] 打开 Comfort Colors 1717 T恤产品页...');
  await page.goto('https://printify.com/app/products/706/comfort-colors-print-on-demand/unisex-garment-dyed-t-shirt', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForTimeout(3000);

  console.log('[Step 3] 进入在线设计编辑器...');
  const startBtn = page.locator('a[href*="/app/editor/"], button:has-text("Start designing")').first();
  await startBtn.waitFor({ state: 'visible', timeout: 20000 });
  await startBtn.click();

  await page.waitForURL('**/app/editor/**', { timeout: 30000 });
  console.log('[Step 4] 已进入设计编辑器:', page.url());
  await page.waitForTimeout(5000);

  // 清除新手引导
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  console.log('[Step 5] 上传纯透明底小浣熊印花图...');
  const designImage = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/grow-tomatoes-transparent.png';

  // 展开左侧 Upload 工具面板
  const uploadNav = page.locator('[data-analyticsid="newUploadOption"], button:has-text("Upload")').first();
  await uploadNav.click({ force: true });
  await page.waitForTimeout(1500);

  // 点击 My device 并上传文件
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 20000 }),
    page.locator('button:has-text("My device"), text="My device"').first().click({ force: true })
  ]);
  await fileChooser.setFiles(designImage);
  console.log('[Step 6] 印花已载入画布，等待 10 秒居中渲染...');
  await page.waitForTimeout(10000);

  // 截图编辑器设计预览
  const previewPath = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/products/tee-designed-preview.png';
  await page.screenshot({ path: previewPath });
  console.log('[Step 7] 编辑器实时预览截图已保存:', previewPath);

  // 点击 Save product 保存
  console.log('[Step 8] 点击 Save product 保存商品...');
  const saveBtn = page.locator('button:has-text("Save product")').first();
  if (await saveBtn.isVisible()) {
    await saveBtn.click({ force: true });
    console.log('[Step 9] 正在生成 Printify 官方全套模特效果图...');
    await page.waitForTimeout(15000);
  }

  // 最终商品效果图
  const finalMockup = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/products/tee-final-mockup.png';
  await page.screenshot({ path: finalMockup });
  console.log('[Step 10] 最终成品短袖效果图已生成:', finalMockup);

  console.log('PRINTIFY_TEE_FINISHED');
  await context.close();
})();
