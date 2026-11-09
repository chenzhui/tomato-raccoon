import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/commerce";
import { FILTER_KEYS } from "@/lib/listing-routes";

// 排序规则或筛选条件会导致列表在 `…-filtered` 路由上按请求实时渲染，且每种组合都会生成一个
// 新 URL，而展示的商品与常规列表已链接的商品完全一致。阻止爬虫抓取这些页面；`page` 保持可爬取，
// 因为分页是爬虫访问第一页之后商品的途径。每个键对应两种匹配模式，因此 `?sort=` 和 `&sort=`
// 会被匹配，但 `?resort=` 不会被误伤。基于 FILTER_KEYS 构建，因此在该处新增的筛选条件也会在此处自动被屏蔽。
const UNCRAWLED_LISTING_PARAMS = ["sort", ...FILTER_KEYS];

const listingDisallows = () => UNCRAWLED_LISTING_PARAMS.flatMap((key) => [`/*?${key}=`, `/*&${key}=`]);

export default function robots(): MetadataRoute.Robots {
	const baseUrl = getCanonicalUrl();

	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/checkout", "/order/", "/search", "/api/", ...listingDisallows()],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
		host: baseUrl,
	};
}
