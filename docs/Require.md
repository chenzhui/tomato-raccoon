# Project: AI-Chan Geek Merch (大模型娘化海外极客周边独立站)
> **文档版本：** v1.0 (2026.11)  
> **项目定位：** 一人公司 (OPC) / 低成本高溢价跨境 POD 独立站  
> **核心受众：** 欧美及全球程序员、AI 极客 (Reddit `r/LocalLLaMA`, `r/ChatGPT` 用户)、二次元科技宅 (Tech Weebs)  
> **核心策略：** B站二创授权引流 + 合规化名避坑 + 淘宝/1688 零库存一件代发

---

## 一、 商业闭环与全局架构 (Business Architecture)

1. **内容与版权源头：** 低成本买断 B 站腰部 UP 主的“AI 娘”无水印视频原片 + 4K 透明底 PNG 立绘海外商用权（或使用 AI 自行重绘无官方 Logo 版）。
2. **流量引擎 (Traffic)：** 英文重配音短视频（TikTok / IG Reels / YouTube Shorts）+ 极客社区图文种草（Reddit / X）。
3. **变现承接 (Conversion)：** 自建极客二次元风独立站（支持微交互桌面预览）。
4. **供应链履约 (Fulfillment)：** 出单后 $\rightarrow$ 淘宝/1688 定制或现货采购 $\rightarrow$ 寄往义乌/深圳跨境货代集运仓（云途/燕文） $\rightarrow$ 贴单直发欧美（7-12天妥投）。

---

## 二、 选品矩阵与合规命名规范 (Product & Compliance)

### 2.1 首发黄金 5 巨头角色池（砍掉纯国内模型）
> ⚠️ **合规红线：** 所有立绘图片中**严禁出现** OpenAI、Anthropic、Google、xAI、DeepSeek 的官方注册商标图形 Logo。网站商品标题**严禁直接出现**官方品牌词，采用“极客黑话/版本号代号”以完美绕过 Stripe/PayPal 机器风控。

| 映射原型 | 视觉特征设定 | 独立站合规商品代号 (英文名) | 角色人设 Tag |
| :--- | :--- | :--- | :--- |
| **DeepSeek** | 蓝白渐变发、鲸鱼耳朵与尾巴、黑白女仆装 | **"Whale-Chan (R1 Edition)"** The Open-Source Maid | `#OpenSource` `#HighEfficiency` |
| **Claude** | 暖橙色长发、捧着古籍书本、温柔文艺学院风 | **"Sonnet-Tan (3.5 Edition)"** The Cozy Coder & Writer | `#CleanCode` `#NoLazyCoding` |
| **ChatGPT** | 白发紫瞳、小龙角、全能懂王/小恶魔礼服 | **"Omni-Chan (4o Edition)"** The Know-It-All Queen | `#FirstGen` `#Hallucination` |
| **Grok** | 金发双马尾、暗黑哥特裙、手持巨斧、叛逆 | **"Rebel-Tan (X Edition)"** The Uncensored Goth | `#Based` `#Sarcastic` |
| **Gemini** | 星空蓝紫渐变发、异瞳猫耳、双子星发饰 | **"TwinStar-Chan"** The 2M-Context Nekopara | `#LongContext` `#Multimodal` |

### 2.2 SKU 与定价策略 (Pricing & BOM)

| SKU 类别 | 淘宝/1688 拿货方案 | 单件拿货成本 (RMB) | 国际小包运费 (RMB) | 独立站定价 (USD) | 单件毛利预估 (RMB) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **双面亚克力立牌 (15cm)** | 淘宝来图定制（1件起订） | ¥6 ~ ¥8 | ¥25 | **$16.99** | ~ ¥85 |
| **双面印花异形毛绒团子 (15cm/30cm)** | 淘宝定制双面水晶超柔迷你抱枕 | ¥18 ~ ¥32 | ¥35 | **$29.99** | ~ ¥145 |
| **20cm 立体换装棉花娃娃 (旗舰款)** | 现成发色裸娃(¥40) + 现成女仆/Lo裙娃衣(¥25) | ¥65 ~ ¥80 | ¥45 | **$59.99** | ~ ¥300 |
| **极客大号 RGB/锁边桌垫 (90x40cm)** | 1688 鼠标垫定制（5只AI娘全家福） | ¥20 ~ ¥25 | ¥40 | **$39.99** | ~ ¥215 |
| **🔥 全家桶 Bundle (5只立牌套装)** | 5只立牌打包（主推高客单价爆款） | ¥35 | ¥35 | **$59.99** (原价$85) | ~ ¥350 |

