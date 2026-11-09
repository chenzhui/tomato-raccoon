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
	initialCharacter = "all",
}: {
	initialCategory?: string;
	initialCharacter?: string;
}) {
	"use cache";
	cacheLife("minutes");

	// 获取所有在售商品目录并传入交互式筛选器
	const response = await commerce.productBrowse({ active: true, limit: 100 });
	const products = response.data as unknown as ExplorerProduct[];

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="mb-8">
				<h1 className="text-3xl sm:text-5xl font-medium tracking-tight text-neutral-900">
					All Products
				</h1>
				<p className="mt-2 text-sm sm:text-base text-neutral-500 font-normal">
					Explore official optical acrylic standees, artisan keycaps, squishy plushies & desk mats.
				</p>
			</div>

			<ProductsExplorer
				initialProducts={products}
				initialCategory={initialCategory}
				initialCharacter={initialCharacter}
			/>
		</div>
	);
}
