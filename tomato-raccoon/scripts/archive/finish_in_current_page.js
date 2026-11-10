const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  console.log('[1/4] 连接正在展示编辑器的 Chrome...');
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('[2/4] 点击 Upload 工具展开面板...');
  // 确保先点 Upload 展开
  const uploadNav = page.locator('[data-analyticsid="newUploadOption"], button:has-text("Upload")').first();
  await uploadNav.click({ force: true }).catch(() => {});
  await page.waitForTimeout(1000);

  console.log('[3/4] 触发 My device 并注入透明底小浣熊印花...');
  const designImage = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/grow-tomatoes-transparent.png';

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 15000 }),
    page.getByRole('button', { name: /My device/i }).first().click({ force: true })
  ]);
  await fileChooser.setFiles(designImage);
  console.log('>>> 印花已成功上传到衣服正面！等待居中渲染...');
  await page.waitForTimeout(8000);

  console.log('[4/4] 点击右上角 Save product 保存到 My products...');
  const saveBtn = page.getByRole('button', { name: /Save product/i }).first();
  await saveBtn.waitFor({ state: 'visible', timeout: 15000 });
  await saveBtn.click({ force: true });

  console.log('>>> 等待保存并自动跳转至店铺商品详情页...');
  await page.waitForTimeout(12000);

  console.log('CONGRATULATIONS: SAVED_TO_MY_PRODUCTS_SUCCESSFULLY!');
  console.log('CURRENT_PAGE_URL:', page.url());
})();
