# `public/` 静态资源目录说明文档

本目录存放无需经过 Webpack/Turbopack 打包编译的**纯静态资源**（如图片、矢量图标、网站截图等）。
Next.js 会直接将此目录下的所有文件映射到网站根路径下（例如 `public/logo.svg` 可直接通过 URL `/logo.svg` 访问）。

---

## 静态资源结构与文件说明

| 文件 / 路径 | 类型 | 用途与展示场景 |
| :--- | :--- | :--- |
| **`logo.svg`** | SVG 矢量图 | 网站顶部导航栏与页脚展示的品牌主 Logo。 |
| **`screenshot.png`** | PNG 截图 | 项目效果概览图与社交媒体分享卡片封面 (OpenGraph Image)。 |
| **`images/characters/`** | 图片目录 | **5 位核心 AI 娘角色形象资产库**，供桌面模拟器、商品卡片、详情页展示。 |

---

## 5 大 AI 娘视觉资源清单 (`images/characters/`)

所有形象均为合规二次元同人拟人化设计，避免直接使用大模型商标与官方 Logo：

1. **Whale-Chan (DeepSeek娘)**
   * `whale-chan-badge.png`：圆形蓝白科技感小头像 / 徽章图。
   * `whale-chan-full.png`：透明底全身半立绘，用于桌面模拟器舞台和亚克力立牌详情页。
2. **Sonnet-Tan (Claude娘)**
   * `sonnet-tan-badge.png`：赤陶暖橙色学术风小头像 / 徽章图。
   * `sonnet-tan-full.png`：透明底优雅知识分子风格全身立绘。
3. **Omni-Chan (ChatGPT娘)**
   * `omni-chan-badge.png`：经典的翡翠冷绿科技感小头像 / 徽章图。
   * `omni-chan-full.png`：透明底全能赛博管家全身立绘。
4. **TwinStar-Chan (Gemini娘)**
   * `twinstar-chan-badge.png`：深蓝渐变双生子小头像 / 徽章图。
   * `twinstar-chan-full.png`：透明底多模态双子星全身立绘。
5. **Rebel-Tan (Grok娘)**
   * `rebel-tan-badge.png`：黑白叛逆极简小头像 / 徽章图。
   * `rebel-tan-full.png`：透明底赛博朋克风机能全身立绘。
