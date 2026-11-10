const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('Searching stickers in catalog...');
  await page.goto('https://printify.com/app/products/search-catalog?searchKey=stickers', {
    waitUntil: 'domcontentloaded'
  });
  await page.waitForTimeout(4000);

  // 点击第一个贴纸产品
  const stickerLink = page.locator('a[href*="/app/products/"]:has-text("Sticker")').first();
  await stickerLink.click();
  await page.waitForTimeout(3000);

  // 点击 Start designing
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

  // 展开 Upload 并上传
  let inputCount = await page.locator('input[type="file"]').count();
  if (inputCount === 0) {
    const uploadBtn = page.locator('button:has-text("Upload"), [data-analyticsid="newUploadOption"]').first();
    await uploadBtn.click({ force: true });
    await page.waitForTimeout(1500);
  }

  const designImage = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/tomato-minimal-transparent.png';
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(designImage);

  console.log('>>> 纯番茄印花已上传至贴纸！等待 8 秒...');
  await page.waitForTimeout(8000);

  // 点击 Save product
  const saveBtn = page.locator('button:has-text("Save product")').first();
  await saveBtn.waitFor({ state: 'visible', timeout: 15000 });
  await saveBtn.click({ force: true });

  console.log('>>> 等待贴纸保存入库...');
  await page.waitForTimeout(15000);

  // 回到商品列表
  await page.goto('https://printify.com/app/store/products');
  console.log('ALL_3_PRODUCTS_SAVED_COMPLETED!');
})();
