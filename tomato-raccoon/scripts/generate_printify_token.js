const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');
const fs = require('fs');

(async () => {
  console.log('[1/4] 连接 Chrome API 管理页...');
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('[2/4] 点击 Generate 按钮展开 Token 创建弹窗...');
  const genBtn = page.locator('button:has-text("Generate")').first();
  await genBtn.click();
  await page.waitForTimeout(2000);

  // 输入 Token description
  console.log('[3/4] 输入 Token 名称并勾选权限...');
  const input = page.locator('input[type="text"], textarea, [placeholder*="description"], [placeholder*="Name"]').first();
  if (await input.isVisible()) {
    await input.fill('Tomato Raccoon Store Automation');
    await page.waitForTimeout(500);
  }

  // 勾选所有权限 checkbox
  const checkboxes = page.locator('input[type="checkbox"]');
  const count = await checkboxes.count();
  for (let i = 0; i < count; i++) {
    const cb = checkboxes.nth(i);
    if (!await cb.isChecked()) {
      await cb.check({ force: true }).catch(() => {});
    }
  }

  // 点击生成确认按钮
  const confirmBtn = page.locator('button:has-text("Generate token"), button:has-text("Save"), button.primary').last();
  await confirmBtn.click({ force: true });
  await page.waitForTimeout(3000);

  // 提取生成的 Token 字符串
  const token = await page.evaluate(() => {
    // 尝试寻找带有 copy 或者 code 或者 token 的文本
    const codeEl = document.querySelector('code, pre, [class*="token"], [class*="copy"], input[readonly]');
    if (codeEl) {
      return codeEl.value || codeEl.innerText || '';
    }
    // 寻找包含长字符串的元素
    const all = Array.from(document.querySelectorAll('span, p, div, input'))
      .map(el => (el.value || el.innerText || '').trim())
      .filter(t => t.length > 25 && !t.includes(' ') && !t.includes('\n'));
    return all[0] || null;
  });

  console.log('EXTRACTED_TOKEN:', token);

  if (token && token.length > 20) {
    const envPath = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/.env.local';
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
    
    // 更新或追加 PRINTIFY_API_TOKEN 和 PRINTIFY_SHOP_ID
    if (envContent.includes('PRINTIFY_API_TOKEN=')) {
      envContent = envContent.replace(/PRINTIFY_API_TOKEN=.*/, `PRINTIFY_API_TOKEN=${token}`);
    } else {
      envContent += `\nPRINTIFY_API_TOKEN=${token}\nPRINTIFY_SHOP_ID=29674533\n`;
    }
    fs.writeFileSync(envPath, envContent, 'utf-8');
    console.log('[4/4] 成功将 PRINTIFY_API_TOKEN 写入 .env.local！');
  } else {
    console.log('Token 需要人工确认或点击复制，已截屏保存');
    await page.screenshot({ path: 'C:/All/Me/2027/work/Shopify/.playwright-mcp/api-token-page.png' });
  }
})();
