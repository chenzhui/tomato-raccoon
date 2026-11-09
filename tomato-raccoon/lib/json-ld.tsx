import type {
	APICollectionGetByIdResult,
	APIPostGetByIdResult,
	APIProductGetByIdResult,
	APIProductReviewsBrowseResult,
} from "commerce-kit";
import { getCanonicalUrl, meGetCached } from "@/lib/commerce";
import { minorUnitsToMajor } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";

function getBaseUrl(): string {
	return getCanonicalUrl();
}

// 纯子节点，不使用 dangerouslySetInnerHTML：React 在服务端渲染脚本内部文本时会转义 `<script` 和 `</script`，
// 因此商品名称无法提前闭合该标签或破坏其闭合标签。
export function JsonLdScript({ data }: { data: Record<string, unknown> }) {
	return <script type="application/ld+json">{JSON.stringify(data)}</script>;
}

export async function buildProductJsonLd(
	product: APIProductGetByIdResult,
	reviews: APIProductReviewsBrowseResult | null,
	brandName: string | null,
): Promise<Record<string, unknown>> {
	const { currency: storeCurrency, taxBehavior } = await getStoreConfig();
	// schema.org 的 `price` 必须是买家在页面上看到的价格 —— 含税店铺中为含税价，
	// 未税店铺中为未税价。与平台 storefront 输出的规则一致。
	const { min, max } = priceRange(product.variants, taxBehavior);
	const currency = storeCurrency.toUpperCase();
	// 根据货币的小数位数换算的次要货币单位：1999 对应 ¥1999，而非 ¥19.99。
	const lowPrice = minorUnitsToMajor({ amount: min, currency });
	const highPrice = minorUnitsToMajor({ amount: max, currency });
	const url = `${getBaseUrl()}/product/${product.slug}`;
	// `stock: null` 表示该变体不追踪库存。
	const availability = product.variants.some((variant) => variant.stock === null || (variant.stock ?? 0) > 0)
		? "https://schema.org/InStock"
		: "https://schema.org/OutOfStock";

	const jsonLd: Record<string, unknown> = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		description: product.summary,
		image: product.images,
		sku: product.variants[0]?.sku ?? product.id,
		brand: brandName ? { "@type": "Brand", name: brandName } : undefined,
		// 无论有多少个变体共享同一价格（如同款衬衫的不同尺码），都只作为一个 Offer：Google 的商家商品名录
		// 读取 `price`，而 lowPrice 等于 highPrice 的 AggregateOffer 所能传达的信息较少。
		offers:
			min === max
				? {
						"@type": "Offer",
						url,
						priceCurrency: currency,
						price: lowPrice,
						availability,
					}
				: {
						"@type": "AggregateOffer",
						url,
						lowPrice,
						highPrice,
						priceCurrency: currency,
						offerCount: product.variants.length,
						availability,
					},
	};

	if (reviews && reviews.summary.reviewCount > 0) {
		jsonLd.aggregateRating = {
			"@type": "AggregateRating",
			ratingValue: reviews.summary.averageRating,
			reviewCount: reviews.summary.reviewCount,
			bestRating: 5,
			worstRating: 1,
		};

		jsonLd.review = reviews.data.map((r) => ({
			"@type": "Review",
			author: { "@type": "Person", name: r.author },
			datePublished: r.createdAt,
			reviewRating: {
				"@type": "Rating",
				ratingValue: r.rating,
				bestRating: 5,
				worstRating: 1,
			},
			reviewBody: r.content,
		}));
	}

	return jsonLd;
}

export function buildProductBreadcrumbJsonLd(product: APIProductGetByIdResult): Record<string, unknown> {
	const baseUrl = getBaseUrl();
	const items = [
		{ "@type": "ListItem", position: 1, name: "Home", item: baseUrl || undefined },
		product.category
			? {
					"@type": "ListItem",
					position: 2,
					name: product.category.name,
					item: `${baseUrl}/category/${product.category.slug}`,
				}
			: null,
		{
			"@type": "ListItem",
			position: product.category ? 3 : 2,
			name: product.name,
		},
	].filter(Boolean);

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items,
	};
}

