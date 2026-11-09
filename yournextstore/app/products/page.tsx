import { ProductsView, productsMetadata } from "@/app/products/products-view";

export const generateMetadata = () => productsMetadata(undefined);

export default function ProductsPage() {
	return <ProductsView />;
}
