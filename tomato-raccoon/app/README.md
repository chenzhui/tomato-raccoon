# `app/` 核心路由与文件树说明文档

本目录是 **Next.js (App Router)** 的核心页面与路由体系。目录层级严格对应 Web 访问路径。

---

## 1. 全局架构文件树 (`tree /f`)

```text
tomato-raccoon/app/
│
├── layout.tsx                     # 根布局：全局 HTML 骨架、全站 $50 免邮公告栏、Header/Footer 挂载、CartProvider 状态流
├── page.tsx                       # 独立站首页：复古田园风 Hero 首屏、抗争品牌 Slogan、精选商品展示网格
├── navbar.tsx                     # 顶部导航栏：品牌 Logo、核心品类快速跳转、实时搜索浮层与购物车触发按钮
├── footer.tsx                     # 底部页脚栏：4 列美式独立站布局、官方 Outlook 客服邮箱、合规政策链接与社媒标签
├── cart-button.tsx                # 导航栏购物车按钮：显示购物车内商品数量角标，点击滑出侧边抽屉
├── globals.css                    # 全局样式表：Tailwind CSS v4 主题变量定义（森林绿 #1E3F20、番茄红 #C91D04、复古暖米色 #FAF7F0）
├── not-found.tsx                  # 404 错误页：友好的田园手绘风缺省页，带“返回首页”按钮
├── error.tsx                      # 页面级错误边界：捕获子组件运行时异常，提供友好重试机制
├── global-error.tsx               # 全局致命错误兜底：根布局发生崩溃时的最外层应急保护页面
├── sitemap.ts                     # 动态站点地图：自动生成 /sitemap.xml，包含所有公开商品与政策页面供搜索引擎爬取
├── robots.ts                      # 爬虫协议配置：自动生成 /robots.txt，规范 Googlebot/Bingbot 抓取白名单并屏蔽结算路径
├── search-suggest.ts              # 搜索词联想配置：提供搜索框内置的热门搜索词推荐与实时拼写联想
├── robots.test.ts                 # 自动化单元测试：验证 robots.txt 抓取规则是否合规
├── palette.test.ts                # 自动化单元测试：验证全站主题调色板色彩对比度是否符合 WCAG AA 标准
│
├── llms.txt/                      # 🤖 AI 搜索引擎专用发现索引（新兴 Web 标准）
│   └── route.ts                   # 动态输出 /llms.txt（Markdown 纯文本），供 ChatGPT Search、Perplexity、Claude 直接引用
│
├── manifest.webmanifest/          # PWA 渐进式网页应用配置
│   └── route.ts                   # 动态输出 /manifest.webmanifest（应用名、图标、主题色）
│
├── favicon.ico/                   # 动态站点图标
│   └── route.ts                   # 浏览器标签页 Favicon 图标路由
│
├── about/                         # 品牌文化与抗争叙事
│   └── page.tsx                   # 品牌故事页：讲述弗吉尼亚汉诺威农田抵抗超算数据中心、保护优质黑土地的故事
│
├── account/                       # 客户自助服务门户
│   └── page.tsx                   # 个人中心页：顾客通过下单邮箱一键检索历史订单、USPS 物流时效与周边保养指南
│
├── cart/                          # 购物车模块
│   ├── actions.ts                 # 服务端 Server Actions：购物车增删改查异步逻辑
│   ├── cart-context.tsx           # React Context 状态上下文：全站共享的购物车实时状态机与会话监听
│   ├── cart-sidebar.tsx           # 核心侧边抽屉：滑出式购物车、满 $50 全美免邮动态进度条、结账直达入口
│   ├── cart-item.tsx              # 购物车单品行组件：单品缩略图、尺码/款式显示、增减步进器与移除按钮
│   ├── cart-math.ts               # 金融级精度计算：处理美元美分 BigInt 计算、小计与运费差额
│   ├── cart-math.test.ts          # 购物车金额计算单元测试
│   ├── discount-code.ts           # 优惠券与折扣码核销校验逻辑
│   ├── discount-code.test.ts      # 优惠券验证单元测试
│   └── discount-code-field.tsx    # 优惠码输入交互组件
│
├── checkout/                      # 单页结账漏斗
│   └── page.tsx                   # 核心结账页：联系人信息、全美收货地址校验、支付方式展示与订单直接提交落库
│
├── order/                         # 订单履约链路
│   └── success/
│       └── [id]/
│           ├── page.tsx           # 下单成功感谢页 (Thank You Page)：展示订单号（TR-XXXXXX）、购买摘要与查单入口
│           └── error.tsx          # 订单信息加载异常容错页
│
├── product/                       # 商品详情核心主链路 (PDP)
│   └── [slug]/
│       ├── page.tsx               # 商品详情主页：商品标题、价格、品类工艺卖点、真实买家评价区
│       ├── add-to-cart-button.tsx # 变体选择与加购交互区：SKU 编号展示、尺码/款式联动加购按钮（无虚假营销干扰）
│       ├── media-gallery.tsx      # 多图画廊组件：Printify 生成的高清模型图切换与放大预览
│       ├── variant-selector.tsx   # 变体款式选择器：尺码（S/M/L/XL/2XL）与颜色选项切换器
│       ├── variant-order.ts       # 变体智能排序规则：确保尺码与颜色按规范标准顺序排列
│       ├── variant-order.test.ts  # 变体排序单元测试
│       ├── use-selected-variant.ts# 选中变体状态 Hook：根据用户选中的 Option 实时计算当前的选中 SKU
│       ├── product-features.tsx   # 工艺与材质说明：全宽自适应呈现纯棉染色、防晒 UV 油墨、防水等特性
│       ├── product-reviews.tsx    # 顾客真实评价区：星级评分列表与评价汇总
│       ├── review-form.tsx        # 买家评价提交表单
│       ├── review-action.ts       # 评价提交 Server Action
│       ├── quantity-selector.tsx  # 购买数量步进选择器（1 ~ 99）
│       ├── volume-pricing.tsx     # 批发/多买阶梯优惠明细展示
│       ├── bundle-builder.tsx     # 组合套装配置器（供套餐类商品使用）
│       ├── subscription-options.tsx# 周期订阅选项组件（预留能力）
│       ├── restock-notify.tsx     # 到货通知订阅组件（预留能力）
│       ├── restock-action.ts      # 到货通知订阅 Server Action
│       ├── trust-badges.tsx       # 信任背书徽章：30 天无忧保障、100% 环保无塑包装、美国本土发货
│       ├── not-found.tsx          # 对应单品不存在时的专属 404 页面
│       ├── error.tsx              # 商品详情页错误边界
│       ├── opengraph-image.tsx    # 社交媒体分享卡片自动生成器（生成带单品价格与图文的 Twitter/OG 图片）
│       ├── Geist-Regular.ttf      # 动态 OG 卡片专用嵌入字体文件
│       └── review/
│           └── page.tsx           # 单独的评价专页路由
│
├── products/                      # 全量商品目录浏览器 (PLP)
│   ├── page.tsx                   # 全部商品列表主页：支持网格平铺展示全店周边
│   ├── products-view.tsx          # 商品列表与筛选容器视图
│   └── products-sort-select.tsx   # 排序下拉选择器：按价格升降序、热销推荐度、最新上架排序
│
├── category/                      # 品类聚合路由
│   └── [...slugs]/
│       ├── page.tsx               # 品类专属主页：如 /category/apparel (服饰)、/category/stickers (贴纸)
│       ├── category-view.tsx      # 分类商品平铺网格视图
│       └── error.tsx              # 分类数据异常容错页
│
├── search/                        # 全站搜索结果
│   ├── page.tsx                   # 搜索主页：关键词检索匹配呈现
│   ├── search-controls.tsx        # 搜索结果过滤栏
│   ├── search-pagination.tsx      # 搜索分页器
│   └── sort.ts                    # 搜索排序权重算法
│
├── track-order/                   # 逆向物流实时查询
│   └── page.tsx                   # 查件主页：输入订单号（如 TR-678413）与邮箱，调取实时 USPS 配送状态与单号
│
├── returns/                       # 30 天无忧售后申请中心
│   └── page.tsx                   # 售后工单门户：支持买家在线提交换码、运输破损补发申请，直写入库
│
├── contact/                       # 官方联系我们
│   ├── page.tsx                   # 联系客服页：官方表单与 Outlook 支持邮箱展示
│   ├── contact-form.tsx           # 客服留言表单交互组件
│   ├── action.ts                  # 客服留言提交 Server Action
│   └── action.test.ts             # 联系表单单元测试
│
├── faq/                           # 常见问题与解答
│   ├── page.tsx                   # FAQ 主页：手风琴式折叠面板，涵盖免运费、服饰洗涤、标牌安装等指引
│   └── faq-data.ts                # FAQ 结构化数据源文件
│
├── support/                       # 客户支持大厅
│   └── page.tsx                   # 服务导航总览页：聚合退换保障、物流查询、常见问答与联系方式
│
├── privacy-policy/                # 隐私政策 (合规必查)
│   └── page.tsx                   # 满足 GDPR / CCPA 规范的欧美买家隐私与 Cookie 声明
│
├── terms-of-service/              # 服务条款 (合规必查)
│   └── page.tsx                   # 独立站交易契约、免责条款与知识产权声明
│
├── shipping-policy/               # 物流政策 (合规必查)
│   └── page.tsx                   # 明确满 $50 全美免邮条款、USPS Ground 3-7 工作日交付时效说明
│
├── refund-policy/                 # 退款退货政策 (合规必查)
│   └── page.tsx                   # 官方 30-Day Defend the Soil Guarantee 满意度保障政策
│
├── legal/                         # 综合法律条款动态路由
│   └── [slug]/
│       └── page.tsx               # Markdown 法律文本渲染底层回退路由
│
└── api/                           # 🌐 后端服务端接口路由 (Server Route Handlers)
    ├── README.md                  # API 模块详细接口文档
    ├── cart/
    │   └── route.ts               # GET/POST/DELETE：购物车数据实时双向同步（读写会话状态）
    ├── checkout/
    │   └── create-order/
    │       └── route.ts           # POST：生成 TR-XXXXXX 订单号，将订单安全落入 Supabase 数据库
    ├── orders/
    │   └── track/
    │       └── route.ts           # POST：物流追踪接口，查询订单配送状态与 USPS 物流单号
    ├── returns/
    │   └── submit/
    │       └── route.ts           # POST：售后工单提交接口，接收退换诉求并派发 RMA 处理单
    └── auth/
        └── [...all]/
            └── route.ts           # ANY：用户身份与鉴权会话处理预留端点
```

---

## 2. 核心专项说明：什么是 `/llms.txt`？

- **定位**：`/llms.txt` 是现代 AI 时代的专用 SEO 索引（Generative Engine Optimization, GEO），由 AI 开发者社区创立并被 **Perplexity、ChatGPT Search、Google Gemini、Claude** 等新型 AI 搜索引擎原生支持。
- **作用**：传统 HTML 页面充满标签、样式与脚本，AI 解析耗时费力且容易出现幻觉。`/llms.txt` 将本店铺的**品牌抗争故事、在售核心商品（含价格与直达链接）、USPS 免邮政策与官方客服邮箱**转换为 Token 友好的纯 Markdown。
- **效果**：当海外潜在买家在 ChatGPT 中询问在哪里购买“Grow Tomatoes Not Data Centers”周边时，AI 大模型能极速读取该索引，准确为独立站带货并附带精准购买链接。
