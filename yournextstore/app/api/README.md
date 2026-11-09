# `app/api/` 目录说明文档

本目录是 Next.js 的 **服务端 API 路由 (Route Handlers)**。
这些文件在 Node.js 服务端环境中执行，用于处理敏感逻辑、与 PostgreSQL 数据库交互、校验前端提交的数据。

---

## API 路由清单与功能说明

| 接口路由路径 | HTTP 方法 | 文件路径 | 业务功能说明 |
| :--- | :--- | :--- | :--- |
| `/api/checkout/create-order` | `POST` | `checkout/create-order/route.ts` | **创建订单接口**：接收前端结账表单数据（收货人姓名、邮箱、详细地址、选购商品清单、金额），校验后直接写入 PostgreSQL 的 `orders` 表，并返回唯一订单号（如 `ORD-xxx`）。 |
| `/api/orders/track` | `POST` | `orders/track/route.ts` | **订单状态追踪接口**：供用户在 `/track-order` 页面查询。根据前端传入的订单号（`orderId`）或下单邮箱（`email`），在 PostgreSQL 数据库中检索订单物流阶段、物流单号、收货信息及商品项。 |
| `/api/returns/submit` | `POST` | `returns/submit/route.ts` | **售后/换货申请工单提交接口**：供用户在 `/returns` 页面提交售后申请。接收订单号、换货原因、详细说明及破损照片证据，将工单存入数据库 `return_tickets` 表。 |
| `/api/cart/add-bundle` | `POST` | `cart/add-bundle/route.ts` | **桌面模拟器批量加购接口**：供首页“桌面搭配模拟器”一键把当前舞台上激活的多个 AI 娘立牌组合成套餐一键塞进购物车。 |
| `/api/cart` | `GET` / `POST` | `cart/route.ts` | **购物车状态管理接口**：支持与服务端会话数据库 `cart_sessions` 同步用户的临时加购数据。 |
| `/api/auth/[...all]` | `ALL` | `auth/[...all]/route.ts` | **鉴权认证通用代理**：用户登录/注册系统的通配端点（支持第三方 OAuth 或账密预留）。 |