export function buildCollectionJsonLd(collection: APICollectionGetByIdResult): Record<string, unknown> {
	const baseUrl = getBaseUrl();

	return {
		"@context": "https://schema.org",
		"@type": "CollectionPage",
		name: collection.name,
		description:
			typeof collection.description === "string" ? collection.description : `${collection.name} collection`,
		image: collection.image ?? undefined,
		// 仅提供普通链接，而非 Product：Google 会拒绝没有报价（offers）的 Product 摘要，
		// 且商品详情页本身已包含完整的 Product 信息。
		mainEntity: {
			"@type": "ItemList",
			numberOfItems: collection.productCollections.length,
			itemListElement: collection.productCollections.map((pc, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: pc.product.name,
				url: `${baseUrl}/product/${pc.product.slug}`,
			})),
		},
	};
}

export function buildCollectionBreadcrumbJsonLd(
	collection: APICollectionGetByIdResult,
): Record<string, unknown> {
	const baseUrl = getBaseUrl();

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: baseUrl || undefined },
			{ "@type": "ListItem", position: 2, name: collection.name },
		],
	};
}

export function buildCategoryBreadcrumbJsonLd(
	hierarchy: Array<{ name: string; slug: string }>,
): Record<string, unknown> {
	const baseUrl = getBaseUrl();
	let path = "";

	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: [
			{ "@type": "ListItem", position: 1, name: "Home", item: baseUrl || undefined },
			...hierarchy.map((category, index) => {
				path += `/${category.slug}`;
				return {
					"@type": "ListItem",
					position: index + 2,
					name: category.name,
					item: baseUrl ? `${baseUrl}/category${path}` : undefined,
				};
			}),
		],
	};
}

async function getStoreOrganization() {
	const me = await meGetCached();
	const logo =
		typeof me.store.settings?.logo === "string" ? me.store.settings.logo : me.store.settings?.logo?.imageUrl;
	const ogImage = me.store.settings?.ogimage || undefined;
	return {
		"@type": "Organization",
		name: me.store.name || "Your Next Store",
		url: getBaseUrl(),
		...(logo ? { logo } : {}),
		...(ogImage ? { image: ogImage } : {}),
	};
}

// 文章未指定作者，因此店铺同时作为作者和发布者。
export async function buildBlogPostingJsonLd(
	post: NonNullable<APIPostGetByIdResult>,
): Promise<Record<string, unknown>> {
	const organization = await getStoreOrganization();
	const url = `${getBaseUrl()}/blog/${post.slug}`;
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		url,
		mainEntityOfPage: { "@type": "WebPage", "@id": url },
		datePublished: post.publishedAt ?? post.createdAt,
		dateModified: post.updatedAt,
		author: organization,
		publisher: organization,
		...(post.image ? { image: post.image } : {}),
		...(post.seo?.description ? { description: post.seo.description } : {}),
	};
}

export async function StoreJsonLd() {
	const me = await meGetCached();
	const storeName = me.store.name || "Your Next Store";
	const storeDescription = me.store.settings?.storeDescription || undefined;
	const baseUrl = getBaseUrl();
	const ogImage = me.store.settings?.ogimage || undefined;

	const organization = {
		"@context": "https://schema.org",
		...(await getStoreOrganization()),
	};

	const website = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: storeName,
		url: baseUrl,
		description: storeDescription,
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${baseUrl}/search?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
	};

	const store = {
		"@context": "https://schema.org",
		"@type": "Store",
		name: storeName,
		description: storeDescription,
		url: baseUrl,
		...(ogImage ? { image: ogImage } : {}),
	};

	return (
		<>
			<JsonLdScript data={organization} />
			<JsonLdScript data={website} />
			<JsonLdScript data={store} />
		</>
	);
}
