# Tomato Raccoon 独立站严苛测试套件 (E2E & Sandbox Test Suite)

> 本目录为 Tomato Raccoon 独立站的生产级测试中枢，涵盖 **Playwright 浏览器级端到端测试 (UI E2E)** 与 **跨境商业沙箱全链路联调 (Sandbox Integration)**。

---

## 一、 测试用例清单 (Test Specs)

| 测试文件 | 覆盖范围与验证要点 |
| :--- | :--- |
| **[`checkout.spec.ts`](file:///C:/All/Me/2027/work/Shopify/tests/checkout.spec.ts)** | **核心转化漏斗**：首页 ➡️ 进入 Comfort Colors 1717 短袖页 ➡️ 选择 L 码 ➡️ 点击 Add to Cart ➡️ 验证购物车抽屉与 $50 免邮进度条 ➡️ 调起结账页。 |
| **[`catalog_and_navigation.spec.ts`](file:///C:/All/Me/2027/work/Shopify/tests/catalog_and_navigation.spec.ts)** | **全站目录与合规检查**：5 款核心抗议单品详情页图片加载、`/about` 弗吉尼亚抗争叙事页、4 大收单审核合规政策页、`/track-order` 物流追踪交互。 |
| **[`sandbox_and_boundary.spec.ts`](file:///C:/All/Me/2027/work/Shopify/tests/sandbox_and_boundary.spec.ts)** | **四大极限边界场景**：移动端结账视口防遮挡、Webhook 幂等性防重录、不存在订单查询优雅兜底、售后工单参数容错。 |

---

## 二、 如何运行自动化 Playwright 测试

### 1. 终端静默/报告模式 (CLI Mode)
```bash
# 在 Shopify 根目录下运行（自动唤起 tomato-raccoon 本地服务）
cd C:\All\Me\2027\work\Shopify
npx --prefix tomato-raccoon playwright test
```

### 2. 有头浏览器模式 (亲眼看机器人自动点点点)
```bash
npx --prefix tomato-raccoon playwright test --headed
```
> 机器会自动调起本地真实 Chrome 浏览器窗口，一秒一帧在屏幕上演示点击尺码、加入购物车和结账跳转。

### 3. 可视化控制台模式 (Playwright UI Mode)
```bash
npx --prefix tomato-raccoon playwright test --ui
```
> 弹出图形化调试面板，支持时间轴穿梭（Time Travel）、实时审查 DOM 元素、查看每一步的网络请求与页面截图。

---

## 三、 跨境业务沙箱联调指南 (Sandbox Runbook)

### 1. Airwallex 支付沙箱测试卡
在沙箱测试模式下，结账页面使用以下测试卡进行全链路充值/扣款联调：

| 测试场景 | 测试卡号 | 有效期 | CVV | 预期结果 |
| :--- | :--- | :---: | :---: | :--- |
| **正常扣款成功** | `4111 2222 3333 4444` (Visa)<br/>`5555 5555 5555 4444` (Mastercard) | 填未来年份 (如 12/28) | `123` | 返回 `SUCCEEDED`，触发订单持久化 |
| **余额不足拒付** | `4000 0000 0000 0002` | 任意未来日期 | `123` | 提示 `Card Declined (余额不足)`，页面不卡死 |
| **过期卡测试** | `4000 0000 0000 0003` | 填过去年份 (如 01/20) | `123` | 提示 `Card Expired (卡已过期)` |

### 2. 本地调试 Webhook（使用 ngrok 穿透）
当买家刷卡成功后，Airwallex 会向后端发送异步 Webhook 回调：
```bash
# 1. 启动本地 Next.js 服务
cd C:\All\Me\2027\work\Shopify\tomato-raccoon
npm run dev

# 2. 新开终端启动内网穿透
ngrok http 3000
```
* 将 ngrok 分配的临时公网域名（如 `https://abc1234.ngrok-free.app`）加上后缀：
  `https://abc1234.ngrok-free.app/api/webhooks/airwallex`
* 填入 Airwallex 后台作为 Webhook 回调地址，即可在本地控制台实时捕获扣款通知并完成自动推单。

### 3. Printify 订单防误印保护 (Manual Approval)
* ⚠️ **重要设置**：在 Printify 后台 -> **Settings -> Order Approval** 中，务必勾选 **“Manual (手动审核)”**。
* 这样即便本地测试脚本成功调用了 Printify 抛单 API，订单也只是挂在 Printify 后台呈 `On Hold (待审核)` 状态，**绝不会自动扣除你的信用卡底成本**。核对参数无误后，手动点击“Cancel”即可安全取消。
