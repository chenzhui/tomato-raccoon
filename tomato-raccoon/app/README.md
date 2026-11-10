# `app/` 核心路由与页面架构说明文档

本目录是 **Next.js (App Router)** 的核心路由体系。在 Next.js 中，**文件夹层级对应 Web URL 路径**，文件夹内的 `page.tsx` 或 `route.ts` 即为该路由对应的页面或接口。

本项目是面向弗吉尼亚农场土壤保护与环保主题抗争周边的 **DTC 跨境精品独立站 (Tomato Raccoon Co.)**。

---

## 1. 根级别基础文件与全站路由

| 文件名 | 类型 | 访问 URL | 作用与业务逻辑 |
| :--- | :--- | :--- | :--- |
| **`layout.tsx`** | 根布局 (Root Layout) | 全站外层 | 全局 HTML/Body 骨架。挂载全局复古暖调背景、顶部 `$50 免邮` 公告栏、导航栏、页尾 4 列合规链接、CartProvider 购物车状态上下文与全局 Sonner 通知提示。 |
| **`page.tsx`** | 网站首页 (Home) | `/` | 独立站主页。包含美式复古田园风 Hero 视觉横幅、品牌理念 Slogan、热门抗争周边（T恤、连帽衫、草坪标牌、车贴）网格展区与 30 天无忧保障徽章。 |
| **`navbar.tsx`** | 顶部导航栏 | 全站共享 | 页面顶部导航栏。集成 Tomato Raccoon 官方 Logo、核心品类快捷跳转、全站实时检索浮层以及购物车唤起按钮。 |
| **`footer.tsx`** | 底部页脚栏 | 全站共享 | 4 列标准美式独立站页尾。包含关于品牌故事、官方客服支持邮箱 (`growtomatoes.service@outlook.com`)、四大合规法务链接与社交媒体标签。 |
| **`cart-button.tsx`** | 购物车角标按钮 | 导航栏右上角 | 实时监听购物车内商品件数角标，点击触发右侧滑出式购物车抽屉 (`cart-sidebar.tsx`)。 |
| **`globals.css`** | 全局样式表 | 全站生效 | 基于 Tailwind CSS v4 与 CSS 变量的主题配色体系，定义森林绿 (`#1E3F20`)、番茄红 (`#C91D04`) 与复古暖米色 (`#FAF7F0`) 设计规范。 |
| **`not-found.tsx`** | 404 错误页 | 缺省兜底 | 访问不存在的商品或路由时展示的友好田园风 404 页面，提供“返回首页”按钮。 |
| **`error.tsx`** | 路由级错误边界 | 页面异常 | 捕获页面渲染期间的运行时异常，展示友好的重试交互。 |
| **`global-error.tsx`** | 全局致命错误兜底 | 根级崩溃 | 根布局自身崩溃时的兜底页面，包含基础 `<html>` 与 `<body>` 标签。 |
| **`sitemap.ts`** | 站点地图生成器 | `/sitemap.xml` | 动态生成标准 XML 站点地图，实时包含所有商品、品类与合规政策页面，供 Google/Bing 等搜索引擎爬取收录。 |
| **`robots.ts`** | 爬虫协议规则 | `/robots.txt` | 规范搜索引擎蜘蛛与爬虫的抓取白名单，屏蔽结算等敏感私有路径。 |
| **`llms.txt/route.ts`** | **AI 搜索引擎专用索引** | `/llms.txt` | **【新兴 Web 标准】供大模型（Perplexity、ChatGPT Search、Claude、Gemini）直接解析的 Markdown 格式店铺知识索引**（详见下文深度解析）。 |
| **`manifest.webmanifest/route.ts`** | PWA 网页清单 | `/manifest.webmanifest` | 提供渐进式 Web 应用（PWA）的元数据、应用名称、主题颜色与高清图标配置。 |
| **`favicon.ico/route.ts`** | 动态站点图标 | `/favicon.ico` | 提供浏览器标签页图标。 |
| **`search-suggest.ts`** | 搜索词联想配置 | 内部逻辑 | 提供搜索栏的热门搜索词预设与实时联想建议。 |

---

## 2. 什么是 `llms.txt`？为什么现代独立站需要它？

