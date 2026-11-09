# 🌟 AI-Chan Geek Merch (大模型娘化海外极客周边独立站)

> **项目定位：** 一人公司 (OPC) / 低成本高溢价跨境 POD 极客二次元周边独立站  
> **核心受众：** 欧美及全球程序员、AI 极客 (Reddit `r/LocalLLaMA`, `r/ChatGPT` 用户)、二次元科技宅 (Tech Weebs)  
> **代码架构：** Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + PostgreSQL 16 (本地直连)  
> **设计特色：** 赛博暗黑极客主题 (Cyberpunk Dark Mode) + 桌面搭配模拟器 (Desk Simulator) + 完整出海合规与售后闭环

---

## 📂 项目全目录与文件速查指南

本工程遵循现代 **Next.js App Router** 架构，为了方便习惯了 **Java + Vue** 的开发者快速定位与理解，以下按 MVC 视角详细说明每一个文件与目录的核心职责：

```
yournextstore/
├── app/                  # 🚦 路由与控制器层 (Controller & Views)
├── components/           # 🎨 页面组件与特色微交互 (View Components)
├── lib/                  # ⚙️ 业务逻辑、数据库持久层与数据模型 (Service & Model)
├── public/               # 🖼️ 静态图片与角色资产 (Static Assets)
├── scripts/              # 🛠️ 辅助构建脚本
├── package.json          # 📦 项目依赖与运行脚本
├── tsconfig.json         # 📘 TypeScript 编译配置
├── next.config.ts        # ⚡ Next.js 核心配置文件
├── proxy.ts              # 🛡️ 边缘路由中间件 (Middleware)
└── .env.local            # 🔐 本地环境配置与数据库连接串
```

---

## 🚦 一、 `app/` 路由、页面与接口控制器 (Controller & Views)

Next.js 的 `app/` 目录采用**基于文件系统的路由机制**（文件夹即路由路径，`page.tsx` 即视图渲染入口，`route.ts` 即 REST API 接口）。

### 1. 全局布局与基础页面
* **[app/layout.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/layout.tsx)**：  
  **全局根布局 (Root Layout)**。相当于 Vue 的 `App.vue`。负责注入全局 Geist 字体、顶部导航栏 `Navbar`、底部 `Footer`、主题管理器 `ThemeProvider` 及购物车全局状态 `CartProvider`。
* **[app/page.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/page.tsx)**：  
  **网站首页 (Home Landing Page)**。顺序组装了 `Hero`（含桌面模拟器）、`ProductGrid`（核心 5 款 AI 娘周边列表）、`About`（程序员品牌故事）等模块。
* **[app/navbar.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/navbar.tsx)**：  
  **顶部导航栏组件**。包含桌面端居中导航（Home、Products、Track Order、FAQ）、移动端抽屉折叠菜单、极客品牌 Logo。
* **[app/footer.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/footer.tsx)**：  
  **页脚组件**。提供 5 巨头快捷链接、客服服务时效、合规免责声明及 4 大法律政策直跳链接。
* **[app/globals.css](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/globals.css)**：  
  **全局样式定义文件**。配置了 Tailwind v4 霓虹暗黑主题（深蓝黑背景 `#07090f`、青色霓虹 `#00f2fe`、紫色光晕 `#9d4edd`）及关键帧动画。
* **[app/cart-button.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/cart-button.tsx)**：  
  顶部常驻购物车图标，实时显示当前已选商品件数角标，点击滑出侧边购物车。
* **[app/error.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/error.tsx) & [app/not-found.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/not-found.tsx)**：  
  全站异常降级页面与 404 页面。
* **[app/robots.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/robots.ts) & [app/sitemap.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/sitemap.ts)**：  
  SEO 爬虫规则与全站 XML Sitemap 动态生成器，方便 Googlebot 自动索引收录。

---

### 2. 核心电商交易链路页面
* **[app/checkout/page.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/checkout/page.tsx)**：  
  **极速访客结账页 (Guest Checkout)**。出海高转化核心页面，无需繁琐注册登录即可填入欧美标准收件地址（Address, Apt/Suite, City, State, Zipcode），自动计算满 $40 免运费，并支持 Stripe 沙盒模拟付款。
* **[app/order/success/[id]/page.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/order/success/[id]/page.tsx)**：  
  **下单成功收据落地页**。买家付款后跳转至此，出示订单编号（如 `AI-678413`）、USPS 追踪单号、商品清单及发货准备时间线。
