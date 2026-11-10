const { chromium } = require('C:/Users/25192/AppData/Local/npm-cache/_npx/6914489a61678098/node_modules/playwright-core');

(async () => {
  const browser = await chromium.connectOverCDP('ws://[::1]:9222/devtools/browser/d3b1c0ab-e9ae-4117-ad4d-6b236e0dc205');
  const page = browser.contexts()[0].pages()[0];

  // 直接打开浙江政务服务网嵊州市站点的个体工商户设立登记事项页
  // 嵊州本级代码: 330683
  const shengzhouUrl = 'https://www.zjzwfw.gov.cn/zjservice-fe/#/search?type=item&keyword=%E4%B8%AA%E4%BD%93%E5%B7%A5%E5%95%86%E6%88%B7%E8%AE%BE%E7%AB%8B%E7%99%BB%E8%AE%B0&webId=330683';
  console.log('Navigating to Shengzhou Individual Business Registration Item...');
  await page.goto(shengzhouUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  console.log('PAGE_TITLE:', await page.title());
  console.log('CURRENT_URL:', page.url());
})();
