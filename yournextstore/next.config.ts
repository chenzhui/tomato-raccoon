import type { NextConfig } from "next";
import { listingRewrites } from "./lib/listing-routes";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
	/* 在此处配置选项 */
	allowedDevOrigins: ["*.vercel.run", "*.yns.store", "*.yns.cx"],
	devIndicators: false,
	reactCompiler: true,
	cacheComponents: true,
	// 即时导航（16.3）：每个 <Link> 都会预取该路由共享的 App Shell。
	partialPrefetching: true,
	experimental: {
		// 在 Turbopack 中原生运行 React 编译器，而不是通过 Babel（16.3 实验性特性）。
		turbopackRustReactCompiler: true,
		typedEnv: true,
		serverComponentsHmrCache: false,
	},
	images: {
		// Blob 媒体 URL 带有一个随机后缀，因此每张新照片都是一个新 URL：优化后的副本可以缓存一年，
		// 无需重复生成（以前首次访问未生成副本的页面时，每张图片需等待约 0.3 秒）。
		minimumCacheTTL: 31536000,
		// 店铺媒体存储在 Vercel Blob（每个店铺的子域名）和 YNS 平台主机上。
		// 若使用 "**" 通配符会使图片优化器成为任意 https URL 的开放代理。
		remotePatterns: [
			{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
			{ protocol: "https", hostname: "yns.store" },
			{ protocol: "https", hostname: "**.yns.store" },
			{ protocol: "https", hostname: "yns.cx" },
			{ protocol: "https", hostname: "**.yns.cx" },
		],
	},
	// 带有筛选、排序和分页的列表在其独立的路由上按请求渲染，因此默认视图可以保持静态（lib/listing-routes.ts）。
	async rewrites() {
		return { beforeFiles: listingRewrites(), afterFiles: [], fallback: [] };
	},
	async headers() {
		if (isProd) return [];
		// 仅限开发环境：AI Builder 在 iframe 中渲染此应用，而 Chrome 的 HTTP 缓存
		// 会在 iframe 内保留过期的子资源 —— 虽然 HMR 已触发但预览无法体现。
		// 参见 https://github.com/vercel/next.js/issues/90143。
		return [
			{
				source: "/:path*",
				headers: [
					{ key: "Cache-Control", value: "no-store, must-revalidate" },
					{ key: "Pragma", value: "no-cache" },
				],
			},
		];
	},
};

export default nextConfig;