[`app/llms.txt/route.ts`](file:///C:/All/Me/2027/work/Shopify/tomato-raccoon/app/llms.txt/route.ts) 动态生成并返回一个标准的文本文件 `/llms.txt`。

- **核心概念**：
  就像 20 年前创立的 `robots.txt` 是为 **传统搜索引擎蜘蛛（Googlebot、Bingbot）** 准备的一样，`llms.txt` 是近年来由 AI 开发者社区倡导并被 **新型 AI 搜索引擎（Perplexity、ChatGPT Search、Google Gemini、Claude、Cursor）** 广泛采纳的公开规范。
- **工作机制**：
  传统的网页充满了复杂的 HTML、CSS、JavaScript 脚本与 DOM 结构，AI 搜索大模型在实时检索网页时不仅解析慢、还极度消耗 Token。
  当海外用户在 ChatGPT 或 Perplexity 中提问：
  > *"Where can I buy a 'Grow Tomatoes Not Data Centers' yard sign or vintage t-shirt?"*
  
  AI 搜索引擎会优先请求网站根目录的 `/llms.txt`。该接口以**极度精简、Token 友好的标准 Markdown 格式**输出：
  1. 店铺官方名称、品牌故事与宗旨；
  2. 核心热销商品列表（包含精准价格、USPS 物流时效、直达链接与商品介绍）；
  3. 四大退款与物流合规政策摘要；
  4. 官方客服支持邮箱。
  
  这使得大模型能以 100% 准确的信息直接引用本店铺的商品并生成带货推荐链接，极大提升独立站在 **GEO (Generative Engine Optimization，生成式 AI 搜索引擎优化)** 中的曝光与引流权重。

---

## 3. 页面路由子目录说明 (`app/*`)

### 🛒 购物与结账主漏斗
| 目录路径 | 访问 URL | 作用与业务逻辑 |
| :--- | :--- | :--- |
| **`product/[slug]/`** | `/product/[slug]` | **商品详情页 (PDP)**：核心单品转化页。包含大图画廊 (`media-gallery`)、尺码款式选择器 (`variant-selector`)、工艺卖点介绍 (`product-features`) 与真实顾客评价 (`product-reviews`)。已彻底去除虚假营销弹窗，保留纯正美式精品风格。 |
| **`cart/`** | `/cart` | **购物车模块**：包含全屏购物车页面、抽屉组件 (`cart-sidebar.tsx`)、满 $50 免运费进度条计算 (`cart-math.ts`) 与折扣码核销 (`discount-code.ts`)。 |
| **`checkout/`** | `/checkout` | **单页结账漏斗**：直连 Supabase 数据库与 Printify 供应链，支持地址输入、实时运费核算及下单。 |
| **`order/success/[id]/`**| `/order/success/[id]` | **支付成功感谢页 (Thank You Page)**：展示订单明细、生成的独有订单号（如 `TR-123456`）及跳转物流查单入口。 |
| **`products/`** | `/products` | **全品类商品探索页**：展示店铺全部周边，支持按价格升降序、热销度及上架时间进行综合排序。 |
| **`category/[...slugs]/`**| `/category/[slug]` | **分类专属筛选页**：支持按品类浏览（如服装 `/category/apparel`、标牌 `/category/lawn-signs`、贴纸 `/category/stickers`）。 |
| **`search/`** | `/search` | **关键词搜索结果页**：按顾客输入的关键词检索匹配商品，带分页与空态提示。 |

### 🍅 品牌文化与逆向服务体系
| 目录路径 | 访问 URL | 作用与业务逻辑 |
| :--- | :--- | :--- |
| **`about/`** | `/about` | **品牌抗争故事页**：图文并茂讲述弗吉尼亚汉诺威农田抵抗高能耗超算数据中心、保卫西红柿优质黑土地的抗争叙事。 |
| **`track-order/`** | `/track-order` | **USPS 实时物流追踪**：顾客输入订单号（如 `TR-123456`）与下单邮箱，即可实时追踪物流打包进度与真实 USPS 物流单号。 |
| **`returns/`** | `/returns` | **30 天无忧售后保障门户**：支持买家在线提交换码、运输破损补发申请，直写入库无需繁琐退换。 |
| **`account/`** | `/account` | **客户自助服务中心**：买家通过邮箱一键免密检索历史购买订单、配送时效与周边清洗保养指南。 |
| **`contact/`** | `/contact` | **官方联系我们**：官方客服表单与支持邮箱 (`growtomatoes.service@outlook.com`) 展示页。 |
| **`faq/`** | `/faq` | **常见问题解答**：全站核心 FAQ 手风琴面板（包含全美 $50 免邮规则、纯棉服饰清洗指南、草坪标牌安装与车贴防晒保养）。 |
| **`support/`** | `/support` | **支持中心导航页**：聚合售后退换、物流追踪、常见问题与联系客服的统一服务大厅。 |

### ⚖️ 海外收单合规四大法律政策（支付网关必查）
| 目录路径 | 访问 URL | 作用与业务逻辑 |
| :--- | :--- | :--- |
| **`privacy-policy/`** | `/privacy-policy` | **隐私政策**：符合 GDPR / CCPA 规范的欧美买家隐私与 Cookie 保护声明。 |
| **`terms-of-service/`**| `/terms-of-service` | **服务条款**：包含交易契约、知识产权与免责条款。 |
| **`shipping-policy/`** | `/shipping-policy` | **物流配送政策**：明确满 $50 全美免运费规则、USPS Ground 3-7 个工作日交付时效。 |
| **`refund-policy/`** | `/refund-policy` | **退款退货政策**：官方“30-Day Defend the Soil Guarantee”满意度保障政策。 |
| **`legal/[slug]/`** | `/legal/[slug]` | **动态合规回退路由**：统一渲染 Markdown 格式法律条款的底层通用页面。 |

---

## 4. 后端 API 路由清单 (`app/api/*`)

| API 端点路径 | 请求方法 | 对应文件 | 接口职责与功能 |
| :--- | :--- | :--- | :--- |
| `/api/cart` | `GET / POST / DELETE` | `cart/route.ts` | 跨端购物车数据同步：读写顾客的购物车商品、数量变更与会话清空。 |
| `/api/checkout/create-order` | `POST` | `checkout/create-order/route.ts` | 结账落单接口：校验收件人地址与金额，生成 `TR-XXXXXX` 订单号并落入 Supabase 数据库。 |
| `/api/orders/track` | `POST` | `orders/track/route.ts` | 订单物流查询接口：供查单页和账户页调用，返回当前配送状态、USPS 单号与时间轴。 |
| `/api/returns/submit` | `POST` | `returns/submit/route.ts` | 售后工单提交接口：接收买家填写的换码或补发申请，自动派发 RMA 编号。 |
| `/api/auth/[...all]` | `ANY` | `auth/[...all]/route.ts` | 预留身份校验路由：处理用户鉴权与会话验证。 |
