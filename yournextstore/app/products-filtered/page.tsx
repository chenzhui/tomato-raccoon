import { ProductsView, productsMetadata } from "@/app/products/products-view";
import { activeParams, PRODUCT_LISTING_PARAMS } from "@/lib/listing-routes";

// 带有筛选条件、排序或页码的 `/products?…` 会被重写到此处（参见 lib/listing-routes.ts）。由于 query 参数
// 只有在请求时才能确定，因此页面在请求时完整渲染：导航跳转时会保持当前视图直至新内容就绪，无需骨架屏。
export const instant = false;

export async function generateMetadata(props: PageProps<"/products-filtered">) {
	const { page } = await props.searchParams;
	return productsMetadata(typeof page === "string" ? page : undefined);
}

export default async function ProductsFilteredPage(props: PageProps<"/products-filtered">) {
	return <ProductsView filters={activeParams(PRODUCT_LISTING_PARAMS, await props.searchParams)} />;
}