* **[app/product/[slug]/page.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/product/[slug]/page.tsx)**：  
  **商品详情页 (PDP)**。动态路由，接收商品别名（如 `/product/whale-chan-r1-standee`）。负责加载立牌大图相册、规格参数、买家带图五星评价。
* **[app/product/[slug]/add-to-cart-button.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/product/[slug]/add-to-cart-button.tsx)**：  
  详情页加购核心控制器。集成了划线原价锚点、库存警戒线判断、以及紧迫感与阶梯增购插件。
* **[app/product/[slug]/trust-badges.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/product/[slug]/trust-badges.tsx)**：  
  详情页信任背书勋章（7-12天专线送达、双面微米防刮膜、30天无忧换新）。
* **[app/cart/actions.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/cart/actions.ts)**：  
  购物车服务端动作 (Server Actions)，负责将加购操作安全同步至后端会话与数据库。

---

### 3. 售后与客户支持三大标配模块
* **[app/track-order/page.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/track-order/page.tsx)**：  
  **自助运单查询中心**。买家输入订单号即可调取当前订单在 PostgreSQL 中的制作与空运节点，支持一键直跳 USPS 官方查件。
* **[app/returns/page.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/returns/page.tsx)**：  
  **售后破损拍照上传与换新工单中心**。立牌破损无需寄回国内，买家可拍照上传并选择“免费补发新立牌”，自动写入数据库售后表。
* **[app/faq/page.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/faq/page.tsx) & [faq-data.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/faq/faq-data.ts)**：  
  **极客二次元周边 FAQ**。内置开箱撕保护膜指引（避坑核心）、运费时效、免关税说明与合规声明。

---

### 4. Stripe 审核必查 4 大独立合规政策页
* **[app/privacy-policy/page.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/privacy-policy/page.tsx)**：隐私政策条款（GDPR / CCPA 数据合规说明）
* **[app/terms-of-service/page.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/terms-of-service/page.tsx)**：服务条款（明确写明同人二创 Parody 艺术属性，规避侵权）
* **[app/shipping-policy/page.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/shipping-policy/page.tsx)**：物流政策（明确标明 2-4 天打样制作，7-12 天欧美专线）
* **[app/refund-policy/page.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/refund-policy/page.tsx)**：退款政策（明确 30 天无条件破损包赔包补发规则）

---

### 5. 后端 REST API 控制器 (`app/api/`)
* **[app/api/checkout/create-order/route.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/api/checkout/create-order/route.ts)**：  
  **结账创单接口 (`POST`)**。接收收件人与购物车参数，生成订单号 `AI-xxxxxx` 与跟踪号，直接通过 SQL 插入 PostgreSQL `orders` 表。
* **[app/api/orders/track/route.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/api/orders/track/route.ts)**：  
  **运单查询接口 (`GET`)**。根据订单号从 PostgreSQL 查询对应买家、商品与物流阶段。
* **[app/api/returns/submit/route.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/api/returns/submit/route.ts)**：  
  **售后工单提交接口 (`POST`)**。将买家上传的损坏照片与换新诉求持久化至 `return_tickets` 表。
* **[app/api/cart/add-bundle/route.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/app/api/cart/add-bundle/route.ts)**：  
  **全家桶一键加购接口 (`POST`)**。将 5 位 AI 娘全套立牌（$59.99 爆款）瞬间加入购物车。

---

## 🎨 二、 `components/` 视图与特色微交互组件

* **[components/desk-simulator.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/components/desk-simulator.tsx)**：  
  **🔥 核心差异化微交互：`[Desk Setup Simulator 桌面搭配模拟器]`**。  
  * 绘制了带 RGB 机械键盘、4K 代码曲面屏、咖啡杯与极客桌垫的虚拟工位画布；
  * 支持 5 款 AI 娘立牌自由切换、拖拽定位、摆放预览；
  * 点击任意立牌实时弹出傲娇极客台词气泡，并利用 **Web Audio API** 实时合成专属极客提示音阶；
  * 底部集成高转化按钮 `[Get Full Desk Bundle - $59.99 (Save 30%)]`。
* **[components/urgency-badge.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/components/urgency-badge.tsx)**：  
  **紧迫感与阶梯增购插件**。包含“当前有 18 位极客正在浏览”、“库存仅剩 4 件”动效，以及单买 ($16.99) / 任选 3 只 ($42.99 免运费) / 5 只全家桶 ($59.99 送贴纸) 的阶梯单选组件。
* **[components/legal-doc.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/components/legal-doc.tsx)**：  
  出海合规法律文档的统一渲染容器（带返回按钮与加密盾牌标识）。
