# `app/` 目录说明文档

本目录是 **Next.js (App Router)** 的核心路由与页面体系。在 Next.js 中，**文件夹层级对应 Web URL 路径**，文件夹内的 `page.tsx` 即为该路由对应的渲染页面。

---

## 1. 根级别基础文件说明

| 文件名 | 类型 | 作用与功能说明 |
| :--- | :--- | :--- |
| `layout.tsx` | 根布局 (Root Layout) | 全局最外层 HTML/Body 骨架，挂载全局字体、Header 导航栏、Footer 页脚、通知组件与 Cookie 提示。 |
| `page.tsx` | 网站首页 (Home) | 独立站主页，包含 Hero 视觉横幅、**桌面搭配模拟器 (Desk Simulator)** 入口、热门 AI 娘立牌/桌垫展区。 |
| `globals.css` | 全局样式表 | 基于 Tailwind CSS v4 的全局样式、暗色/亮色 CSS 变量、滚动条定制与动画关键帧。 |
| `navbar.tsx` | 导航栏组件 | 页面顶部导航栏，集成品牌 Logo、类目跳转、实时搜索浮层以及购物车状态按钮。 |
| `footer.tsx` | 页脚组件 | 页面底部栏，包含快速链接、退换货与物流政策链接、版权合规声明与货币选择器。 |
| `cart-button.tsx` | 购物车图标按钮 | 位于导航栏右上角，显示当前购物车内商品件数角标，点击唤起侧边购物车抽屉。 |
| `not-found.tsx` | 404 页面 | 访问不存在的页面时显示的二次元极客风格 404 错误缺省页。 |
| `error.tsx` | 错误边界 (Error Boundary) | 页面级运行时异常捕获组件，展示友好的崩溃提示与重试按钮。 |
| `global-error.tsx` | 全局致命错误兜底 | 根布局自身崩溃时的兜底页面，包含基础 `<html>` 与 `<body>`。 |
| `sitemap.ts` | 站点地图生成器 | 动态生成 `/sitemap.xml`，利于 Google 等搜索引擎爬虫索引全站商品与页面。 |
| `robots.ts` | 爬虫协议生成器 | 动态生成 `/robots.txt`，规范搜索引擎蜘蛛的抓取规则。 |
| `search-suggest.ts` | 搜索建议配置 | 提供顶部搜索栏的热门搜索词与快速联想配置。 |
| `robots.test.ts` | 自动化单测 | 验证 `robots.txt` 规则生成是否符合预期。 |
| `palette.test.ts` | 自动化单测 | 验证系统颜色主题调色板的一致性。 |

---

## 2. 页面路由子目录说明 (`app/*`)

| 目录路径 | 访问 URL | 作用与业务逻辑 |
| :--- | :--- | :--- |
| `product/[slug]/` | `/product/[slug]` | **商品详情页 (PDP)**：核心转化页，包含 AI 娘立绘大图切换、材质/尺寸 SKU 选择、阶梯降价促销组件 (`urgency-badge`)、产品参数与极客评价区。 |
| `checkout/` | `/checkout` | **结账付款页**：原生客态极速下单页面，包含收货地址校验、支付方式选择，直连 PostgreSQL 创建真实订单。 |
| `track-order/` | `/track-order` | **订单追踪查询页**：用户自助售后页面，通过订单号或邮箱实时查询订单状态（打包中、已出库、国际物流单号）。 |
| `returns/` | `/returns` | **售后/换货申请页**：极客专属无忧换新门户，支持上传亚克力破损照片与瑕疵描述，工单直写入库。 |
| `faq/` | `/faq` | **常见问题与避坑指南**：撕膜防刮说明（保护膜误认划痕）、严禁用酒精擦拭亚克力说明、海外发货周期解答。 |
| `cart/` | `/cart` | **独立购物车页**：商品数量修改、价格明细计算、优惠码核销及进入结账入口。 |
| `category/` | `/category/[category]` | **分类列表页**：展示特定分类（如“桌垫 Desk Mats”、“亚克力立牌 Standees”）下的商品集合。 |
| `category-filtered/` | `/category-filtered` | **带复杂过滤器的分类页**：支持多重标签（角色、价格区间、材质）组合筛选。 |
| `products/` | `/products` | **全量商品列表 (PLP)**：展示全店所有上架的极客周边。 |
| `products-filtered/` | `/products-filtered` | **带高级筛选的全量商品页**：带侧边过滤抽屉的商品大厅。 |
| `collection/` | `/collection/[collection]`| **精选专辑页**：例如“AI 娘全员典藏套装”集合专题页。 |
| `order/` | `/order/[id]` | **订单完成确认页 (Thank You Page)**：支付成功后的回执页面，展示订单摘要与追踪引导。 |
| `search/` | `/search` | **搜索结果页**：按关键词搜索角色名、周边品类的结果呈现页。 |
| `about/` | `/about` | **品牌理念与关于我们**：介绍 AI-Chan 极客周边品牌背后的开源与同人二次元文化。 |
| `blog/` | `/blog` | **极客日志 / 博客大厅**：周边打样过程、材质测评、新品预告文章。 |
| `contact/` | `/contact` | **联系我们**：官方技术支持与海外客服联系表单。 |
| `privacy-policy/` | `/privacy-policy` | **隐私权政策 (Privacy Policy)**：跨境出海合规声明（GDPR/CCPA 标准）。 |
| `terms-of-service/` | `/terms-of-service` | **服务条款 (Terms of Service)**：线上购买协议与免责条款。 |
| `shipping-policy/` | `/shipping-policy` | **国际物流政策 (Shipping Policy)**：海外直邮时效与关税说明。 |
| `refund-policy/` | `/refund-policy` | **退款与换货政策 (Refund Policy)**：破损免费补发规则说明。 |
| `legal/` | `/legal` | **综合法律协议合集**：法律合规索引页。 |
| `api/` | `/api/*` | **后端 REST API 路由**：供前端页面调用的服务端数据接口（详见 `api/README.md`）。 |
