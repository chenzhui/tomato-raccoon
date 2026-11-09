import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";

// 目录中的所有地址，用于 app/sitemap.ts 和 `generateStaticParams`：已知页面完全预渲染
// （无加载状态），后续新增的地址在首次访问时渲染并从那时起被缓存。

/** Store API 的最大单页大小；更大的 `limit` 将无法通过校验（且捕获的错误会被视作“无商品”）。 */
const PAGE_SIZE = 100;
const MAX_ITEMS = 5000;

/** 第一页之后每次并发获取的页数：在高并发负载下，庞大的商品目录响应体可能会损坏（lib/commerce.ts）。 */
const CONCURRENCY = 4;

/** 浏览端点的所有分页：第一页提供 `meta.count`，后续页面分批次获取。 */
async function browseAll<T>(
	browse: (page: { limit: number; offset: number }) => Promise<{ data: T[]; meta: { count: number } }>,
): Promise<T[]> {
	const first = await browse({ limit: PAGE_SIZE, offset: 0 });
	const pageCount = Math.ceil(Math.min(first.meta.count, MAX_ITEMS) / PAGE_SIZE);
	const offsets = Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => (i + 1) * PAGE_SIZE);
	const batches = Array.from({ length: Math.ceil(offsets.length / CONCURRENCY) }, (_, i) =>
		offsets.slice(i * CONCURRENCY, (i + 1) * CONCURRENCY),
	);
	const rest = await batches.reduce<Promise<T[][]>>(
		async (done, batch) => [
			...(await done),
			...(await Promise.all(batch.map(async (offset) => (await browse({ limit: PAGE_SIZE, offset })).data))),
		],
		Promise.resolve([]),
	);
	return [first.data, ...rest].flat();
}

const later = (date: string, other: string) => (Date.parse(other) > Date.parse(date) ? other : date);

export async function getAllProducts() {
	"use cache";
	cacheLife("minutes");
	const products = await browseAll((page) => commerce.productBrowse({ active: true, ...page }));
	return products.map((p) => ({ slug: p.slug, updatedAt: p.updatedAt, images: p.images }));
}

export async function getAllCollections() {
	"use cache";
	cacheLife("minutes");
	const collections = await browseAll((page) => commerce.collectionBrowse({ active: true, ...page }));
	return collections.map((c) => ({ slug: c.slug, lastModified: c.updatedAt }));
}

export async function getAllCategories() {
	"use cache";
	cacheLife("minutes");
	const categories = await browseAll((page) => commerce.categoriesBrowse({ active: true, ...page }));
	const byId = new Map(categories.map((c) => [c.id, c] as const));
	// 与分类规范路径一致：从根节点起的祖先分类，最多 3 个层级片段（app/category/[...slugs]）。
	const pathOf = (id: string, depth = 0): string[] => {
		const category = byId.get(id);
		if (!category) return [];
		const parents = category.parentId && depth < 2 ? pathOf(category.parentId, depth + 1) : [];
		return [...parents, category.slug];
	};
	return categories.map((c) => ({ path: pathOf(c.id).join("/"), lastModified: c.updatedAt ?? c.createdAt }));
}

export async function getAllLegalPages() {
	"use cache";
	cacheLife("minutes");
	const result = await commerce.legalPageBrowse();
	return result.data.map((p) => ({ path: p.href, updatedAt: p.updatedAt }));
}

export async function getAllPosts() {
	"use cache";
	cacheLife("minutes");
	const posts = await browseAll((page) => commerce.postBrowse({ active: true, ...page }));
	// 定时发布的文章在正式上线前就已保存，因此其最后更改时间取两者中较晚的一个。
	return posts.map((p) => ({ slug: p.slug, lastModified: later(p.publishedAt ?? p.createdAt, p.updatedAt) }));
}

/**
 * 在 Cache Components 模式下，`generateStaticParams` 必须至少返回一个条目。在目录为空（或构建期间
 * 发生 API 错误）时，路由将获取此占位符，页面会据此响应 `notFound()`。
 */
export const PLACEHOLDER_SLUG = "__placeholder__";

/**
 * 仅对 URL 安全的 slug 进行预渲染：Next 在预渲染时会将页面路径写入请求头，其中的空格或非 ASCII
 * 字符会导致整个构建失败（"Cannot convert argument to a ByteString"）。任何其他 slug 依然
 * 可以正常工作；它会在首次访问时渲染，就像构建后新增的页面一样。
 */
export const isStaticSlug = (slug: string) => /^[A-Za-z0-9._~-]+$/.test(slug);

/** 目录值列表；若为空则返回包含单个占位符的数组。 */
export const withPlaceholder = <V>(values: V[], placeholder: V) =>
	values.length > 0 ? values : [placeholder];

/** `[slug]` 路由的静态参数：目录中 URL 安全的 slug；若不存在或读取失败则返回占位符。 */
export async function slugParams<T>(items: Promise<T[]>, slugOf: (item: T) => string) {
	const slugs = (await items.catch(() => [])).map(slugOf).filter(isStaticSlug);
	return withPlaceholder(slugs, PLACEHOLDER_SLUG).map((slug) => ({ slug }));
}
