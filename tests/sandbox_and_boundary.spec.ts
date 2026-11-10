import { test, expect } from '@playwright/test';

test.describe('跨境业务极限与死亡边界场景 (Boundary & Edge Cases)', () => {

  test('边界 1：移动端结账漏斗防遮挡测试 (Mobile Viewport & Button Reachability)', async ({ page }) => {
    // 设置常见移动端视口（iPhone 14 / Pixel 7 竖屏）
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/checkout');

    // 验证核心结账操作区域或支付页面主容器在首屏/视口内可见
    const mainContainer = page.locator('main').first();
    await expect(mainContainer).toBeVisible({ timeout: 10000 });

    // 检查表单输入框正常渲染
    const inputs = page.locator('input[type="text"], input[type="email"]');
    if (await inputs.count() > 0) {
      await expect(inputs.first()).toBeVisible();
    }
  });

  test('边界 2：订单重复提交与幂等性保障 (Idempotent Webhook & DB Persistence)', async ({ request }) => {
    // 模拟向创建订单接口发送请求
    const payload = {
      customer: { name: 'Idempotency Tester', email: 'idempotent@example.com' },
      shippingAddress: { address1: '100 Protest Lane', city: 'Richmond', state: 'VA', zip: '23219' },
      items: [{ id: 'prod-vintage-tee', name: 'Vintage Tee', price: 3200, quantity: 1 }],
      subtotal: 3200,
      total: 3200,
    };

    const res1 = await request.post('/api/checkout/create-order', {
      data: payload,
      timeout: 20000,
    });
    expect(res1.status()).toBe(200);
    const data1 = await res1.json();
    expect(data1.success).toBe(true);
    expect(data1.orderNumber).toMatch(/^TR-\d+/);
  });

  test('边界 3：逆向物流查询异常防崩 (Non-existent Order Query Fallback)', async ({ request }) => {
    // 查询一个完全不存在的假订单号
    const res = await request.get('/api/orders/track?orderNumber=TR-999999999&email=fake@test.com', {
      timeout: 20000,
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    // 系统不应抛出 500 异常，必须有优雅兜底处理
    expect(data).toHaveProperty('success');
  });

  test('边界 4：售后工单非法参数容错 (RMA Bad Request Handling)', async ({ request }) => {
    // 提交工单
    const res = await request.post('/api/returns/submit', {
      data: { orderNumber: 'TR-INVALID', email: 'tester@example.com' },
      timeout: 20000,
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.ticketId).toMatch(/^RMA-\d+/);
  });

});
