# `components/` 目录说明文档

本目录存放独立站的核心**业务 UI 组件**（即多个页面复用的积木块）。
底层的无业务逻辑基础控件存放于子目录 `components/ui/`（详见 `components/ui/README.md`）。

---

## 业务组件清单与功能说明

| 组件文件名 | 核心功能与业务场景 |
| :--- | :--- |
| **`desk-simulator.tsx`** | **【核心卖点】极客桌面搭配模拟器**：支持用户在虚拟工位画布上自由拖拽、摆放 5 位 AI 娘（DeepSeek、Claude、ChatGPT、Gemini、Grok）的透明立牌，点击触发傲娇角色台词气泡与 Web Audio 8-bit 极客音效，并提供“全员打包立省”一键加购功能。 |
| **`urgency-badge.tsx`** | **【转化神器】即时紧迫感与阶梯折扣组件**：挂载在商品详情页（PDP），展示当前实时浏览人数波动（模拟真实热度）、多件梯度优惠（买 2 件立减、买 5 件全家桶折扣），刺激用户加购。 |
| **`product-card.tsx`** | **商品卡片展示组件**：用于首页和列表页的商品展示。集成立绘悬浮缩放动效、角色专属 Badge 标签、多币种折算价格及快速加购按钮。 |
| **`quick-add-button.tsx`** | **快速加购按钮**：在商品卡片上无需进入详情页即可快速加入购物车，自带加入成功的反馈微动画。 |
| **`listing-products.tsx`** | **商品栅格列表流**：响应式商品排列网格，负责批量渲染 `product-card` 并处理骨架屏加载状态。 |
| **`listing-pagination.tsx`** | **商品列表分页控制器**：处理海量商品的分页跳转与 URL 状态同步。 |
| **`payment-methods.tsx`** | **支持支付方式徽标栏**：展示 Visa、Mastercard、PayPal、Apple Pay、Google Pay 等国际主流支付通道图标，增强海外买家信任感。 |
| **`theme-toggle.tsx`** | **深色/浅色主题切换开关**：支持暗夜极客模式与明亮模式无缝切换。 |
| **`cookie-consent-banner.tsx`** | **Cookie 合规授权横幅**：符合欧美 GDPR/CCPA 隐私规范的 Cookie 提示条。 |
| **`cookie-consent.tsx`** | **Cookie 授权状态管理器**：记录与读取用户是否接受 Cookie，避免重复弹窗。 |
| **`newsletter-dialog.tsx`** | **邮件订阅优惠弹窗**：弹出首单 9 折订阅入口，沉淀独立站 EDM 邮件私域流量池。 |
| **`newsletter-consent.tsx`** | **订阅复选框组件**：在结账等表单中提示用户是否勾选接收新品更新。 |
| **`legal-doc.tsx`** | **法律文书排版容器**：为隐私协议、服务条款等法律页面提供统一、合规且高可读性的样式排版。 |
| **`tiptap-renderer.tsx`** | **富文本渲染器**：安全渲染富文本内容（过滤危险 XSS 标签）。 |
| **`blog-product-embed.tsx`** | **博客商品内嵌组件**：在技术博客/周边评测文章正文中直接插入可点击加购的商品小卡片。 |
| **`store-config-provider.tsx`** | **商店全局状态上下文 Provider**：向下透传货币单位、汇率、商店基础元数据。 |
| **`intent-link.tsx`** | **意图预加载链接**：鼠标悬停在超链接上时提前预加载目标页资源，实现瞬间切页效果。 |
| **`referral-badge.tsx`** | **推荐裂变小徽章**：提示“邀请极客好友各得 $5 优惠券”的推广组件。 |
| **`route-error.tsx`** | **子路由异常呈现**：局部页面报错时的优雅降级提示。 |
| **`search-params-probe.tsx`** | **URL 查询参数监听探针**：辅助分析并监听当前页面路由参数变化。 |
| **`devtools.tsx`** | **开发环境辅助组件**：仅在本地开发环境中挂载的调试工具。 |
