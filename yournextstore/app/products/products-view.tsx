import type { Metadata } from "next";
import { SortLinks, SortSelect } from "@/app/products/products-sort-select";
import { getListingPage, ListingProducts } from "@/components/listing-products";
import { ProductFilters, ProductFiltersMobile } from "@/components/sections/product-filters";
import { getStoreSeo } from "@/lib/commerce";
import { getFilterFacets, hasFacets } from "@/lib/facets";
import type { ProductListingParams } from "@/lib/listing-routes";

// "精选（Featured）" 遵循商家在店铺的 `all` 合集中设置的排序规则（若未设置则默认按最新优先）。
const sortOptions = [
	{ value: "featured", label: "Featured", orderBy: "featured", orderDirection: "desc" },
	{ value: "newest", label: "Newest", orderBy: "createdAt", orderDirection: "desc" },
	{ value: "price-asc", label: "Price: Low to High", orderBy: "price", orderDirection: "asc" },
	{ value: "price-desc", label: "Price: High to Low", orderBy: "price", orderDirection: "desc" },
	{ value: "name", label: "Name: A–Z", orderBy: "name", orderDirection: "asc" },
] as const;

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
 * 全部商品页面。默认视图（不带参数的 `/products`）完整预渲染；
 * 筛选条件、排序或页码会被重写到 `/products-filtered`，后者按请求实时渲染（参见 lib/listing-routes.ts）。
 */
export async function ProductsView({ filters }: { filters: ProductListingParams }) {
	const sortOption = sortOptions.find((s) => s.value === filters.sort) ?? sortOptions[0];
	const order = { orderBy: sortOption.orderBy, orderDirection: sortOption.orderDirection };
	// 列表页与分面项数据同时并行加载；下方的商品网格直接读取相同的缓存条目。
	const [facets] = await Promise.all([getFilterFacets(), getListingPage({ filters, order })]);
	const filtersAvailable = hasFacets(facets);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="mb-10">
				<h1 className="text-3xl sm:text-4xl font-medium tracking-tight">All Products</h1>
				<p className="mt-2 text-muted-foreground">Browse our complete collection</p>
			</div>

			<div className={filtersAvailable ? "lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10" : ""}>
				{filtersAvailable && <ProductFilters facets={facets} active={filters} />}

				<div>
					{/* 移动端/平板端工具栏：筛选按钮 + 紧凑型排序下拉框（侧边栏在 lg 断点以下隐藏）。 */}
					<div className="mb-8 flex items-center justify-between gap-3 lg:hidden">
						{filtersAvailable ? <ProductFiltersMobile facets={facets} active={filters} /> : <span />}
						<SortSelect options={sortOptions} active={filters} />
					</div>

					{/* 桌面端工具栏：行内排序链接（筛选栏位于侧边栏）。 */}
					<div className="mb-8 hidden flex-wrap items-center gap-3 lg:flex">
						<span className="text-sm text-muted-foreground">Sort by:</span>
						<SortLinks options={sortOptions} active={filters} />
					</div>

					<ListingProducts basePath="/products" filters={filters} order={order} />
				</div>
			</div>
		</div>
	);
}
