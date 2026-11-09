// 沙箱检查器（仅限开发环境，基于 NODE_ENV 自行控制）。Next.js 会在构建时内联
// NEXT_PUBLIC_*，因此生产构建会对该分支进行死代码消除（DCE）。
if (process.env.NEXT_PUBLIC_VERCEL_ENV !== "production") {
	void import("commerce-kit/sandbox-inspectors");
}
// ─── 平台 Storefront kit（请勿修改） ────────────────────────────────
// 由平台针对每个店铺生成的分析/埋点运行时，并通过 /_public 代理提供服务
// （参见 proxy.ts）。未配置跟踪器的店铺将获取一个空操作脚本。切勿在模板代码中
// 添加跟踪器代码段（fbq、gtag 等）—— 应改用 lib/track.tsx 发布事件。
//
// 仅限生产环境：/design 沙箱预览和 Vercel 预览部署运行相同的代码，
// 构建器/预览流量绝不能污染商家的真实广告与分析数据。
if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
	const kit = document.createElement("script");
	kit.src = "/_public/kit.js";
	kit.async = true;
	document.head.appendChild(kit);
}
// 反馈工具栏 —— 在预览部署时从中央 CDN 运行时加载，
// 这样无需重新构建店铺即可发布工具栏修复。工具栏域名与预览域名
// 保持一致（yns.store / yns.cx），使其处于相同的可注册域下；
// 非 yns 主机则回退到 yns.cx。
if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
	const base = location.hostname.endsWith(".yns.store")
		? "https://toolbar.yns.store"
		: "https://toolbar.yns.cx";
	const s = document.createElement("script");
	s.src = base + "/toolbar.js";
	s.async = true;
	document.head.appendChild(s);
}