* **[components/product-card.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/components/product-card.tsx)**：  
  商品卡片组件，负责卡片立绘展示、悬浮微光动效、划线折扣计算与一键加购。
* **[components/sections/hero.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/components/sections/hero.tsx)**：  
  首页 Hero 区域，集成主标语 *"Stop Coding Alone. Bring Your Favorite LLM Waifu to Your Desk."* 并内嵌桌面模拟器。
* **[components/sections/about.tsx](file:///C:/All/Me/2027/work/Shopify/yournextstore/components/sections/about.tsx)**：  
  极客开发者品牌背书故事，讲解为什么用高透亚克力给程序员驱散深夜孤独。
* **`components/ui/`**：  
  基于 Radix Primitives 的原子组件库（按钮 `button.tsx`、抽屉 `sheet.tsx`、手风琴折叠 `accordion.tsx`、提示框 `dialog.tsx`、骨架屏 `skeleton.tsx`）。

---

## ⚙️ 三、 `lib/` 业务逻辑、持久层与数据模型 (Service & Model)

* **[lib/db.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/lib/db.ts)**：  
  **数据库持久层核心 (DAO / Repository)**。连接您服务器的 PostgreSQL（`shop_aichan` 库），内置自动建表 DDL（`products`, `orders`, `return_tickets`, `cart_sessions`）与连接池实例 `pool`。
* **[lib/mock-data.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/lib/mock-data.ts)**：  
  **领域模型与实体数据 (Domain Entity & Seeds)**。定义了黄金 5 巨头（Whale-Chan, Sonnet-Tan, Omni-Chan, Rebel-Tan, TwinStar-Chan）的角色人设、傲娇台词、5 大 SKU 价格矩阵（立牌、团子、娃娃、RGB桌垫、全家桶）以及 20 条带程序员桌搭的五星英文好评。
* **[lib/commerce.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/lib/commerce.ts)**：  
  **电商业务中枢 (Commerce Service Layer)**。实现了对 `commerce-kit` 接口的本地拦截与适配，提供无外部云端 SaaS 依赖的商品搜索、分类、购物车增删改查、运费计算与订单流转逻辑。
* **[lib/cookies.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/lib/cookies.ts)**：  
  购物车 Session Cookie 的解析与安全加解密，保证跨境买家切换页面时购物车数据不丢失。
* **[lib/pricing.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/lib/pricing.ts) & [lib/money.ts](file:///C:/All/Me/2027/work/Shopify/yournextstore/lib/money.ts)**：  
  货币金额转换器。以美分（Cents）为基础单位进行无精度损失的高精度计算，并支持美金标准货币符号渲染（如 `$16.99`）。

---

## 🖼️ 四、 `public/` 静态资源目录

* **`public/images/characters/`**：  
  存放已为您精准裁切并优化的 5 款 AI 娘素材：
  * `whale-chan-badge.png` / `whale-chan-full.png`（Whale-Chan / DeepSeek娘）
  * `sonnet-tan-badge.png` / `sonnet-tan-full.png`（Sonnet-Tan / Claude娘）
  * `omni-chan-badge.png` / `omni-chan-full.png`（Omni-Chan / ChatGPT娘）
  * `rebel-tan-badge.png` / `rebel-tan-full.png`（Rebel-Tan / Grok娘）
  * `twinstar-chan-badge.png` / `twinstar-chan-full.png`（TwinStar-Chan / Gemini娘）

---

## 🛠️ 五、 根目录配置文件说明

* **`package.json`**：项目依赖清单与运行命令脚本（`pnpm dev` 启动开发服务，`pnpm build` 执行静态编译）。
* **`next.config.ts`**：Next.js 全局编译器配置，开启 Turbopack 与图片优化域名白名单。
* **`tsconfig.json`**：TypeScript 编译规则与路径别名映射（例如 `@/components/...` 直接定位到源码目录）。
* **`proxy.ts`**：Next.js 边缘中间件 (Middleware)，拦截处理国际化路由与特定请求代理。
* **`.env.local`**：私密环境变量。已配置您的 PostgreSQL 数据库连接串 `DATABASE_URL=postgresql://postgres:aiguide123456@111.229.139.144:5432/shop_aichan`。

---

## 🚀 六、 快速启动与本地调试

### 1. 启动本地开发服务：
```bash
cd yournextstore
pnpm dev
```
打开浏览器访问：👉 **`http://localhost:3000`**

### 2. 执行全站生产构建检查：
```bash
pnpm build
```
全站 54 个页面支持秒级编译出高静态化的 HTML，无任何第三方依赖阻塞，随时可一键部署至 Vercel 或 Cloudflare Pages！
