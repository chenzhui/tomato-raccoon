"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { QuickAddButton } from "@/components/quick-add-button";
import { Sparkles, ArrowUpDown, X, RotateCcw, ShieldCheck, Heart } from "lucide-react";

export type ExplorerProduct = {
	id: string;
	slug: string;
	name: string;
	description: string;
	tagline?: string;
	summary?: string;
	images: string[];
	category: string;
	variants: Array<{
		id: string;
		name: string;
		price: string;
		originalPrice?: string;
		stock?: number;
		images: string[];
		sku?: string;
	}>;
};

// 运动周边品类列表定义
export const MOVEMENT_CATEGORIES = [
	{ key: "all", label: "All Movement Gear", emoji: "🌱" },
	{ key: "Apparel", label: "Heritage Apparel", sub: "Tees & Hoodies", emoji: "👕" },
	{ key: "Signs", label: "Lawn Yard Signs", sub: "Yard Signs", emoji: "🪧" },
	{ key: "Stickers", label: "Vinyl Stickers", sub: "Vinyl Decals", emoji: "🏷️" },
] as const;

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export function ProductsExplorer({
	initialProducts,
	initialCategory = "all",
}: {
	initialProducts: ExplorerProduct[];
	initialCategory?: string;
}) {
	const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
	const [sortBy, setSortBy] = useState<SortOption>("featured");
	const [isPending, startTransition] = useTransition();

	// 动态品类筛选与排序计算
	const filteredProducts = useMemo(() => {
		let list = initialProducts.filter((product) => {
			if (selectedCategory === "all") return true;
			return (
				product.category.toLowerCase() === selectedCategory.toLowerCase() ||
				product.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory.toLowerCase()
			);
		});

		// 排序逻辑
		if (sortBy === "price-asc") {
			list = [...list].sort((a, b) => {
				const priceA = Number.parseInt(a.variants[0]?.price || "0", 10);
				const priceB = Number.parseInt(b.variants[0]?.price || "0", 10);
				return priceA - priceB;
			});
		} else if (sortBy === "price-desc") {
			list = [...list].sort((a, b) => {
				const priceA = Number.parseInt(a.variants[0]?.price || "0", 10);
				const priceB = Number.parseInt(b.variants[0]?.price || "0", 10);
				return priceB - priceA;
			});
		} else if (sortBy === "name") {
			list = [...list].sort((a, b) => a.name.localeCompare(b.name));
		}

		return list;
	}, [initialProducts, selectedCategory, sortBy]);

	const handleReset = () => {
		startTransition(() => {
			setSelectedCategory("all");
		});
	};

	return (
		<div className="space-y-10">
			{/* 胶囊药丸品类导航栏 (Vintage Heritage Pill Bar) */}
			<div className="p-4 sm:p-5 rounded-3xl bg-[#F4EFE6] border border-[#D9CDB8] shadow-2xs">
				<div className="flex items-center justify-between mb-3 px-1">
					<span className="text-[11px] font-bold uppercase tracking-wider text-[#7C5335]">
						Select Movement Category
					</span>
					{selectedCategory !== "all" && (
						<button
							type="button"
							onClick={handleReset}
							className="text-[11px] font-bold text-[#D93829] hover:underline flex items-center gap-1 cursor-pointer"
						>
							<X className="w-3 h-3" /> Show All
						</button>
					)}
				</div>
				<div className="flex flex-wrap items-center gap-2">
					{MOVEMENT_CATEGORIES.map((cat) => {
						const isActive = selectedCategory === cat.key;
						return (
							<button
								key={cat.key}
								type="button"
								onClick={() => setSelectedCategory(cat.key)}
								className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shadow-2xs ${
									isActive
										? "bg-[#1E3F20] text-[#FAF7F0] shadow-sm scale-102"
										: "bg-[#FDFBF7] text-[#1E1D1B] hover:bg-[#EAE4D7] border border-[#D9CDB8]"
								}`}
							>
								<span>{cat.emoji}</span>
								<span>{cat.label}</span>
								{"sub" in cat && (
									<span className={`text-[10px] ml-0.5 ${isActive ? "text-[#E8B923]" : "text-[#7C5335]"}`}>
										({cat.sub})
									</span>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* 状态栏与排序 */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9CDB8]">
				<div className="flex items-center gap-3">
					<span className="text-sm font-bold text-[#1E3F20]">
						{filteredProducts.length} {filteredProducts.length === 1 ? "Item" : "Items"} in Catalog
					</span>
					{selectedCategory !== "all" && (
						<button
							type="button"
							onClick={handleReset}
							className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold text-[#7C5335] bg-[#EAE4D7] hover:bg-[#D9CDB8] transition-colors cursor-pointer"
						>
							<RotateCcw className="w-3 h-3" />
							<span>Reset filter</span>
						</button>
					)}
				</div>

				<div className="flex items-center gap-2">
					<span className="text-xs text-[#7C5335] font-bold flex items-center gap-1">
						<ArrowUpDown className="w-3.5 h-3.5" /> Sort:
					</span>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as SortOption)}
						aria-label="Sort products"
						className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#F4EFE6] border border-[#D9CDB8] text-[#1E1D1B] focus:outline-none focus:ring-1 focus:ring-[#1E3F20] cursor-pointer"
					>
						<option value="featured">Movement Priority (Featured)</option>
						<option value="price-asc">Price: Low to High</option>
						<option value="price-desc">Price: High to Low</option>
						<option value="name">Name: A–Z</option>
					</select>
				</div>
			</div>

			{/* 商品展示网格 */}
			{filteredProducts.length === 0 ? (
				<div className="py-20 text-center space-y-4 rounded-3xl bg-[#F4EFE6]/50 border border-dashed border-[#D9CDB8]">
					<div className="w-12 h-12 rounded-2xl bg-white mx-auto flex items-center justify-center text-[#7C5335] shadow-xs">
						🌱
					</div>
					<div>
						<h3 className="text-base font-bold text-[#1E1D1B]">No goods found in this category</h3>
						<p className="mt-1 text-xs text-[#524B42] ">
							Try switching to another movement category to see our handcrafted items.
						</p>
					</div>
					<button
						type="button"
						onClick={handleReset}
						className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#1E3F20] text-[#FAF7F0] hover:bg-[#2D5A27] transition-colors cursor-pointer"
					>
						View All Goods
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
					{filteredProducts.map((product) => {
						const primaryVariant = product.variants[0];
						const priceNumber = primaryVariant ? Number.parseInt(primaryVariant.price, 10) / 100 : 0;
						const originalPriceNumber = primaryVariant?.originalPrice
							? Number.parseInt(primaryVariant.originalPrice, 10) / 100
							: null;
						const primaryImage = product.images[0] || "/images/mascot-badge.svg";

						return (
							<div
								key={product.id}
								className="group flex flex-col justify-between rounded-3xl bg-[#FDFBF7] border border-[#E5DDD0] hover:border-[#1E3F20]/50 transition-all overflow-hidden p-4 shadow-2xs hover:shadow-xs"
							>
								{/* 商品图片展示区 */}
								<div className="relative aspect-square w-full rounded-2xl bg-[#F4EFE6] overflow-hidden flex items-center justify-center p-6">
									{/* 左上角品类标签 */}
									<div className="absolute top-3 left-3 z-10">
										<span className="px-2.5 py-1 rounded-md bg-[#1E3F20] text-[10px] font-bold text-[#FAF7F0] shadow-xs">
											{product.category}
										</span>
									</div>

									{/* 快捷加购按钮 */}
									{primaryVariant && (
										<div className="absolute top-3 right-3 z-10">
											<QuickAddButton
												variantId={primaryVariant.id}
												variantSku={primaryVariant.sku || null}
												variantPrice={primaryVariant.price}
												variantImages={primaryVariant.images || [primaryImage]}
												product={{
													id: product.id,
													name: product.name,
													slug: product.slug,
													images: product.images,
												}}
											/>
										</div>
									)}

									{/* 主图链接 */}
									<Link href={`/product/${product.slug}`} className="relative w-full h-full flex items-center justify-center">
										<div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
											<Image
												src={primaryImage}
												alt={product.name}
												fill
												sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
												className="object-contain"
											/>
										</div>
									</Link>
								</div>

								{/* 商品标题与价格 */}
								<div className="mt-4 px-1 pb-1 space-y-2">
									<Link href={`/product/${product.slug}`}>
										<h3 className="text-base font-bold text-[#1E1D1B] group-hover:text-[#1E3F20] transition-colors line-clamp-1">
											{product.name}
										</h3>
									</Link>

									<p className="text-xs text-[#524B42] line-clamp-1 font-normal">
										{product.summary || product.tagline || product.description}
									</p>

									<div className="pt-2 flex items-baseline justify-between border-t border-[#E5DDD0]/80">
										<div className="flex items-baseline gap-2">
											<span className="text-base font-black text-[#1E3F20]">
												${priceNumber.toFixed(2)}
											</span>
											{originalPriceNumber && originalPriceNumber > priceNumber && (
												<span className="text-xs text-[#8C5A2B] line-through ">
													${originalPriceNumber.toFixed(2)}
												</span>
											)}
										</div>
										<Link
											href={`/product/${product.slug}`}
											className="text-xs font-bold text-[#D93829] hover:underline"
										>
											Details &rarr;
										</Link>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
