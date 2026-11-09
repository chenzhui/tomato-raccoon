import { ProductsView, productsMetadata } from "@/app/products/products-view";
import { SearchParamsProbe } from "@/components/search-params-probe";

// 默认视图从不读取 query 参数，因此可完整预渲染；筛选、排序和分页会通过
// `/products-filtered` 路由处理（参见 lib/listing-routes.ts）。探测探针（probe）引导客户端路由器在需要时向服务端请求这些数据。
export const generateMetadata = () => productsMetadata(undefined);

export default function ProductsPage(props: PageProps<"/products">) {
	return (
		<>
			<SearchParamsProbe searchParams={props.searchParams} />
			<ProductsView filters={{}} />
		</>
	);
}
