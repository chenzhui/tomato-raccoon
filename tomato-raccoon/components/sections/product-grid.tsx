import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	/** 预先优先加载第一张卡片的图片。首屏下方的网格（如相关商品）关闭此项。 */
	eagerFirstImage?: boolean;
};

export async function ProductGrid({
	title = "Movement Bestsellers",
	description = "Every yard sign, tote, and sticker defends local Virginia soil & water",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D93829]/10 text-[#D93829] text-xs font-bold uppercase tracking-wider mb-2">
						★ Official Gear
					</div>
					<h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1E3F20]">{title}</h2>
					<p className="mt-2 text-[#524B42] text-sm sm:text-base ">{description}</p>
				</div>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-[#1E3F20] hover:text-[#D93829] transition-colors"
					>
						<span>Explore all goods</span>
						<ArrowRight className="h-4 w-4" />
					</Link>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={eagerFirstImage && index === 0} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center sm:hidden">
					<Link
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-sm font-bold text-[#1E3F20] hover:text-[#D93829] transition-colors"
					>
						<span>View all goods</span>
						<ArrowRight className="h-4 w-4" />
					</Link>
				</div>
			)}
		</section>
	);
}
