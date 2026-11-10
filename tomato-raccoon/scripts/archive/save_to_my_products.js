const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  console.log('[1/7] 连接前台可见 Chrome...');
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('[2/7] 正在导航至 Comfort Colors 1717 短袖产品页...');
  await page.goto('https://printify.com/app/products/706/comfort-colors-print-on-demand/unisex-garment-dyed-t-shirt', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForTimeout(3000);

  console.log('[3/7] 点击 Start designing 进入设计编辑器...');
  const startBtn = page.locator('a[href*="/app/editor/"], button:has-text("Start designing")').first();
  await startBtn.waitFor({ state: 'visible', timeout: 20000 });
  await startBtn.click();

  await page.waitForURL('**/app/editor/**', { timeout: 30000 });
  console.log('[4/7] 已进入编辑器，跳过弹窗遮罩...');
  await page.waitForTimeout(4000);

  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  console.log('[5/7] 展开 Upload 面板并上传透明底小浣熊...');
  const uploadNav = page.locator('[data-analyticsid="newUploadOption"], button:has-text("Upload")').first();
  await uploadNav.click({ force: true });
  await page.waitForTimeout(1500);

  const designImage = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/grow-tomatoes-transparent.png';
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 20000 }),
    page.locator('button:has-text("My device"), text="My device"').first().click({ force: true })
  ]);
  await fileChooser.setFiles(designImage);

  console.log('[6/7] 印花上传成功！正在等待画布居中渲染...');
  await page.waitForTimeout(8000);

  console.log('[7/7] 点击 Save product 正式保存到 My products...');
  const saveBtn = page.locator('button:has-text("Save product")').first();
  await saveBtn.waitFor({ state: 'visible', timeout: 15000 });
  await saveBtn.click({ force: true });

  console.log('>>> 正在等待保存并跳转到商品列表/详情页...');
  await page.waitForTimeout(12000);

  console.log('FINISHED_ALL_SAVED_TO_STORE');
  console.log('FINAL_URL:', page.url());
})();
