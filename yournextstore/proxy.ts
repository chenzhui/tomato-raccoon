import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSubdomainPublicUrl } from "./lib/commerce";
import { markdownRewritePath } from "./lib/markdown";

// /account 是平台渲染的买家账户区域（统一登录）；平台自身会处理未认证访问，
// 因此它像 /checkout 一样进行代理转发，绝不在此处设防拦截。
//
// 此处的 Webhook 路径用于商家已在该域名上注册的地址；
// 平台会像处理 checkout 一样，根据 `/<subdomain>` 前缀来解析对应的店铺。
//
// /api/mcp 是店铺的 MCP 服务器，即 AI 助手（ChatGPT、Claude）所连接的地址。
const proxiedRoutes = [
	"/api/feed/",
	"/api/chat",
	"/api/mcp",
	"/api/frame-webhook",
	"/api/montonio-webhook",
	"/account",
];

// 平台此前用于在该域名上发送邮件的链接。它们现在位于平台域名上，
// 仅凭 token 或 id 即可标识目标，因此旧邮件中的链接会重定向到那里。
const movedLinks: Record<string, string> = {
	"/unsubscribe": "/n/unsubscribe",
	"/confirm-subscription": "/n/confirm",
};

// 其它服务器在此域名上调用的端点，由平台在无店铺前缀的路径下提供服务：
// 使用重写（rewrite）而非重定向（redirect），因为邮箱服务商的一键退订、物流商的 Webhook
// 以及抓取 IndexNow 密钥的搜索引擎通常不会可靠地跟随重定向。
const platformEndpoints: Record<string, string> = {
	"/unsubscribe/post": "/n/unsubscribe/post",
	"/api/inpost-webhook": "/api/inpost-webhook",
	"/api/indexnow": "/api/indexnow",
};
const DIGITAL_ASSETS_PREFIX = "/digital-assets/";
// PayNow 仅接受店铺注册域名下的通知地址，因此平台在此注册 `/api/paynow/<storeId>/webhooks`，
// 并将其转发到平台对应的路径。
const PAYNOW_WEBHOOK_PREFIX = "/api/paynow/";

