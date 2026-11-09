import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";

// 优先推荐商家指定的关联商品，其次推荐同类目商品。平台负责确定
// 排序顺序，并排除当前商品自身以及顾客当前无法购买的任何商品。
async function getRelatedProducts(productId: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productRelated({ idOrSlug: productId, limit: 6 });
	return data;
}

export function RelatedProducts(props: { productId: string }) {
	return (
		<Suspense>
			<RelatedProductsContent {...props} />
		</Suspense>
	);
}

async function RelatedProductsContent({ productId }: { productId: string }) {
	const related = await getRelatedProducts(productId);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			title="You might also like"
			description="More products to explore"
			products={related}
			showViewAll={false}
			eagerFirstImage={false}
		/>
	);
}
