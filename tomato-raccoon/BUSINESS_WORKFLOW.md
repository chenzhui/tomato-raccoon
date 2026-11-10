# 独立站跨境出海全链路商业与系统架构指南 (工业级标准)
> **项目**：Tomato Raccoon (番茄小浣熊 · 抗议数据中心主题周边)  
> **核心模式**：自研 Next.js 14 + Printify POD (按需印制) + Airwallex (空中云汇) 跨境收单  
> **版本**：v2.1 (序号体系与层次规范化重构版)  
> **更新时间**：2026-11-10

---

## 一、 工业级业务闭环全景流程图 (Business Architecture)

```mermaid
flowchart TD
    %% 样式定义
    classDef buyer fill:#f9f0ff,stroke:#d3adf7,stroke-width:2px;
    classDef web fill:#e6f7ff,stroke:#91d5ff,stroke-width:2px;
    classDef pay fill:#fff7e6,stroke:#ffd591,stroke-width:2px;
    classDef factory fill:#f6ffed,stroke:#b7eb8f,stroke-width:2px;
    classDef bank fill:#fcffe6,stroke:#eaff8f,stroke-width:2px;

    %% 模块 A: 客户触达与独立站前端
    subgraph S1 ["【模块 A】客户触达与建站 (Storefront)"]
        A["欧美抗议居民 / 极客群体<br/>(Reddit / Nextdoor / X 精准流量)"]:::buyer
        B["Next.js 独立站前端<br/>(托管于 Vercel 全球极速CDN)"]:::web
    end

    %% 模块 B: 结账与收单网关
    subgraph S2 ["【模块 B】收单网关与风控 (Checkout & Gateway)"]
        C["Airwallex 嵌入式收银台<br/>(Apple Pay / Google Pay / 信用卡)"]:::pay
    end

    %% 模块 C: 订单中枢与自动履约
    subgraph S3 ["【模块 C】订单中枢与生产履约 (Order & Fulfillment)"]
        D1["Next.js Webhook 接收端<br/>(/api/webhooks/airwallex)"]:::web
        DB[("Supabase / Postgres 数据库<br/>(订单持久化缓冲 & 状态机维护)")]:::web
        D2["Printify 抛单引擎<br/>(/api/cron 或 异步重试队列)"]:::web
        E["Printify 自动化系统<br/>(API 创单排产)"]:::factory
        F["美国本地印刷厂<br/>(Monster Digital / SwiftPOD)"]:::factory
        G["美国本土快递配送<br/>(USPS Ground Advantage 3~5天)"]:::factory
    end

    %% 模块 D: 资金循环与合规回国
    subgraph S4 ["【模块 D】资金循环与合规结汇 (Cashflow Loop)"]
        H1["前期: 国内全币种信用卡 (Amex/Visa)<br/>(初期快速垫付生产底成本)"]:::bank
        I["Airwallex 离岸美元商户账户<br/>(全额结算美金沉淀，扣除5~10%预留金)"]:::pay
        H2["进阶: Airwallex 美元虚拟卡<br/>(零汇损直接扣付生产成本)"]:::pay
        J["国内个人银行卡 (RMB账户)<br/>(个体户结汇免5万外汇额度限制)"]:::bank
    end

    %% --- 业务主链路时序 ---
    A -->|"Step 01. 访问挑选抗议周边"| B
    B -->|"Step 02. 发起结账 Checkout"| C
    A -->|"Step 03. 授权付款 (USD)"| C

    C -->|"Step 04. 支付成功 Webhook"| D1
    D1 -->|"Step 05. 写入订单持久化 (PAID)"| DB
    DB -->|"Step 06. 读取已支付订单并自动抛单"| D2
    D2 -->|"Step 07. 调用 REST API 创单排产"| E

    %% 垫资扣费链路
    H1 -.->|"初期自动垫付"| E
    H2 -.->|"中后期无汇损循环扣资"| E
    I -.->|"生成美金企业虚拟卡"| H2

    %% 生产与发货时序
    E -->|"Step 08. 智能分派本地印刷厂"| F
    F -->|"Step 09. 工业级 DTG 直喷印制并打包"| G
    G -->|"Step 10. 实物包裹妥投买家"| A

    %% --- 反向物流追踪闭环 ---
    E -->|"Step 11. 回传 USPS 运单号 Webhook"| D1
    D1 -->|"Step 12. 触发品牌发货邮件 (附实时跟踪链接)"| A

    %% --- 资金结算与结汇闭环 ---
    C -.->|"扣除手续费结算入账 (T+2/T+3)"| I
    I -->|"Step 13. 后台发起利润合规结汇到账"| J

    style J fill:#f6ffed,stroke:#52c41a,stroke-width:3px;
    style DB fill:#e6f7ff,stroke:#1890ff,stroke-width:2px;
```

---

## 二、 4 大关键优化与系统鲁棒性保障 (Robustness)

### 保障 1：逆向物流与发货追踪闭环 (Tracking Webhook)
* **痛点**：Printify 默认发出的邮件可能不具备你的品牌域名，买家体验割裂。
* **工业级实现**：
  * **步骤 ①**：Printify 在工厂生成 USPS 运单贴标后，主动向 Next.js 发送 `order:shipment:created` Webhook。
  * **步骤 ②**：Next.js 接收到运单号（如 `USPS 9400xxxx`）后，更新数据库订单状态为 `SHIPPED`。
  * **步骤 ③**：自动触发自研邮件服务（通过 **Resend / SendGrid**），给买家发送带有番茄小浣熊品牌 Header、退换货指南与专属追踪链接的正式发货通知。
  * **步骤 ④**：网站内置 `/track-order` 页面，买家输入邮箱或订单号即可实时呈现物流轨迹。

