import { test, expect } from '@playwright/test';

test.describe('全站商品目录、品牌叙事与合规页面完整性 E2E 验收', () => {

  const coreProducts = [
    { slug: 'comfort-colors-vintage-garment-dyed-tee', title: 'Comfort Colors 1717' },
    { slug: 'gildan-heavy-blend-protest-hoodie', title: 'Gildan 18500' },
    { slug: 'official-lawn-yard-sign-with-metal-stake', title: 'Yard Sign' },
    { slug: 'weatherproof-vinyl-bumper-sticker-pack', title: 'Bumper Sticker' },
    { slug: 'the-farm-defender-raccoon-plush', title: 'Plush' },
  ];

  for (const item of coreProducts) {
    test(`验证周边单品详情页渲染: ${item.slug}`, async ({ page }) => {
      await page.goto(`/product/${item.slug}`);
      await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
      // 验证图片元素正常展示（避免破图）
      const images = page.locator('img');
      expect(await images.count()).toBeGreaterThan(0);
    });
  }

  test('验证品牌叙事页 (/about) 木刻版画与抗争故事正常呈现', async ({ page }) => {
    await page.goto('/about');
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.getByText(/Virginia|Data Center|Tomato/i).first()).toBeVisible();
  });

  test('验证四大收单审核合规政策页面可公开访问', async ({ page }) => {
    // 1. Shipping Policy
    await page.goto('/shipping-policy');
    await expect(page.getByText(/Shipping|USPS|Delivery/i).first()).toBeVisible();

    // 2. Refund & Return Policy
    await page.goto('/refund-policy');
    await expect(page.getByText(/Refund|Return|Defective/i).first()).toBeVisible();

    // 3. Terms of Service
    await page.goto('/terms-of-service');
    await expect(page.getByText(/Terms of Service/i).first()).toBeVisible();

    // 4. Privacy Policy
    await page.goto('/privacy-policy');
    await expect(page.getByText(/Privacy Policy/i).first()).toBeVisible();
  });

  test('验证逆向物流追踪页面 (/track-order) 表单可交互', async ({ page }) => {
    await page.goto('/track-order');
    const orderInput = page.getByPlaceholder(/Order Number|TR-/i).or(page.locator('input').first());
    await expect(orderInput).toBeVisible();
  });

});
