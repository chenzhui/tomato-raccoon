const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  console.log('[1/6] 连接前台可见 Chrome 窗口...');
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  // ----------------------------------------------------
  // 第一款：草坪抗议标语牌 (Plastic Yard Sign)
  // ----------------------------------------------------
  console.log('[2/6] 正在制作第一款：草坪抗议标语牌 (Plastic Yard Sign)...');
  await page.goto('https://printify.com/app/products/1205/generic-brand/plastic-yard-sign', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForTimeout(3000);

  const startBtn1 = page.locator('a[href*="/app/editor/"], button:has-text("Start designing")').first();
  await startBtn1.waitFor({ state: 'visible', timeout: 20000 });
  await startBtn1.click();

  await page.waitForURL('**/app/editor/**', { timeout: 30000 });
  await page.waitForTimeout(4000);

  // 清除遮罩
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  // 展开 Upload
  let inputCount1 = await page.locator('input[type="file"]').count();
  if (inputCount1 === 0) {
    const uploadBtn = page.locator('button:has-text("Upload"), [data-analyticsid="newUploadOption"]').first();
    await uploadBtn.click({ force: true });
    await page.waitForTimeout(1500);
  }

  // 注入小浣熊抱番茄透明高清大图
  const raccoonImg = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/grow-tomatoes-transparent.png';
  const fileInput1 = page.locator('input[type="file"]').first();
  await fileInput1.setInputFiles(raccoonImg);
  console.log('>>> 草坪牌印花载入成功！等待 8 秒渲染居中...');
  await page.waitForTimeout(8000);

  // 点击 Save product
  const saveBtn1 = page.locator('button:has-text("Save product")').first();
  await saveBtn1.waitFor({ state: 'visible', timeout: 15000 });
  await saveBtn1.click({ force: true });
  console.log('>>> 草坪牌已保存入库！等待 12 秒...');
  await page.waitForTimeout(12000);

  // ----------------------------------------------------
  // 第二款：汽车保险杠长条抗议车贴 (Bumper Stickers)
  // ----------------------------------------------------
  console.log('[3/6] 正在制作第二款：汽车保险杠长条车贴 (Bumper Stickers)...');
  await page.goto('https://printify.com/app/products/598/generic-brand/bumper-stickers', {
    waitUntil: 'domcontentloaded',
    timeout: 60000
  });
  await page.waitForTimeout(3000);

  const startBtn2 = page.locator('a[href*="/app/editor/"], button:has-text("Start designing")').first();
  await startBtn2.waitFor({ state: 'visible', timeout: 20000 });
  await startBtn2.click();

  await page.waitForURL('**/app/editor/**', { timeout: 30000 });
  await page.waitForTimeout(4000);

  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
  }

  let inputCount2 = await page.locator('input[type="file"]').count();
  if (inputCount2 === 0) {
    const uploadBtn = page.locator('button:has-text("Upload"), [data-analyticsid="newUploadOption"]').first();
    await uploadBtn.click({ force: true });
    await page.waitForTimeout(1500);
  }

  // 车贴使用纯番茄极简版（高对比度，汽车后保险杠极易识别）
  const tomatoImg = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/tomato-minimal-transparent.png';
  const fileInput2 = page.locator('input[type="file"]').first();
  await fileInput2.setInputFiles(tomatoImg);
  console.log('>>> 车贴印花载入成功！等待 8 秒渲染居中...');
  await page.waitForTimeout(8000);

  const saveBtn2 = page.locator('button:has-text("Save product")').first();
  await saveBtn2.waitFor({ state: 'visible', timeout: 15000 });
  await saveBtn2.click({ force: true });
  console.log('>>> 车贴已保存入库！等待 12 秒...');
  await page.waitForTimeout(12000);

  // ----------------------------------------------------
  // 导航回 My products 统一验收
  // ----------------------------------------------------
  console.log('[4/6] 正在返回商品列表页 (My products)...');
  await page.goto('https://printify.com/app/store/products', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  console.log('ALL_PROTEST_PRODUCTS_CREATED_SUCCESSFULLY!');
})();
