/**
 * 同时以 Markdown 格式响应的 storefront 页面，供 AI Agent 使用。Agent 可通过
 * `Accept: text/markdown`（或 `text/plain`）或在地址后追加 `.md` 来请求 Markdown；
 * 随后代理将该请求重写至平台对应的 `/<subdomain>/md/…` 路由。
 *
 * 平台拥有这些页面在店铺提供的各种语言下的内容（商品、合辑、博客文章、搜索）。
 * 另一种语言的页面位于 `/xx/` 前缀下，该前缀转换为 `?lang=xx` 送达平台；
 * 平台会对照店铺支持的语言进行检查。仅存在于本应用内的页面（关于我们、常见问题等）
 * 除非店铺自行添加重写规则，否则没有 Markdown 版本。
 */

type AcceptEntry = { range: string; quality: number; position: number; specificity: number };

const parseAccept = (accept: string): AcceptEntry[] =>
	accept
		.split(",")
		.map((part, position) => {
			const [range = "", ...params] = part.split(";").map((piece) => piece.trim().toLowerCase());
			const q = params.find((param) => param.startsWith("q="));
			const quality = q ? Number(q.slice(2)) : 1;
			const specificity = range === "*/*" ? 0 : range.endsWith("/*") ? 1 : 2;
			return { range, quality: Number.isFinite(quality) ? quality : 0, position, specificity };
		})
		.filter(({ range }) => range !== "");

const covers = (range: string, type: string) =>
	range === type || range === "*/*" || (range.endsWith("/*") && type.startsWith(range.slice(0, -1)));

/** 决定调用方对 `type` 期望程度的条目：优先取覆盖该类型中最具体的范围，其次取最早出现的。 */
const preference = (entries: AcceptEntry[], type: string) =>
	entries
		.filter(({ range }) => covers(range, type))
		.toSorted((a, b) => b.specificity - a.specificity || a.position - b.position)[0];

const ranksFirst = (a: AcceptEntry, b: AcceptEntry | undefined) =>
	!b || a.quality > b.quality || (a.quality === b.quality && a.position < b.position);

/**
 * 当调用方更倾向于获取 Markdown 而非 HTML 时返回 true，综合权衡品质因子（q值）、特异性与顺序
 * （改写自 vercel/shop 的 `prefersMarkdown`，MIT 协议）。Markdown 必须明确指明为 `text/markdown`
 * 或 `text/plain`；仅使用 `*` 通配符绝不算数，因此普通浏览器始终获取 HTML。
 */
export const prefersMarkdown = (accept: string | null) => {
	if (!accept) return false;
	const entries = parseAccept(accept);
	const markdown = ["text/markdown", "text/plain"]
		.map((type) => preference(entries, type))
		.filter((entry): entry is AcceptEntry => !!entry && entry.specificity === 2 && entry.quality > 0)
		.toSorted((a, b) => (ranksFirst(a, b) ? -1 : 1))[0];
	return !!markdown && ranksFirst(markdown, preference(entries, "text/html"));
};

const LANGUAGE_PREFIX = /^\/([a-z]{2})(?=\/|$)/;

const pageRoute = (page: string) => {
	if (page === "/") return "/md";
	if (page === "/search") return "/md/search";
	if (/^\/(product|collection|blog)\/[^/]+$/.test(page)) return `/md${page}`;
	return null;
};

/**
 * 页面对应的平台 Markdown 路由，若该页面没有 Markdown 版本则返回 null：
 * `/product/x` → `/md/product/x`，`/de/blog/x` → `/md/blog/x?lang=de`。
 */
export const markdownPath = (pathname: string) => {
	const lang = LANGUAGE_PREFIX.exec(pathname)?.[1];
	const route = pageRoute(lang ? pathname.slice(lang.length + 1) || "/" : pathname);
	return route && lang ? `${route}?lang=${lang}` : route;
};

/** `/product/x.md` → `/product/x` 对应的 Markdown 路由；`/index.md`（或 `/de/index.md`）为主页。 */
const markdownMirrorPath = (pathname: string) => {
	if (!pathname.endsWith(".md")) return null;
	const page = pathname.slice(0, -".md".length).replace(/\/index$/, "");
	return markdownPath(page || "/");
};

/** 请求需重写到的平台路由（路径与查询参数），同时保留页面自身的查询参数（`?q=`、`?variant=`）。 */
export const markdownRewritePath = (request: Request) => {
	if (request.method !== "GET" && request.method !== "HEAD") return null;
	const url = new URL(request.url);
	const route =
		markdownMirrorPath(url.pathname) ??
		(prefersMarkdown(request.headers.get("accept")) ? markdownPath(url.pathname) : null);
	if (!route) return null;
	const [path = "", routeQuery = ""] = route.split("?");
	const query = new URLSearchParams({
		...Object.fromEntries(url.searchParams),
		...Object.fromEntries(new URLSearchParams(routeQuery)),
	}).toString();
	return query ? `${path}?${query}` : path;
};
