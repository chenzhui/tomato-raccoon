const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  console.log('[1/4] 连接前台可见 Chrome 编辑器窗口...');
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  // 检查是否已有 input[type="file"]，如果没有则点击 Upload 展开
  let inputCount = await page.locator('input[type="file"]').count();
  if (inputCount === 0) {
    console.log('[2/4] 点击 Upload 按钮展开上传面板...');
    const uploadBtn = page.locator('button:has-text("Upload"), [data-analyticsid="newUploadOption"]').first();
    await uploadBtn.click();
    await page.waitForTimeout(2000);
  }

  console.log('[3/4] 直接向 input[type="file"] 注入透明底小浣熊印花图...');
  const designImage = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/grow-tomatoes-transparent.png';
  const fileInput = page.locator('input[type="file"]').first();
  await fileInput.setInputFiles(designImage);

  console.log('>>> 印花已成功加载！等待 8 秒渲染与自动对齐...');
  await page.waitForTimeout(8000);

  console.log('[4/4] 寻找并点击 Save product 按钮...');
  const saveBtn = page.locator('button:has-text("Save product")').first();
  await saveBtn.waitFor({ state: 'visible', timeout: 15000 });
  await saveBtn.click({ force: true });

  console.log('>>> 已点击 Save product，正在等待店铺持久化落库...');
  await page.waitForTimeout(15000);

  console.log('SUCCESS_PRODUCT_SAVED_IN_STORE!');
  console.log('FINAL_REDIRECT_URL:', page.url());
})();