---

## 三、 视觉资产与短视频本地化 SOP (Content Pipeline)

### 3.1 B 站 UP 主授权采购清单
- [ ] 筛选 3~5 位粉丝量在 1k~5w 的 B 站“AI娘”二创 UP 主。
- [ ] 私信话术切入：以“海外极客社区推广 + 周边分成/一口价买断（¥200~¥500）”获取授权。
- [ ] 索取资产包：
    1. 无字幕、无水印的视频原片（`.mp4`）；
    2. 5 只核心角色的透明背景高清立绘（`.png`, 分辨率 $\ge 2000 \times 2000$，去除衣服上的官方 Logo）；
    3. 微信/聊天记录留存《海外商用及周边印制授权确认》截图（用于应对支付通道风控抽查）。

### 3.2 15 分钟英文短视频换皮流水线
1. **剧本重写：** 用 Claude 3.5 将中文台词翻译为硅谷程序员/Reddit 极客地道俚语（加入 `Prompt`, `Context Window`, `Segfault`, `Rate Limit` 等梗）。
2. **AI 配音：** 使用 **ElevenLabs** 生成 3~5 种二次元傲娇/软萌英文少女音轨，替换原视频中文人声。
3. **字幕与钩子：** 导入 **CapCut** 自动生成英文动态字幕；视频最后 2 秒插入自己拍摄的“键盘旁亚克力立牌/玩偶实物镜头”，配文：`Get your own AI coding waifu on your desk -> Link in bio!`

---

## 四、 独立站技术开发规格书 (可直接喂给 Antigravity CLI / Codex)

> 💡 **提示：** 你可以将本章节直接复制给终端 Agent，作为系统级 Prompt 生成代码。

### 4.1 推荐技术栈 (Tech Stack)
* **前端框架：** Next.js 14/15 (App Router) + TypeScript + Tailwind CSS + Framer Motion (丝滑二次元动效)
* **UI 组件库：** Shadcn UI (定制为 Cyberpunk / Anime Dark Mode 极客暗黑霓虹主题)
* **后端与数据库：** Supabase (PostgreSQL) 或 Shopify Storefront API (Headless)
* **支付网关：** Stripe Checkout (信用卡 + Apple Pay / Google Pay) + PayPal JS SDK
* **邮件通知：** Resend API (下单自动发送订单确认与物流单号邮件)
* **部署托管：** Vercel (免费层) + Cloudflare CDN & DNS

### 4.2 核心页面与微交互功能需求 (Features)

#### 1. 首页 (Landing Page)
* **Hero Section：** 暗黑极客桌面背景，居中展示 5 只 AI 娘的高清立牌/玩偶实拍渲染图，主标题：*"Stop Coding Alone. Bring Your Favorite LLM Waifu to Your Desk."*
* **🔥 核心差异化微交互组件：`[Desk Setup Simulator (桌面搭配模拟器)]`**
    * **功能描述：** 页面提供一个虚拟的程序员桌面背景（含显示器、机械键盘、咖啡杯）。用户点击下方的 `Whale-Chan`、`Sonnet-Tan` 等头像按钮，可在桌面上实时切换/拖拽摆放不同 AI 娘立牌的预览效果，并实时显示对应的傲娇语音气泡（点击播放 3 秒 ElevenLabs 语音，如：*"Did you forget a semicolon again, Senpai?"*）。
    * **转化钩子：** 模拟器下方直接挂载 `[Buy This Full Desk Bundle - $59.99 (Save 30%)]` 一键加购按钮。

