/**
 * 带有筛选、排序或页码的商品列表在内部的 `…-filtered` 路由上按请求动态渲染；默认视图
 * （`/products`、`/category/…`）从不读取查询参数，因此完全支持预渲染。公开的 URL 保持不变：
 * 当存在任一列表参数时，`next.config.ts` 会对其进行重写（`beforeFiles`）。`proxy.ts` 由
 * 平台管理，这就是为何本逻辑写在配置文件中的原因。这些参数列表是重写规则、筛选类型和控件的
 * 唯一事实源：在此遗漏的参数将静默展示未经过滤的静态视图。
 */
export const FILTER_KEYS = ["category", "collection", "brand", "priceMin", "priceMax", "vts"] as const;

export const PRODUCT_LISTING_PARAMS = ["page", "sort", ...FILTER_KEYS] as const;
/** 分类页面本身即代表分类筛选条件，因此在那里无需作为参数。 */
export const CATEGORY_LISTING_PARAMS = [
	"page",
	"collection",
	"brand",
	"priceMin",
	"priceMax",
	"vts",
] as const;

export type ListingParams<K extends string> = Partial<Record<K, string>>;
export type ProductListingParams = ListingParams<(typeof PRODUCT_LISTING_PARAMS)[number]>;
export type CategoryListingParams = ListingParams<(typeof CATEGORY_LISTING_PARAMS)[number]>;

const LISTINGS = [
	{ source: "/products", destination: "/products-filtered", params: PRODUCT_LISTING_PARAMS },
	{ source: "/category/:path*", destination: "/category-filtered/:path*", params: CATEGORY_LISTING_PARAMS },
];

/** 精简架构：移除了内部冗余的 filtered 重写路由，直接在主路由展示商品 */
export const listingRewrites = () => [];

/** 仅从查询中提取列表相关参数，排除其他内容：跟踪参数（如 utm_*、gclid）不会进入链接和缓存键中。 */
export const activeParams = (
	keys: readonly string[],
	query: Record<string, string | string[] | undefined>,
): Record<string, string> =>
	Object.fromEntries(keys.flatMap((key) => (typeof query[key] === "string" ? [[key, query[key]]] : [])));

/** 将当前选中的参数转换为 `URLSearchParams`，供筛选与排序控件使用（空字段会被丢弃）。 */
export const toSearchParams = (active: Record<string, string | undefined>) =>
	new URLSearchParams(Object.entries(active).flatMap(([key, value]) => (value ? [[key, value]] : [])));
