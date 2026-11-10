import { Commerce } from "commerce-kit";
import { cacheLife } from "next/cache";
import { try_ } from "safe-try";
import { getMockProducts, MOVEMENT_REVIEWS } from "./mock-data";
import { pool, ensureDbTables } from "./db";

// 带持久化支持的内存购物车存储
const cartMemoryStore = new Map<string, any>();

function getOrCreateCart(cartId?: string) {
	const cid = cartId || `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	let cart = cartMemoryStore.get(cid);
	if (!cart) {
		cart = {
			id: cid,
			lineItems: [],
			subtotal: 0,
			subtotalNet: 0,
			subtotalGross: 0,
			total: 0,
			currency: "USD",
			totalQuantity: 0,
		};
		cartMemoryStore.set(cid, cart);
	}
	return cart;
}

function updateCartTotals(cart: any) {
	let subtotal = 0;
	let totalQuantity = 0;
	for (const item of cart.lineItems) {
		const unitPrice = Number.parseInt(item.productVariant.price, 10) || 0;
		subtotal += unitPrice * item.quantity;
		totalQuantity += item.quantity;
	}
	cart.subtotal = subtotal;
	cart.subtotalNet = subtotal;
	cart.subtotalGross = subtotal;
	cart.total = subtotal;
	cart.totalQuantity = totalQuantity;
	return cart;
}

const mockCategories = [
	{ id: "cat-all", slug: "all", name: "All Goods", description: "All official Tomato Raccoon movement goods", parentId: null },
	{ id: "cat-apparel", slug: "apparel", name: "Vintage Apparel", description: "Comfort Colors garment-dyed shirts & heavyweight hoodies", parentId: null },
	{ id: "cat-signs", slug: "signs", name: "Lawn Yard Signs", description: "Double-sided weatherproof corrugated yard signs with metal H-stake", parentId: null },
	{ id: "cat-stickers", slug: "stickers", name: "Vinyl Stickers", description: "Weatherproof UV-laminated die-cut bumper & kiss-cut stickers", parentId: null },
];

const mockCollections = [
	{
		id: "col-featured",
		slug: "featured",
		name: "Movement Bestsellers",
		description: "Top-selling grassroots goods defending local agriculture",
		productCollections: getMockProducts().slice(0, 5).map((p) => ({ product: p })),
	},
];

const mockLegalPages = [
	{
		id: "legal-1",
		slug: "privacy-policy",
		path: "/privacy-policy",
		href: "/privacy-policy",
		label: "Privacy Policy",
		title: "Privacy Policy",
		updatedAt: new Date().toISOString(),
		body: `
# Privacy Policy

Last updated: November 2026

At AI-Chan Geek Merch ("we", "our", or "us"), we are committed to protecting your privacy. This policy explains how we handle your personal information when you visit or make a purchase from our store.

### 1. Information We Collect
When you make a purchase or attempt to make a purchase through our site, we collect certain information from you, including your name, billing address, shipping address, payment information (processed securely through Stripe/PayPal; we never store your full credit card number), email address, and phone number.

### 2. How We Use Your Information
We use the order information that we collect generally to fulfill any orders placed through the Site (including processing your payment information, arranging for shipping via YunExpress/USPS, and providing you with invoices and/or order confirmations).

### 3. Contact Us
For more information about our privacy practices, contact us at support@aichan-merch.com.
		`,
	},
	{
		id: "legal-2",
		slug: "terms-of-service",
		path: "/terms-of-service",
		href: "/terms-of-service",
		label: "Terms of Service",
		title: "Terms of Service",
		updatedAt: new Date().toISOString(),
		body: `
# Terms of Service

Last updated: November 2026

By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions.

All brand references and codenames ("Whale-Chan", "Sonnet-Tan", "Omni-Chan", "Rebel-Tan", "TwinStar-Chan") are transformative artistic parodies.
		`,
	},
	{
		id: "legal-3",
		slug: "shipping-policy",
		path: "/shipping-policy",
		href: "/shipping-policy",
		label: "Shipping Policy",
		title: "Shipping Policy",
		updatedAt: new Date().toISOString(),
		body: `
# Shipping Policy

Last updated: November 2026

We offer 100% Free US Shipping on all orders over $35. Orders under $35 ship at a flat rate of $4.99 via USPS Ground. All goods are packed in plastic-free, 100% recyclable paper packaging. Standard delivery takes 3-7 business days across the continental United States.
		`,
	},
	{
		id: "legal-4",
		slug: "refund-policy",
		path: "/refund-policy",
		href: "/refund-policy",
		label: "Refund Policy",
		title: "Refund Policy (30-Day Soil Guarantee)",
		updatedAt: new Date().toISOString(),
		body: `
# Refund & Return Policy (30-Day Defend the Soil Guarantee)

Last updated: November 2026

If your item arrives damaged or you are not completely satisfied with the quality of your grassroots goods, contact support@tomatoraccoon.com within 30 days. We will issue a replacement or 100% refund.
		`,
	},
];

// 在本地处理所有 Commerce SDK 请求的自定义 Fetch 拦截器
async function localCommerceFetch(url: string, init?: RequestInit): Promise<Response> {
	await ensureDbTables();
	const u = new URL(url);
	const pathname = u.pathname;
	const searchParams = u.searchParams;

	// /api/v1/me 店铺信息端点
	if (pathname.includes("/me")) {
		return new Response(
			JSON.stringify({
				store: {
					id: "store-tomatoraccoon",
					name: "Tomato Raccoon Supply Co.",
					subdomain: "tomatoraccoon",
					currency: "USD",
					locale: "en-US",
					taxBehavior: "inclusive",
					settings: {
						storeDescription: "Grow Tomatoes, Not Data Centers. Handcrafted goods defending Virginia farmland & clean aquifers.",
						currency: "USD",
						locale: "en-US",
						defaultLanguage: "en-US",
						enabledLanguages: { "en-US": true },
						enabledTools: { reviews: true, blog: false, contactForm: true, newsletterPopup: false, restockNotifications: false },
						logo: { imageUrl: "/images/mascot-badge.svg" },
						favicon: { imageUrl: "/images/mascot-badge.svg" },
					},
				},
				publicUrl: "http://localhost:3000",
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	// /api/v1/products/:id/related 关联商品端点
	if (pathname.includes("/related")) {
		const parts = pathname.split("/products/")[1]?.split("/related")[0] || "";
		const products = getMockProducts().filter((p) => p.id !== parts && p.slug !== parts);
		return new Response(
			JSON.stringify({
				data: products.slice(0, 6),
				meta: { count: products.length },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	// /api/v1/products/filters 商品筛选器端点
	if (pathname.includes("/filters")) {
		return new Response(
			JSON.stringify({
				categories: mockCategories,
				collections: mockCollections,
				brands: [],
				variantTypes: [],
				priceBounds: { min: 1699, max: 5999 },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	// /api/v1/products/:slugOrId 单个商品端点
	if (pathname.includes("/products/")) {
		const slugOrId = decodeURIComponent(pathname.split("/products/")[1]?.split("?")[0] || "");
		const products = getMockProducts();
		const p = products.find((item) => item.slug === slugOrId || item.id === slugOrId || (item as any).legacyId === slugOrId);
		if (!p) {
			return new Response(JSON.stringify({ message: "Product not found" }), { status: 404 });
		}
		return new Response(JSON.stringify(p), { status: 200, headers: { "Content-Type": "application/json" } });
	}

	// /api/v1/products (浏览商品，支持分类与角色筛选)
	if (pathname.endsWith("/products")) {
		let products = getMockProducts();
		const urlObj = new URL(url, "http://localhost");
		const cat = urlObj.searchParams.get("category");
		if (cat && cat !== "all") {
			products = products.filter(
				(p) =>
					p.category.toLowerCase().replace(/\s+/g, "-") === cat.toLowerCase() ||
					p.category.toLowerCase() === cat.toLowerCase(),
			);
		}
		return new Response(
			JSON.stringify({
				data: products,
				meta: { count: products.length, total: products.length },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	// /api/v1/categories 商品分类端点
	if (pathname.includes("/categories")) {
		return new Response(
			JSON.stringify({
				data: mockCategories,
				meta: { count: mockCategories.length },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	// /api/v1/collections/:slugOrId 单个合辑端点
	if (pathname.includes("/collections/")) {
		const slugOrId = decodeURIComponent(pathname.split("/collections/")[1]?.split("?")[0] || "");
		const col = mockCollections.find((c) => c.slug === slugOrId || c.id === slugOrId) || mockCollections[0];
		return new Response(JSON.stringify(col), { status: 200, headers: { "Content-Type": "application/json" } });
	}

	// /api/v1/collections 商品合辑端点
	if (pathname.includes("/collections")) {
		return new Response(
			JSON.stringify({
				data: mockCollections,
				meta: { count: mockCollections.length },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	// /api/v1/legal 法律条款页面端点
	if (pathname.includes("/legal")) {
		const parts = pathname.split("/legal/");
		if (parts.length > 1 && parts[1]) {
			const slug = parts[1];
			const page = mockLegalPages.find((p) => p.slug === slug);
			if (!page) return new Response(JSON.stringify({ message: "Not found" }), { status: 404 });
			return new Response(JSON.stringify(page), { status: 200, headers: { "Content-Type": "application/json" } });
		}
		return new Response(
			JSON.stringify({
				data: mockLegalPages,
				meta: { count: mockLegalPages.length },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	// /api/v1/reviews 商品评价端点
	if (pathname.includes("/reviews")) {
		return new Response(
			JSON.stringify({
				data: MOVEMENT_REVIEWS,
				meta: { count: MOVEMENT_REVIEWS.length },
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	}

	// 购物车操作
	if (pathname.includes("/cart")) {
		const cart = getOrCreateCart("default");
		return new Response(JSON.stringify(cart), { status: 200, headers: { "Content-Type": "application/json" } });
	}

	// 用户留言与反馈端点
	if (pathname.includes("/contact")) {
		return new Response(JSON.stringify({ success: true, message: "Thank you for contacting Tomato Raccoon Co." }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	}

	// 默认回退处理
	return new Response(JSON.stringify({ data: [], meta: { count: 0 } }), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}

const client = Commerce({
	token: process.env.YNS_API_KEY || "mock-api-key-for-local-development",
	endpoint: "http://localhost:3000/api/mock",
	fetch: localCommerceFetch,
});

export const commerce = Object.assign(client, {
	async cartUpsert({
		cartId,
		variantId,
		quantity = 1,
		mode,
	}: {
		cartId?: string;
		variantId: string;
		quantity?: number;
		subscriptionPlanId?: string | null;
		locale?: string;
		mode?: "set" | "add";
	}) {
		const cid = cartId || `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		const cart = getOrCreateCart(cid);
		const products = getMockProducts();
		let targetVariant: any = null;
		let targetProduct: any = null;

		for (const p of products) {
			const v = p.variants.find((variant) => variant.id === variantId);
			if (v) {
				targetVariant = v;
				targetProduct = p;
				break;
			}
		}

		if (!targetVariant && products[0]?.variants[0]) {
			targetVariant = products[0].variants[0];
			targetProduct = products[0];
		}

		const existing = cart.lineItems.find((i: any) => i.productVariant.id === variantId);
		if (existing) {
			if (mode === "set") {
				existing.quantity = quantity;
			} else {
				existing.quantity += quantity;
			}
			if (existing.quantity <= 0) {
				cart.lineItems = cart.lineItems.filter((i: any) => i.productVariant.id !== variantId);
			}
		} else if (quantity > 0) {
			cart.lineItems.push({
				id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
				quantity,
				productVariant: {
					id: targetVariant.id,
					name: targetVariant.name,
					price: targetVariant.price,
					originalPrice: targetVariant.originalPrice,
					stock: targetVariant.stock,
					images: targetVariant.images,
					combinations: [],
					product: {
						id: targetProduct.id,
						name: targetProduct.name,
						slug: targetProduct.slug,
						images: targetProduct.images,
					},
				},
			});
		}

		updateCartTotals(cart);
		cartMemoryStore.set(cid, cart);

		try {
			await pool.query(
				`INSERT INTO cart_sessions (id, items, updated_at)
				 VALUES ($1, $2, NOW())
				 ON CONFLICT (id) DO UPDATE SET items = $2, updated_at = NOW()`,
				[cid, JSON.stringify(cart.lineItems)],
			);
		} catch (err) {
			// 静默降级回退
		}

		return cart;
	},

	async cartApplyDiscountCode({ cartId, code }: { cartId: string; code: string }) {
		return { success: true };
	},

	async cartAddBundle({
		cartId,
		bundleId,
	}: {
		cartId?: string;
		bundleId: string;
		selections?: any[];
		currency?: string;
		locale?: string;
	}) {
		const cid = cartId || `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		return this.cartUpsert({ cartId: cid, variantId: "var-bundle-5", quantity: 1 });
	},

	async orderGet({ id }: { id: string }) {
		try {
			const res = await pool.query("SELECT * FROM orders WHERE id = $1 OR order_number = $1", [id]);
			if (res.rows.length > 0) {
				const row = res.rows[0];
				return {
					id: row.id,
					lookup: row.order_number,
					orderNumber: row.order_number,
					status: row.payment_status || "paid",
					createdAt: row.created_at,
					orderData: {
						customer: { email: row.customer_email, name: row.customer_name },
						shippingAddress: row.shipping_address,
						shipping: { name: "YunExpress / USPS Priority Express", amount: 0 },
						subtotal: row.subtotal,
						total: row.total,
						totalTax: 0,
						lineItems: row.items.map((it: any) => ({
							id: it.id || `item-${Math.random()}`,
							quantity: it.quantity || 1,
							productVariant: {
								id: it.variantId || "var-bundle-5",
								name: it.name || "AI-Chan Merch",
								price: String(it.price || 5999),
								images: it.images || ["/images/characters/whale-chan-full.png"],
								product: {
									id: "prod-1",
									name: it.name || "AI-Chan Merch",
									slug: "ultimate-waifu-desk-bundle",
									images: it.images || ["/images/characters/whale-chan-full.png"],
								},
							},
						})),
					},
				};
			}
		} catch (e) {
			// 降级回退
		}

		const num = `AI-${Math.floor(100000 + Math.random() * 900000)}`;
		return {
			id,
			lookup: num,
			orderNumber: num,
			status: "paid",
			createdAt: new Date().toISOString(),
			orderData: {
				customer: { email: "geek.coder@example.com", name: "Silicon Valley Hacker" },
				shippingAddress: {
					name: "Silicon Valley Hacker",
					address1: "420 Hacker Way, Suite 101",
					city: "San Francisco",
					state: "CA",
					postalCode: "94107",
					country: "United States",
				},
				shipping: { name: "USPS Express Direct (7-12 Days)", amount: 0 },
				subtotal: 5999,
				total: 5999,
				totalTax: 0,
				lineItems: [
					{
						id: "line-bundle-demo",
						quantity: 1,
						productVariant: {
							id: "var-bundle-5",
							name: "🔥 The Ultimate Desk Waifu Bundle (All 5 Standees Set)",
							price: "5999",
							images: ["/images/characters/whale-chan-full.png"],
							product: {
								id: "prod-bundle-desk",
								name: "🔥 The Ultimate Desk Waifu Bundle (All 5 Standees Set)",
								slug: "ultimate-waifu-desk-bundle",
								images: ["/images/characters/whale-chan-full.png"],
							},
						},
					},
				],
			},
		};
	},
});

export const meGetCached = async () => {
	"use cache";
	cacheLife("hours");
	return client.meGet();
};

export const productGetCached = async (idOrSlug: string) => {
	"use cache";
	cacheLife("minutes");
	const [error, product] = await try_(client.productGet({ idOrSlug }));
	return error ? null : product;
};

export async function getStoreSeo() {
	"use cache";
	cacheLife("hours");
	return {
		storeName: "Tomato Raccoon Supply Co.",
		storeDescription: "Grow Tomatoes, Not Data Centers. Handcrafted goods defending Virginia farmland & clean aquifers.",
	};
}

export function getStoreFaviconUrl(_settings: any) {
	return "/images/raccoon-tomato.svg";
}

export function getCanonicalUrl(): string {
	return "http://localhost:3000";
}

export const getSubdomainPublicUrl = async () => {
	return {
		subdomain: "tomato-raccoon",
		publicUrl: "http://localhost:3000",
	};
};
