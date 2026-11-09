import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";

const EMPTY_FACETS = {
	priceBounds: { min: 0, max: 0 },
	variantTypes: [],
	categories: [],
	collections: [],
	brands: [],
} satisfies Awaited<ReturnType<typeof commerce.productFilters>>;

export async function getFilterFacets() {
	"use cache";
	cacheLife("minutes");
	// 筛选功能属于增强体验 —— 绝不能因获取分面失败而导致商品列表崩溃。
	try {
		return await commerce.productFilters();
	} catch {
		return EMPTY_FACETS;
	}
}

/** 列表是否包含可供筛选的项；分类页面会隐藏分类本身的分面。 */
export const hasFacets = (
	facets: Awaited<ReturnType<typeof getFilterFacets>>,
	{ categories = true }: { categories?: boolean } = {},
) =>
	(categories && facets.categories.length > 0) ||
	facets.collections.length > 0 ||
	facets.brands.length > 0 ||
	facets.variantTypes.length > 0 ||
	facets.priceBounds.max > 0;