export async function proxy(request: NextRequest) {
	// /_public/ 下由平台拥有的脚本 —— 原样转发（附带店铺信息，以便平台生成针对特定店铺的响应）
	// 并由平台提供服务。哪些路径是静态的、哪些是动态的由平台决定；
	// 本分支不包含任何关于单个资产的信息。请勿修改。
	if (request.nextUrl.pathname.startsWith("/_public/")) {
		const { subdomain, publicUrl } = await getSubdomainPublicUrl();
		const destination = new URL(request.nextUrl.pathname, publicUrl);
		destination.searchParams.set("store", subdomain);
		return NextResponse.rewrite(destination);
	}

	// GetResponse 的控制台会在网站根目录检查其 Web 推送 Worker。Storefront kit
	// 已将平台副本注册在 /_public/scripts/ 下，因此根路径直接提供该文件服务。
	if (request.nextUrl.pathname === "/gr_sw_main.js") {
		const { publicUrl } = await getSubdomainPublicUrl();
		return NextResponse.rewrite(new URL("/_public/scripts/gr_sw_main.js", publicUrl));
	}

	const { pathname, search } = request.nextUrl;
	const movedLink = movedLinks[pathname];
	if (movedLink) {
		const { publicUrl } = await getSubdomainPublicUrl();
		return NextResponse.redirect(new URL(`${movedLink}${search}`, publicUrl), 308);
	}
	const platformEndpoint = platformEndpoints[pathname];
	if (platformEndpoint) {
		const { publicUrl } = await getSubdomainPublicUrl();
		return NextResponse.rewrite(new URL(`${platformEndpoint}${search}`, publicUrl));
	}
	if (pathname.startsWith(PAYNOW_WEBHOOK_PREFIX)) {
		const { publicUrl } = await getSubdomainPublicUrl();
		return NextResponse.rewrite(new URL(`${pathname}${search}`, publicUrl));
	}
	if (pathname.startsWith(DIGITAL_ASSETS_PREFIX)) {
		const { publicUrl } = await getSubdomainPublicUrl();
		const downloadId = pathname.slice(DIGITAL_ASSETS_PREFIX.length);
		return NextResponse.redirect(new URL(`/api/digital-assets/${downloadId}`, publicUrl), 308);
	}

	// 结账与 Feed 代理：重写到后端
	if (proxiedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
		const { subdomain, publicUrl } = await getSubdomainPublicUrl();
		const destinationUrl = new URL(publicUrl);

		const requestHeaders = new Headers(request.headers);
		// 仅在本地 / 自托管后端生效：在 Vercel 上，平台的 Edge 会在应用接收到请求之前将其替换为真实的 Host。
		requestHeaders.set("x-forwarded-host", destinationUrl.host);
		// 浏览器的 `Origin` 会被原样转发，未携带该标头的请求送达时同样不带。
		// 若像以前的代理那样将其覆盖为平台 origin，会将所有跨站 POST 伪装成可信请求，
		// 从而破坏 Next.js Server Action 校验和 better-auth 的 CSRF 防护。
		// 平台会改用该店铺自身的域名来校验转发的 origin。
		// 该标头将此代理标记为转发代理；平台仅用其来*收紧*校验，因此即便伪造也不会带来额外权限。
		requestHeaders.set("x-yns-forwarded-origin", "1");

		const url = new URL(`/${subdomain}${request.nextUrl.pathname}${request.nextUrl.search}`, destinationUrl);
		url.searchParams.set("auth", "0");

		return NextResponse.rewrite(url, {
			request: {
				headers: requestHeaders,
			},
		});
	}

	// AI Agent 请求页面的 Markdown 版本时，将在该页面自身的地址以其语言获取平台的 Markdown 内容。参见 lib/markdown.ts。
	const markdownRoute = markdownRewritePath(request);
	if (markdownRoute) {
		const { subdomain, publicUrl } = await getSubdomainPublicUrl();
		return NextResponse.rewrite(new URL(`/${subdomain}${markdownRoute}`, publicUrl));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/checkout",
		"/checkout/:path*",
		"/api/feed/:path*",
		"/api/chat",
		"/api/chat/:path*",
		"/api/mcp",
		"/api/indexnow",
		"/api/frame-webhook",
		"/api/montonio-webhook",
		"/api/inpost-webhook",
		"/api/paynow/:path*",
		"/unsubscribe",
		"/unsubscribe/post",
		"/confirm-subscription",
		"/digital-assets/:path*",
		"/account",
		"/account/:path*",
		"/_public/:path*",
		"/gr_sw_main.js",
		// 拥有 Markdown 版本的页面（lib/markdown.ts），可选用语言前缀（如 `/de`）。
		// 以 `.md` 结尾的地址始终请求 Markdown。
		"/index.md",
		"/:lang([a-z]{2})/index.md",
		"/:lang([a-z]{2})?/search.md",
		"/:lang([a-z]{2})?/:kind(product|collection|blog)/:file(.+\\.md)",
		// 仅当 Accept 标头声明支持 Markdown 时才匹配页面自身地址，这样浏览器的页面访问绝不会走该代理，保持缓存命中。由 `prefersMarkdown` 作最终判定。
		{ source: "/", has: [{ type: "header", key: "accept", value: ".*text/(?:markdown|plain).*" }] },
		{
			source: "/:lang([a-z]{2})",
			has: [{ type: "header", key: "accept", value: ".*text/(?:markdown|plain).*" }],
		},
		{
			source: "/:lang([a-z]{2})?/search",
			has: [{ type: "header", key: "accept", value: ".*text/(?:markdown|plain).*" }],
		},
		{
			source: "/:lang([a-z]{2})?/:kind(product|collection|blog)/:slug",
			has: [{ type: "header", key: "accept", value: ".*text/(?:markdown|plain).*" }],
		},
	],
};
