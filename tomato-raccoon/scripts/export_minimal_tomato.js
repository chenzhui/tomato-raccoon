const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');
const fs = require('fs');

(async () => {
  const src = 'C:/Users/25192/.gemini/antigravity-cli/brain/914d01f6-e301-4ffa-9487-4e46c93ab4dc/.user_uploaded/uploaded_media_1_1794237797236.svg';
  let content = fs.readFileSync(src, 'utf-8');
  
  // 移除白色背景 path
  content = content.replace(/<path d="M0,1374[^"]*" fill="#FDFCFC"\/>\s*/, '');
  
  const dstSvg = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/tomato-minimal-transparent.svg';
  fs.writeFileSync(dstSvg, content, 'utf-8');
  console.log('Saved transparent minimal SVG.');

  // 渲染超高清透明 PNG
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1145, height: 1374 },
    deviceScaleFactor: 3
  });

  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            background: transparent;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          svg {
            width: 100%;
            height: 100%;
          }
        </style>
      </head>
      <body>
        ${content}
      </body>
    </html>
  `);

  const dstPng = 'C:/All/Me/2027/work/Shopify/tomato-raccoon/public/images/tomato-minimal-transparent.png';
  await page.screenshot({ path: dstPng, omitBackground: true });
  console.log('Saved high-res minimal PNG to', dstPng);
  await browser.close();
})();