### 保障 2：系统持久化缓冲与状态机防崩 (State Machine)
* **痛点**：若在支付成功 Webhook 里直接裸调 Printify API，遇 Printify 临时 502、买家美国地址校验失败（如 Zipcode 与 City 不匹配）或底衫缺货，订单直接丢失。
* **工业级实现**：
  * **阶段 ① (PAID 持久化)**：Airwallex 扣款成功后，首先将完整 Payload 写入数据库（**Supabase / PostgreSQL / Neon**），打上 `PAID` 标记。哪怕后端此时断电崩溃，数据绝不丢失。
  * **阶段 ② (FULFILLING 异步抛单)**：由专门的异步执行器（Queue / Retry Worker）读取订单并向 Printify 抛单。
  * **阶段 ③ (FAILED_RETRY 异常重试)**：若 Printify 抛单失败，状态标记为 `FULFILLMENT_FAILED`，系统自动飞书/邮件告警并支持 3 次幂等自动重试，彻底杜绝拒付 (Chargeback)。

### 保障 3：Airwallex 美元虚拟卡 (Borderless Card) 零汇损垫资
* **痛点**：前期使用国内全币种信用卡（Amex/Visa）垫资，国内银行扣款通常存在 1%~3% 的境外货币转换费或汇率点差。
* **最优资金解法**：
  * **前期 (信用卡起步)**：利用国内信用卡提供的 30~50 天免息期快速垫资跑通流水。
  * **中后期 (虚拟卡闭环)**：当 Airwallex 账户积累了买家支付的美元后，在 Airwallex 后台一键生成一张 **美金企业虚拟卡 (Airwallex Borderless Card)** 并绑定在 Printify 支付方式上。
  * **零汇损循环**：直接用赚到的美元原币扣付 Printify 的美元成本，**无任何二次汇率磨损**，仅将纯利润部分在离岸账户一键结汇成人民币！

### 保障 4：滚动预留金 (Rolling Reserve) 现金流预算与风控
* **风控常识**：对于初创的个体户/新域名独立站，Airwallex 或任何正规国际收单网关通常会设置 **5%~10% 的滚动保证金（Rolling Reserve，通常质押 90~180 天）**，以防范恶意盗刷拒付风险。
* **财务预算**：初期利润核算与流动资金周转需预留 10% 缓冲垫，随着订单正常发货妥投、争议率低于 0.5%，保证金将按批次全额滚回可用余额。

---

## 三、 单件商品毛利测算表 (Unit Economics)

| 商品名称 | Printify 基础成本 (含运费估算) | 独立站建议零售价 (USD) | 支付手续费 (约 3.2%+$0.3) | 单件净利润 (USD) | 单件净利润 (折合 RMB) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Comfort Colors 1717 经典短袖** | ~$13.50 | **$32.00** | ~$1.32 | **+$17.18** | **~￥124** |
| **Gildan 18500 连帽卫衣** | ~$22.00 | **$48.00** | ~$1.84 | **+$24.16** | **~￥174** |
| **草坪标语牌 (Yard Sign 带支架)** | ~$12.00 | **$28.00** | ~$1.20 | **+$14.80** | **~￥107** |
| **车尾标贴 (Bumper Sticker)** | ~$4.50 | **$12.00** | ~$0.68 | **+$6.82** | **~￥49** |
| **高光模切贴纸 (Kiss-Cut Sticker)** | ~$3.20 | **$8.00** | ~$0.56 | **+$4.24** | **~￥31** |

---

## 四、 Airwallex 线上收单审核“四大必备合规页面”检查

在正式向 Airwallex 提交网站审核时，以下 4 个页面工程内已全部就位（可在 `tomato-raccoon/app/` 下查阅）：

* **[合规项 A] Shipping Policy (运输政策，`/shipping-policy`)**：明确标注由美国本土印刷厂生产、通过 USPS 配送、制作周期 2~3 个工作日、运输时效 3~5 个工作日。
* **[合规项 B] Refund & Return Policy (退换货政策，`/refund-policy`)**：POD 属于个性化定制商品，明确标明：“除印刷质量瑕疵或破损免费重印/退款外，尺码选错等个人原因原则上不支持退货”。
* **[合规项 C] Contact Us (联系我们，`/contact`)**：清晰公布官方客服邮箱（`growtomatoes.service@outlook.com`）与服务响应时效（24小时内答复）。
* **[合规项 D] Terms of Service & Privacy Policy (服务条款与隐私政策，`/terms-of-service` & `/privacy-policy`)**：完整的消费者权益、数据保护声明与合规免责条款。

---

## 五、 全流程执行清单 (Action Checklist)

### 阶段 1：已就绪技术基建 (Done)
- [x] **Printify API 连通**：已完成 Token 绑定与真实商品 ID 录入。
- [x] **垫资信用卡绑定**：已完成 Printify 支付方式绑定。
- [x] **个体工商户营业执照申报**：已完成嵊州政务网全流程线上申报。
- [x] **合规政策页面部署**：运输政策、退货条款、联系方式等 4 大合规页已完成工程内置。

### 阶段 2：上线与收单投产 (Pending)
- [ ] **域名选定与购买**：选定品牌域名（约 $10/年）。
- [ ] **Vercel 全球部署**：代码推送到 GitHub，绑定 Vercel 并解析域名。
- [ ] **执照 PDF 领证**：收到短信后在“电子营业执照”小程序下载高清副本。
- [ ] **Airwallex 线上收单开户**：提交执照 + 独立站域名开通跨境收银台。
- [ ] **数据库持久化连接**：接入 Supabase 写入订单状态机与重试任务。
- [ ] **生成美元虚拟卡**：从 Airwallex 生成企业卡绑定至 Printify 实现零汇损循环。
