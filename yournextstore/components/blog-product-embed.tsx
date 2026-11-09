import type { APIProductGetByIdResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

type FullProduct = NonNullable<APIProductGetByIdResult>;

/** 仅保留指定的推荐变体（其价格、图片、快速添加）；未知 id 则保留完整商品的全部变体。 */
const featuredVariantOnly = (product: FullProduct, variantId: string | undefined): FullProduct => {
	const variant = variantId ? product.variants.find((v) => v.id === variantId) : undefined;
	return variant ? { ...product, variants: [variant] } : product;
};

/** 编辑器存储商品 id（以及可选的 productId → variantId 映射）；店面前端对其进行解析。 */
export async function BlogProductEmbed({
	productIds,
	variantIds = {},
}: {
	productIds: string[];
	variantIds?: Record<string, string>;
}) {
	"use cache";
	cacheLife("minutes");

	const products = (await Promise.all(productIds.map((id) => commerce.productGet({ idOrSlug: id }))))
		.filter((product): product is FullProduct => product !== null && product.status === "published")
		.map((product) => featuredVariantOnly(product, variantIds[product.id]));

	if (products.length === 0) {
		return null;
	}

	return (
		<div className="not-prose clear-both my-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
