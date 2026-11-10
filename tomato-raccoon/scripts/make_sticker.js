const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  console.log('[1/5] 连接 Chrome 制作第三款：模切极客防水贴纸 (Kiss-Cut Stickers)...');
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('[2/5] 打开 Kiss-Cut Stickers 产品页...');
  await page.goto('https://printify.com/app/products/310/generic-brand/kiss-cut-stickers', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForTimeout(3000);

  console.log('[3/5] 点击 Start designing 进入贴纸编辑器...');
  const startBtn = page.locator('a[href*="/app/editor/"], button:has-text("Start designing")').first();
  await startBtn.waitFor({ state: 'visible', timeout: 20000 });
  await startBtn.click();

  await page.waitForURL('**/app/editor/**', { timeout: 30000 });
  await page.waitForTimeout(4000);

  // 清除新手引导
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  console.log('[4/5] 展开 Upload 面板并注入纯番茄极简版高清透明图...');
  let inputCount = await page.locator('input[type="file"]').count();
  if (inputCount === 0) {
    const uploadBtn = page.locator('button:has-text("Upload"), [data-analyticsid="newUploadOption"]').first();
    await uploadBtn.click({ force: true });
    await page.waitForTimeout(1500);
  }

  const designImage = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/tomato-minimal-transparent.png';
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(designImage);

  console.log('>>> 纯番茄印花已注入贴纸！等待 8 秒渲染...');
  await page.waitForTimeout(8000);

  console.log('[5/5] 点击 Save product 保存贴纸到店铺...');
  const saveBtn = page.locator('button:has-text("Save product")').first();
  await saveBtn.waitFor({ state: 'visible', timeout: 15000 });
  await saveBtn.click({ force: true });

  console.log('>>> 等待贴纸保存入库...');
  await page.waitForTimeout(15000);

  console.log('STICKER_SAVED_SUCCESSFULLY!');
  console.log('CURRENT_URL:', page.url());

  // 导航回 My products
  await page.goto('https://printify.com/app/store/products');
  console.log('NAVIGATED_BACK_TO_MY_PRODUCTS');
})();
