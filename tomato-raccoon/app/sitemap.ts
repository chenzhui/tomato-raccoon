import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";
import {
	getAllCategories,
	getAllCollections,
	getAllLegalPages,
	getAllPosts,
	getAllProducts,
} from "@/lib/catalog-paths";
import { getCanonicalUrl, meGetCached } from "@/lib/commerce";

async function getContactFormEnabled() {
	const me = await meGetCached().catch(() => null);
	return me?.store.settings?.enabledTools?.contactForm ?? false;
}

async function getBlogState() {
	const me = await meGetCached().catch(() => null);
	if (!me?.store.settings?.enabledTools?.blog) {
		return { enabled: false, posts: [] as { slug: string; lastModified: string }[] };
	}
	return { enabled: true, posts: await getAllPosts().catch(() => []) };
}

// 返回列表中的最新日期，若列表为空则返回 undefined（该条目将不包含 <lastmod>）。
function newest(dates: string[]) {
	const times = dates.map((date) => new Date(date).getTime()).filter((time) => !Number.isNaN(time));
	return times.length > 0 ? new Date(Math.max(...times)) : undefined;
}

// 已缓存，因此站点地图为预渲染并在大约每分钟刷新一次，而不是在每次爬虫抓取时遍历整个商品目录
// （列表来自 lib/catalog-paths.ts，保持相同的生命周期：重命名的商品不能在此处保留旧地址长达一小时）。
// 每一个 <lastmod> 都是真实的日期：列表页面采用其最新条目的日期，
// 自身没有独立日期的页面（about、FAQ、contact）则不设 lastmod。Google 仅在网站的 lastmod
// 始终保持准确时才会信任它，如果页面在每次重新生成时都谎称有更新，反而会损害真实日期的可信度。
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	"use cache";
	cacheLife("minutes");

	const baseUrl = getCanonicalUrl();

	const [products, collections, categories, legalPages, blog, contactFormEnabled] = await Promise.all([
		getAllProducts().catch(() => []),
		getAllCollections().catch(() => []),
		getAllCategories().catch(() => []),
		getAllLegalPages().catch(() => []),
		getBlogState().catch(() => ({ enabled: false, posts: [] })),
		getContactFormEnabled().catch(() => false),
	]);

	const catalogModified = newest(products.map((p) => p.updatedAt));

	const staticRoutes: MetadataRoute.Sitemap = [
		{ url: `${baseUrl}/`, lastModified: catalogModified, changeFrequency: "daily", priority: 1.0 },
		{ url: `${baseUrl}/products`, lastModified: catalogModified, changeFrequency: "daily", priority: 0.9 },
		{ url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
		{ url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
		...(contactFormEnabled
			? [{ url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.5 }]
			: []),
	];

	const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
		url: `${baseUrl}/product/${p.slug}`,
		lastModified: new Date(p.updatedAt),
		changeFrequency: "weekly",
		priority: 0.8,
		images: p.images.length > 0 ? p.images : undefined,
	}));

	const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
		url: `${baseUrl}/collection/${c.slug}`,
		lastModified: new Date(c.lastModified),
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
		url: `${baseUrl}/category/${c.path}`,
		lastModified: new Date(c.lastModified),
		changeFrequency: "weekly",
		priority: 0.7,
	}));

	const legalRoutes: MetadataRoute.Sitemap = legalPages.map((p) => ({
		url: `${baseUrl}/legal${p.path}`,
		lastModified: new Date(p.updatedAt),
		changeFrequency: "yearly",
		priority: 0.3,
	}));

	const blogRoutes: MetadataRoute.Sitemap = blog.enabled
		? [
				{
					url: `${baseUrl}/blog`,
					lastModified: newest(blog.posts.map((p) => p.lastModified)),
					changeFrequency: "weekly",
					priority: 0.6,
				},
				...blog.posts.map((p) => ({
					url: `${baseUrl}/blog/${p.slug}`,
					lastModified: new Date(p.lastModified),
					changeFrequency: "monthly" as const,
					priority: 0.5,
				})),
			]
		: [];

	return [
		...staticRoutes,
		...productRoutes,
		...collectionRoutes,
		...categoryRoutes,
		...legalRoutes,
		...blogRoutes,
	];
}
