# Shopify 1 天极速上线标准 SOP (Fast-Track SOP)

> **目标**：在 24 小时内完成 Tomato Raccoon 独立站搭建、选品同步、收单挂载与全链路测试，进入可公开收款发货状态。

---

## 阶段一：店铺注册与基础配置 (耗时: 30 分钟)

1. **注册 Shopify 账户**：
   - 访问 [shopify.com](https://www.shopify.com/)，选择“Start free trial”（通常可享受 $1 首月体验期）。
   - 店铺名称暂填：`Tomato Raccoon Studio`（生成的临时域名为 `tomato-raccoon-studio.myshopify.com`）。
   - 地区选择：根据执照/收单主体保持一致（如中国大陆或个体工商户所在地），货币选择 **USD (美元)**。
2. **选择免费官方主题**：
   - 进入 Shopify Admin -> **Online Store -> Themes**。
   - 默认即为 **Dawn** 主题（Shopify 官方基准主题，性能最高、加载速度最快，移动端转化率行业第一）。
   - 点击 **Customize**（自定义）：
     - 主色调配置：背景色偏米白暖色（`#FDFBF7`），强调色使用暗森林绿（`#1B3B2B`）与番茄红（`#D9381E`）。
     - 头部 Header：上传 `assets/final/raccoon_tomato.svg` 作为品牌 Logo。
     - 导航栏设置：`Shop All`（全部周边）、`Our Story`（品牌抗争故事）、`Track Order`（物流追踪）。

---

## 阶段二：Printify 官方 App 一键连通与商品上架 (耗时: 15 分钟)

1. **在 Printify 中连接 Shopify**：
   - 登录你的 [Printify 控制台](https://printify.com/)。
   - 点击右上角店铺下拉框 -> **Manage My Stores -> Add new store**。
   - 在列表中选择 **Shopify**。
   - 输入你的店铺域名：`xxxx.myshopify.com`，点击 **Connect**。
   - 系统自动跳转至 Shopify 应用商店，点击 **Install app (安装应用)** 并授权。
2. **一键发布 5 款抗议核心周边**：
   - 回到 Printify 的 **My Products** 页面（此前我们通过脚本和人工已经建好的 5 款周边）：
     1. `Comfort Colors 1717 经典短袖 (Grow Tomatoes, Not Data Centers)`
     2. `Gildan 18500 连帽卫衣 (Official Protest Hoodie)`
     3. `草坪抗议标语牌 (Yard Sign 带 H 型金属支架)`
     4. `车尾保险杠防晒车贴 (Bumper Sticker)`
     5. `高光模切贴纸 (Kiss-Cut Vinyl Sticker)`
   - 对每一款周边点击 **Publish (发布)**：
     - Printify 会自动在你的 Shopify 建立商品列表、上传对应颜色的高清 Mockup 模特图、设置多尺码（S/M/L/XL/2XL）与库存映射。
     - 发布后回到 Shopify Admin -> **Products**，即可看到商品全部就绪！

---

## 阶段三：Airwallex 跨境收单接入 (耗时: 20 分钟)

1. **安装 Airwallex Payments 插件**：
   - 在 Shopify 后台左下角点击 **Settings (设置) -> Payments (收款)**。
   - 在 **Supported payment methods** 区域点击 **Add payment methods -> Search by provider**。
   - 输入 `Airwallex Payments` 并选择安装。
2. **凭据绑定与激活**：
   - 安装完成后点击 **Manage**。
   - 填入你的 Airwallex 生产环境 Client ID 与 API Key（在执照审核通过后由 Airwallex 后台获取）。
   - 勾选支持的支付手段：**Credit Card (Visa / Mastercard / Amex / Discover)**、**Apple Pay**、**Google Pay**。
   - 点击 **Activate** 激活收单网关。

---

## 阶段四：合规政策页面一键录入 (耗时: 10 分钟)

欧美收单风控（Airwallex / Visa 规则）强制要求独立站必须具备 4 大合规协议，否则可能被暂停收单：

1. 打开 Shopify 后台 -> **Settings -> Policies**。
2. 分别打开 [`POLICIES_TEMPLATES.md`](file:///C:/All/Me/2027/work/Shopify/tomato_raccoon_shopify/POLICIES_TEMPLATES.md)：
   - 复制 **Shipping Policy** 到 Shopify 的“运输政策”输入框；
   - 复制 **Refund & Return Policy** 到“退款政策”输入框；
   - 复制 **Terms of Service** 到“服务条款”输入框；
   - 复制 **Privacy Policy** 到“隐私政策”输入框；
   - 复制 **Contact Information** 到“联系信息”输入框。
3. 点击 **Save**。Shopify 会自动在页脚（Footer）和结账页面生成合规法律条款链接。

---

## 阶段五：域名绑定与去密码锁 (耗时: 15 分钟)

1. **域名绑定**：
   - 进入 **Settings -> Domains**。
   - 点击 **Connect existing domain**（若在 Namecheap/Cloudflare 购买）或直接在 Shopify 内部 **Buy new domain**（约 $15/年，自动配置 DNS，零配置门槛）。
2. **去除前台密码 (Remove Password)**：
   - 进入 **Online Store -> Preferences**。
   - 在 **Password protection** 区域，取消勾选 `Restrict access to visitors with the password`。
   - 店铺正式向全球互联网公开访问！

---

## 阶段六：真实链路测试 (Test Mode Order)

1. **测试下单**：
   - 在前台挑一件 $8 的模切贴纸加入购物车，进入 Checkout。
   - 观察结账页面是否清晰展现 Apple Pay / 信用卡支付入口。
   - 填写美国收货地址并完成支付。
2. **验证 Printify 接收**：
   - 进入 Printify 后台 -> **Orders**。
   - 观察是否在 1~2 分钟内出现该笔订单，状态为 `Waiting for fulfillment`（等待生产）。
   - 验证无误后，即可在 Printify 后台取消测试订单或直接执行全流程出单。
