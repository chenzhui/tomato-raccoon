const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  const count = await page.locator('input[type="file"]').count();
  console.log('FILE_INPUTS_COUNT:', count);

  const designImage = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/grow-tomatoes-transparent.png';
  if (count > 0) {
    console.log('Directly injecting file into first input[type="file"]...');
    await page.locator('input[type="file"]').first().setInputFiles(designImage);
    console.log('INJECTED_SUCCESSFULLY!');
  } else {
    // 查找上传按钮或卡片
    console.log('No direct input[type="file"], checking upload buttons...');
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button, a, div[role="button"]'))
        .map(b => b.innerText ? b.innerText.trim().replace(/\n/g, ' ') : '')
        .filter(t => t.includes('Upload') || t.includes('device') || t.includes('My'));
    });
    console.log('MATCHED_BUTTONS:', buttons);
  }
})();
