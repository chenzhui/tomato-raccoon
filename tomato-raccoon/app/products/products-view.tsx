import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { ProductsExplorer, type ExplorerProduct } from "@/components/products/products-explorer";
import { commerce, getStoreSeo } from "@/lib/commerce";

export async function productsMetadata(page: string | undefined): Promise<Metadata> {
	const pageNum = Math.max(1, Number(page) || 1);
	const canonical = pageNum > 1 ? `/products?page=${pageNum}` : "/products";
	const title = pageNum > 1 ? `All Products — Page ${pageNum}` : "All Products";
	const { storeName, storeDescription } = await getStoreSeo();
	const description = storeDescription
		? `Browse the complete ${storeName} collection. ${storeDescription}`
		: `Browse the complete ${storeName} product collection.`;

	return {
		title,
		description,
		alternates: { canonical },
		openGraph: {
			type: "website",
			title,
			description,
			url: canonical,
		},
	};
}

/**
 * 全部商品列表页面
 * 包含按「大模型形象」与「选品类型（立牌、键帽、玩偶、桌垫）」双重交互筛选
 */
export async function ProductsView({
	initialCategory = "all",
}: {
	initialCategory?: string;
}) {
	"use cache";
	cacheLife("minutes");

	// 获取所有在售商品目录并传入交互式筛选器
	const response = await commerce.productBrowse({ active: true, limit: 100 });
	const products = response.data as unknown as ExplorerProduct[];

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="mb-8">
				<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E3F20]/10 text-[#1E3F20] text-xs font-bold uppercase tracking-wider mb-2">
					★ Authentic Movement Catalog
				</div>
				<h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1E3F20]">
					All Movement Goods
				</h1>
				<p className="mt-2 text-sm sm:text-base text-[#524B42] font-normal">
					Handcrafted yard signs, heavyweight hoodies, weatherproof vinyl stickers &amp; vintage tees defending Virginia farmland.
				</p>
			</div>

			<ProductsExplorer
				initialProducts={products}
				initialCategory={initialCategory}
			/>
		</div>
	);
}
