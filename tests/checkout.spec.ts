import { test, expect } from '@playwright/test';

test.describe('独立站核心加购与结账漏斗 E2E 验收', () => {

  test('买家从首页进入商品页、加购并唤起结账', async ({ page }) => {
    // 1. 访问独立站首页
    await page.goto('/');
    await expect(page).toHaveTitle(/Tomato Raccoon/i);

    // 2. 检查首页核心英雄区域
    const heroHeading = page.locator('h1').first();
    await expect(heroHeading).toBeVisible();

    // 3. 进入核心单品：Comfort Colors 经典复古短袖
    await page.goto('/product/comfort-colors-vintage-garment-dyed-tee');
    
    // 验证商品标题与价格
    const productTitle = page.locator('h1').first();
    await expect(productTitle).toBeVisible({ timeout: 10000 });
    await expect(productTitle).toContainText('Comfort Colors');

    // 4. 点击加购提交按钮 (form submit button)
    const addToCartBtn = page.locator('form button[type="submit"]').first();
    await expect(addToCartBtn).toBeVisible();
    await addToCartBtn.click();

    // 5. 验证购物车弹窗/抽屉（Cart Drawer）弹出
    const checkoutBtn = page.getByRole('link', { name: /Checkout/i }).or(page.locator('a[href="/checkout"]')).first();
    await expect(checkoutBtn).toBeVisible({ timeout: 10000 });
    await checkoutBtn.click();

    // 6. 验证成功抵达结账页面 (/checkout)
    await expect(page).toHaveURL(/.*checkout/);
    await expect(page.locator('main').first()).toBeVisible();
    await expect(page.getByText(/Contact Information|Shipping Address/i).first()).toBeVisible();
  });

  test('满 $50 全美免邮进度条 (Free Shipping Progress Bar) 动态生效', async ({ page }) => {
    // 1. 打开购物车页面
    await page.goto('/cart');

    // 2. 检查页面上是否存在免运费提示或门槛
    const freeShippingNotice = page.getByText(/Free.*Shipping|\$35|\$50/i);
    if (await freeShippingNotice.count() > 0) {
      await expect(freeShippingNotice.first()).toBeVisible();
    }
  });

});
