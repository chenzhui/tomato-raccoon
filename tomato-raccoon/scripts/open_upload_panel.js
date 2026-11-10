const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  console.log('Clicking Upload button...');
  const uploadBtn = page.locator('button:has-text("Upload"), [data-analyticsid="newUploadOption"]').first();
  await uploadBtn.click();
  await page.waitForTimeout(2000);

  const fileInputs = await page.locator('input[type="file"]').count();
  console.log('AFTER_CLICK_FILE_INPUTS:', fileInputs);

  const texts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button, div, span, p'))
      .map(el => el.innerText ? el.innerText.trim() : '')
      .filter(t => t.includes('device') || t.includes('Dropbox') || t.includes('Google Drive') || t.includes('Upload'));
  });
  console.log('UPLOAD_PANEL_TEXTS:', [...new Set(texts)].slice(0, 15));
})();