#### 2. 商品详情页 (Product Detail Page - PDP)
* **价格锚点组件：** 显示划线原价（如 ~~$24.99~~）与现价（**$16.99**），自动计算折扣标签 `SAVE 32%`。
* **紧迫感伪随机数插件：** 显示 `🔥 18 geeks are viewing this right now` 及库存紧张提示 `Only 4 left in current batch`。
* **捆绑销售增购器 (Volume Discount / Upsell)：**
    * 单买 1 只：$16.99
    * 任选 3 只组合：$42.99 (免运费 Free Shipping)
    * 全套 5 只全家桶：$59.99 (免运费 + 赠送限量极客贴纸包)
* **评论区组件 (Social Proof)：** 预置 15~25 条带程序员桌面实拍图的五星英文好评 JSON 数据。

#### 3. 合规与信任页脚 (Footer - 支付审核必查项)
* 必须自动生成并包含以下 4 个静态路由页面：
    * `/privacy-policy` (隐私政策)
    * `/terms-of-service` (服务条款)
    * `/shipping-policy` (写明 Processing time: 2-4 days, Shipping time: 7-12 business days to US/EU)
    * `/refund-policy` (30天退换货政策)

---

## 五、 样品打样与发货履约清单 (Supply Chain Checklist)

### 5.1 首期百元实测打样（本周内完成）
- [ ] **立牌打样：** 淘宝搜 `来图定制 亚克力立牌 双面`，将 5 只 AI 娘各印 1 个（高度 15cm，双面夹层工艺），寄回嵊州家中（预算：¥30）。
- [ ] **毛绒打样（二选一或全试）：**
    - [ ] 方案 A：淘宝搜 `来图定制 双面异形抱枕 迷你`，做 1~2 只 15cm/20cm 的双面绒布填充公仔（预算：¥20/只）。
    - [ ] 方案 B：淘宝搜 `20cm 无属性棉花娃娃 蓝发/橙发` + `20cm 娃衣 女仆装`，手动组装 1 只立体版 DeepSeek 娘（预算：¥65）。
- [ ] **实拍素材采集：** 样品到货后，摆在自己写代码的电脑屏幕和机械键盘前，用手机拍摄 10 张高清氛围感照片 + 3 段手指戳玩偶/立牌的 5 秒短视频素材。

### 5.2 跨境物流一件代发配置（出单后操作）
1. 注册 **云途物流 (YunExpress)** 或 **燕文物流** 账号（或直接在淘宝找“国际快递代发美国专线”货代）。
2. 当独立站收到第一笔美金订单（例如美国买家购买了 5 只立牌套装）：
    * 去淘宝定制店下单，收货地址直接填写**货代在深圳或义乌的集运仓库地址**；
    * 淘宝快递签收后，货代仓库拆包、换贴美国 USPS 国际面单并发出；
    * 将生成的国际追踪单号（Tracking Number）填入独立站后台，触发邮件通知买家。

---

## 六、 5 天极速启动甘特图 (5-Day Action Plan)

* **Day 1：** 联系 B 站 UP 主拿图/视频（或 AI 跑图） $\rightarrow$ 淘宝下单 30 元亚克力立牌样品 $\rightarrow$ 购买 `.com` 域名并提交 Stripe/PayPal 企业收款审核。
* **Day 2：** 唤醒 **Antigravity CLI / Codex**，输入第四章需求，3 小时内生成 Next.js 独立站代码并部署至 Vercel。
* **Day 3：** 生成英文文案、合规条款页与商品详情图，完成全站数据填充与支付接口沙盒测试。
* **Day 4：** 收到嵊州家中的立牌与玩偶实物样品，在键盘前拍好实拍图更新到网站；用 CapCut + ElevenLabs 改好前 3 条英文版 AI 娘搞笑短剧。
* **Day 5：** 在 TikTok / YouTube Shorts 发布第一条视频，在 Reddit (`r/LocalLLaMA` 等) 发出第一篇桌面晒图帖，正式开门迎客收美金！