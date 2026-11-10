const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  console.log('1. Connecting/Launching Chrome...');
  const context = await chromium.launchPersistentContext(
    'C:/All/Me/2027/work/Shopify/.playwright-chrome-profile',
    {
      executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
      headless: false,
      proxy: { server: 'http://127.0.0.1:7897' },
      args: ['--start-maximized'],
      viewport: null
    }
  );

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
  
  if (!page.url().includes('/app/editor/')) {
    console.log('Navigating to editor...');
    await page.goto('https://printify.com/app/products/706/comfort-colors-print-on-demand/unisex-garment-dyed-t-shirt', {
      waitUntil: 'domcontentloaded'
    });
    const startBtn = page.locator('a[href*="/app/editor/"], button:has-text("Start designing")').first();
    await startBtn.waitFor({ state: 'visible', timeout: 20000 });
    await startBtn.click();
    await page.waitForURL('**/app/editor/**', { timeout: 30000 });
  }

  await page.waitForTimeout(3000);
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.waitForTimeout(1000);

  console.log('2. Clicking Upload on sidebar...');
  const uploadNav = page.locator('[data-analyticsid="newUploadOption"], button:has-text("Upload")').first();
  await uploadNav.click({ force: true });
  await page.waitForTimeout(1500);

  console.log('3. Triggering My device and injecting file...');
  const designImage = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/grow-tomatoes-transparent.png';

  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 15000 }),
    page.locator('button:has-text("My device"), text="My device"').first().click({ force: true })
  ]);

  console.log('4. FileChooser opened, setting file:', designImage);
  await fileChooser.setFiles(designImage);

  console.log('5. Waiting for design to render on shirt...');
  await page.waitForTimeout(10000);

  await page.screenshot({ path: 'C:/All/Me/2027/work/Shopify/.playwright-mcp/design-preview-1.png' });
  console.log('Screenshot saved to design-preview-1.png');

  console.log('6. Clicking Save product...');
  const saveBtn = page.locator('button:has-text("Save product")').first();
  await saveBtn.waitFor({ state: 'visible', timeout: 15000 });
  await saveBtn.click({ force: true });

  console.log('7. Waiting for save completion...');
  await page.waitForTimeout(10000);

  await page.screenshot({ path: 'C:/All/Me/2027/work/Shopify/.playwright-mcp/product-saved-final.png' });
  console.log('FINAL_SUCCESS_SAVED');
})();
