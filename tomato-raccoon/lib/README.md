# `lib/` 目录说明文档

本目录存放独立站的核心**底层库、数据库连接、电商业务逻辑及工具函数**。

---

## 核心业务与数据库模块

| 文件名 | 核心功能与职责说明 |
| :--- | :--- |
| **`db.ts`** | **PostgreSQL 数据库引擎与自动迁移**：配置 `pg` 连接池连接远端 PostgreSQL，并封装 `initDatabase()` 自动创建 `products`, `orders`, `return_tickets`, `cart_sessions` 等核心业务表与索引。 |
| **`mock-data.ts`** | **5 大 AI 娘商品矩阵与角色台词配置**：内含 DeepSeek 娘 (Whale-Chan)、Claude 娘 (Sonnet-Tan)、ChatGPT 娘 (Omni-Chan)、Gemini 娘 (TwinStar-Chan)、Grok 娘 (Rebel-Tan) 的全套商品、SKU 矩阵、极客规格说明、傲娇语音台词与真实感评测数据。 |
| **`commerce.ts`** | **本地电商数据适配器**：替代原本对外部闭源云服务 (`yns.store`) 的依赖，实现 `findProducts`、`findProductBySlug`、`findCategories` 等方法，提供完全自主可控的商品查询和库存接口。 |
| **`cart.ts`** | **购物车核心状态逻辑**：管理购物车内的商品项、规格校验、增删改数量、自动计算小计与运费规则。 |
| **`money.ts`** | **货币格式化与汇率工具**：将以“分 (cents)”为单位存储的金额格式化为 `$19.99`、`¥149.00` 等展示格式，支持国际多币种标准。 |
| **`pricing.ts`** | **阶梯折扣与促销算法**：计算全家桶打包折扣（如“满 2 件减 10%”、“5 位全员立牌打包特惠”）与优惠券规则。 |
| **`store-config.ts`** | **商店全局配置中心**：读取环境变量、站点名称、默认币种、支付通道开关等基本参数。 |
| **`utils.ts`** | **通用工具库（含 `cn` 类名合并函数）**：使用 `clsx` 和 `tailwind-merge` 实现 Tailwind 类名的安全合并，防止类名样式冲突。 |

---

## 导航、路由与 SEO 工具

| 文件名 | 核心功能与职责说明 |
| :--- | :--- |
| `catalog-paths.ts` | **标准路由路径生成器**：根据商品 Slug 或分类标识生成规范的绝对与相对 URL。 |
| `listing-routes.ts` | **列表筛选与分页路由转换**：将 URL 参数（如 `?sort=price-asc&character=deepseek`）转换为可执行的过滤对象。 |
| `url-query.ts` | **URL 参数安全构造工具**：更新或移除浏览器 URL 中的查询参数而不丢失其余上下文。 |
| `json-ld.tsx` | **Google 结构化数据 (Schema.org) 生成**：生成符合搜索爬虫标准的 Product / Offer JSON-LD，提高在 Google Shopping 的收录展示效果。 |
| `blur-placeholder.ts` | **渐进式图片模糊占位符**：生成低分辨率模糊图，避免图片加载时页面闪烁与布局跳动 (CLS)。 |
| `constants.ts` | **业务常量定义**：支持的国际币种、商品展示分页数上限等常量。 |
| `dates.ts` | **国际送达时效计算**：根据用户所在国家计算预计物流妥投日期（如 "Estimated delivery: Nov 15 - Nov 20"）。 |
| `facets.ts` | **商品聚合属性计算**：统计每个角色、每个分类下当前上架的有效商品数量。 |
| `markdown.ts` | **安全 Markdown 转换器**：把商品描述或公告里的 Markdown 语法转为安全展示的 HTML。 |
| `track.tsx` | **埋点与转化事件追踪**：提供标准化的事件触发钩子（ViewContent, AddToCart, InitiateCheckout 等）。 |
| `cookies.ts` | **Cookie 客户端读写封装**：轻量操作用户端偏好设置（如当前货币、会话 ID）。 |
| `contrast.ts` | **色彩可读性计算**：WCAG 色彩对比度算法，确保文字与背景对比清晰，符合欧美无障碍合规标准。 |
| `invariant.ts` | **运行时断言异常工具**：在参数非法或数据缺失时抛出具名的友好异常信息。 |
| `store-tools.ts` / `vts.ts` / `yns-media.tsx` | **辅助工具集合**：提供媒体图床路径解析、虚拟状态安全转换等补充方法。 |

---

## 单元测试文件 (`*.test.ts`)
* `commerce.test.ts`：验证商品与分类查询逻辑。
* `money.test.ts`：验证美分换算、多币种显示精度。
* `pricing.test.ts`：验证满折优惠与价格计算精度。
* `contrast.test.ts`：验证颜色明暗对比度算法。
* `cookies.test.ts`：验证 Cookie 编码与存储生命周期。
* `json-ld.test.tsx`：验证生成的 SEO 结构化数据符合规范。
* `markdown.test.ts`：验证 Markdown 解析器标签白名单。
* `vts.test.ts`：验证状态虚拟化逻辑。
