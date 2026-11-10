const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('[1/4] 连接 Chrome 窗口...');
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('[2/4] 点击【添加卡片】提交银行卡信息...');
  const submitBtn = page.locator('button:has-text("添加卡片"), button:has-text("Add card")').first();
  await submitBtn.waitFor({ state: 'visible', timeout: 10000 });
  await submitBtn.click({ force: true });

  console.log('>>> 已点击添加卡片，等待银行卡验证与保存...');
  await page.waitForTimeout(6000);

  // 截取添加结果
  const cardResultPath = 'C:/All/Me/2027/work/Shopify/.playwright-mcp/card-added-result.png';
  await page.screenshot({ path: cardResultPath });
  console.log('[3/4] 银行卡添加结果截图已保存:', cardResultPath);

  // ----------------------------------------------------
  // 执行环节 1：导航到 API 管理页面生成 API Token
  // ----------------------------------------------------
  console.log('[4/4] 正在前往 Printify API 管理页面生成 Token...');
  await page.goto('https://printify.com/app/account/api', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  console.log('CURRENT_URL_API:', page.url());
})();
