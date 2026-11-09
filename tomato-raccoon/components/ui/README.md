# `components/ui/` 目录说明文档

本目录是基于 **[shadcn/ui](https://ui.shadcn.com/)** 和 **Radix UI Primitive** 构建的基础原子 UI 组件库。
其设计哲学是**“把组件源代码放在你的工程中，完全受你掌控，无黑盒依赖”**。配合 Tailwind CSS，你可以根据极客二次元风格随时调整边框、圆角、阴影或配色。

---

## 原子组件清单与用途

| 组件文件名 | 控件类型 | 常见应用场景 |
| :--- | :--- | :--- |
| `button.tsx` | 按钮 (Button) | 全局基础按钮，支持 `default`, `outline`, `secondary`, `ghost`, `destructive` 等多种视觉风格与加载动画。 |
| `badge.tsx` | 徽章 (Badge) | 显示 AI 娘专属阵营标牌、商品促销标签（如 `Hot`、`New`、`Pre-Order`）。 |
| `sheet.tsx` | 侧滑抽屉 (Sheet) | 购物车侧边滑出栏、移动端汉堡导航菜单滑出抽屉。 |
| `dialog.tsx` | 模态对话框 (Dialog) | 优惠券弹窗、退换货照片放大预览、重要操作二次确认弹窗。 |
| `input.tsx` | 文本输入框 (Input) | 结账收货地址表单、物流单号查询框、邮箱订阅输入框。 |
| `label.tsx` | 表单标签 (Label) | 与 `input.tsx` 配套的语义化标题标签，自带无障碍（a11y）绑定。 |
| `select.tsx` | 下拉选择器 (Select) | 结账页国家/地区选择、商品规格/款式下拉选择。 |
| `checkbox.tsx` | 复选框 (Checkbox) | 结账同意服务条款勾选、记住收货地址勾选。 |
| `accordion.tsx` | 手风琴折叠面板 (Accordion) | `/faq` 常见问题页的点击展开与收起、商品详情页的规格参数抽屉。 |
| `sonner.tsx` | 浮动轻提示 (Toast) | 右上角弹出提示通知（如“已加入购物车”、“工单已成功提交”）。 |
| `slider.tsx` | 滑动输入条 (Slider) | 桌面模拟器中的立牌缩放滑块、商品列表价格区间滑块。 |
| `skeleton.tsx` | 骨架屏 (Skeleton) | 页面数据加载中的灰色渐变占位动画，提升用户感知加载速度。 |
| `dropdown-menu.tsx` | 下拉菜单 (Dropdown Menu) | 顶部栏多币种切换（USD / EUR / JPY / CNY）、更多操作菜单。 |
| `popover.tsx` | 气泡悬浮框 (Popover) | 点击某个按钮后在正下方弹出的轻量浮层。 |
| `tooltip.tsx` | 悬停提示文字 (Tooltip) | 鼠标悬浮在图标（如购物车、收藏）上方时出现的解释性微小气泡。 |
| `scroll-area.tsx` | 美化滚动区域 (Scroll Area) | 支持跨浏览器一致、平滑且可换肤的定制滚动条容器。 |
| `breadcrumb.tsx` | 面包屑导航 (Breadcrumb) | 页面层级引导条（如 `首页 > 桌垫系列 > Whale-Chan 超大抗静电桌垫`）。 |
| `pagination.tsx` | 分页基础组件 (Pagination) | 列表页底部的上一页、页码按钮、下一页布局结构。 |
