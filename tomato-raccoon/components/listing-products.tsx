import { cacheLife } from "next/cache";
import { ListingPagination } from "@/components/listing-pagination";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import type { ProductListingParams } from "@/lib/listing-routes";

const PRODUCTS_PER_PAGE = 12;

type ListingQuery = {
	filters: ProductListingParams;
	/** 分类页面的固定分类；在 `/products` 页面上则来自于筛选参数。 */
	category?: string;
	order?: { orderBy: "createdAt" | "price" | "name" | "featured"; orderDirection: "asc" | "desc" };
};

/** 列表页的单页数据。已缓存，因此视图可以在请求分面数据的同时发起此请求，而商品网格读取的是同一个缓存条目。 */
export async function getListingPage({ filters, category, order }: ListingQuery) {
	"use cache";
	cacheLife("minutes");
	const currentPage = Math.max(1, Number(filters.page) || 1);
	const result = await commerce.productBrowse({
		active: true,
		limit: PRODUCTS_PER_PAGE,
		offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
		...order,
		category: category ?? filters.category,
		collection: filters.collection,
		brand: filters.brand,
		priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
		priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
		vts: filters.vts,
	});
	return { currentPage, result, totalPages: Math.ceil(result.meta.count / PRODUCTS_PER_PAGE) };
}

/** `/products` 页面与分类页面共享的商品网格及分页组件。 */
export async function ListingProducts({ basePath, ...query }: ListingQuery & { basePath: string }) {
	const { currentPage, result, totalPages } = await getListingPage(query);

	if (result.data.length === 0) {
		return (
			<div className="py-24 text-center">
				<p className="text-lg text-muted-foreground">No products match these filters.</p>
			</div>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
				{result.data.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
			<ListingPagination
				basePath={basePath}
				currentPage={currentPage}
				totalPages={totalPages}
				filters={query.filters}
			/>
		</>
	);
}
