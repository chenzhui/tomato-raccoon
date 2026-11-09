"use client";

import { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { QuickAddButton } from "@/components/quick-add-button";
import { Sparkles, SlidersHorizontal, ArrowUpDown, X, RotateCcw } from "lucide-react";

export type ExplorerProduct = {
	id: string;
	slug: string;
	name: string;
	description: string;
	tagline?: string;
	summary?: string;
	images: string[];
	category: string;
	characterKey?: string;
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

// 大模型形象列表定义
export const CHARACTERS = [
	{ key: "all", label: "✨ All Models", color: "from-neutral-900 to-neutral-700" },
	{ key: "whale-chan", label: "🐳 Whale-Chan (R1)", color: "from-sky-500 to-blue-600" },
	{ key: "sonnet-tan", label: "📙 Sonnet-Tan (3.5)", color: "from-amber-500 to-orange-600" },
	{ key: "omni-chan", label: "🔮 Omni-Chan (4o)", color: "from-purple-500 to-indigo-600" },
	{ key: "rebel-tan", label: "⚔️ Rebel-Tan (X)", color: "from-rose-500 to-red-600" },
	{ key: "twinstar-chan", label: "⭐ TwinStar-Chan (2M)", color: "from-blue-500 to-cyan-600" },
	{ key: "bundle", label: "🎁 All-Stars Sets", color: "from-neutral-800 to-black" },
] as const;

// 核心品类列表定义
export const CATEGORIES = [
	{ key: "all", label: "All Gear", emoji: "⚡" },
	{ key: "Standees", label: "Acrylic Standees", sub: "立牌", emoji: "💎" },
	{ key: "Keycaps", label: "Artisan Keycaps", sub: "键帽", emoji: "⌨️" },
	{ key: "Plushies", label: "Plushies & Dangos", sub: "毛绒玩偶", emoji: "🧸" },
	{ key: "Desk Mats", label: "XL Desk Mats", sub: "鼠标垫", emoji: "🖱️" },
] as const;

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export function ProductsExplorer({
	initialProducts,
	initialCategory = "all",
	initialCharacter = "all",
}: {
	initialProducts: ExplorerProduct[];
	initialCategory?: string;
	initialCharacter?: string;
}) {
	const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
	const [selectedCharacter, setSelectedCharacter] = useState<string>(initialCharacter);
	const [sortBy, setSortBy] = useState<SortOption>("featured");
	const [isPending, startTransition] = useTransition();

	// 动态联动筛选计算
	const filteredProducts = useMemo(() => {
		let list = initialProducts.filter((product) => {
			const matchesCategory =
				selectedCategory === "all" ||
				product.category.toLowerCase() === selectedCategory.toLowerCase() ||
				product.category.toLowerCase().replace(/\s+/g, "-") === selectedCategory.toLowerCase();

			const matchesCharacter =
				selectedCharacter === "all" ||
				(product.characterKey && product.characterKey.toLowerCase() === selectedCharacter.toLowerCase());

			return matchesCategory && matchesCharacter;
		});

		// 排序处理
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
	}, [initialProducts, selectedCategory, selectedCharacter, sortBy]);

	// 重置所有筛选
	const handleResetFilters = () => {
		startTransition(() => {
			setSelectedCategory("all");
			setSelectedCharacter("all");
		});
	};

	const hasActiveFilter = selectedCategory !== "all" || selectedCharacter !== "all";

	return (
		<div className="space-y-10">
			{/* 双层极简药丸筛选导航区 (Apple Style Dual Filter) */}
			<div className="space-y-5 p-6 rounded-3xl bg-[#F5F5F7] border border-neutral-200/80">
				{/* 维度 1：大模型形象筛选 */}
				<div className="space-y-2.5">
					<div className="flex items-center justify-between">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
							1. Filter by Model (选择大模型形象)
						</span>
						{selectedCharacter !== "all" && (
							<button
								type="button"
								onClick={() => setSelectedCharacter("all")}
								className="text-[11px] text-neutral-400 hover:text-black flex items-center gap-1 transition-colors"
							>
								<X className="w-3 h-3" /> Reset Character
							</button>
						)}
					</div>
					<div className="flex flex-wrap items-center gap-2">
						{CHARACTERS.map((char) => {
							const isActive = selectedCharacter === char.key;
							return (
								<button
									key={char.key}
									type="button"
									onClick={() => setSelectedCharacter(char.key)}
									className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
										isActive
											? "bg-black text-white shadow-xs scale-102"
											: "bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-200/60"
									}`}
								>
									<span>{char.label}</span>
								</button>
							);
						})}
					</div>
				</div>

				{/* 分割线 */}
				<div className="h-px bg-neutral-200/60" />

				{/* 维度 2：选品分类筛选 */}
				<div className="space-y-2.5">
					<div className="flex items-center justify-between">
						<span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
							2. Filter by Category (选择周边品类)
						</span>
						{selectedCategory !== "all" && (
							<button
								type="button"
								onClick={() => setSelectedCategory("all")}
								className="text-[11px] text-neutral-400 hover:text-black flex items-center gap-1 transition-colors"
							>
								<X className="w-3 h-3" /> Reset Category
							</button>
						)}
					</div>
					<div className="flex flex-wrap items-center gap-2">
						{CATEGORIES.map((cat) => {
							const isActive = selectedCategory === cat.key;
							return (
								<button
									key={cat.key}
									type="button"
									onClick={() => setSelectedCategory(cat.key)}
									className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
										isActive
											? "bg-black text-white shadow-xs scale-102"
											: "bg-white text-neutral-700 hover:text-black hover:bg-neutral-100 border border-neutral-200/60"
									}`}
								>
									<span>{cat.emoji}</span>
									<span>{cat.label}</span>
									{"sub" in cat && (
										<span
											className={`text-[10px] ml-0.5 ${
												isActive ? "text-neutral-400" : "text-neutral-400"
											}`}
										>
											{cat.sub}
										</span>
									)}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* 状态与排序工具栏 */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80">
				<div className="flex items-center gap-3">
					<span className="text-sm font-medium text-neutral-900">
						{filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"} found
					</span>

					{hasActiveFilter && (
						<button
							type="button"
							onClick={handleResetFilters}
							className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-500 hover:text-black bg-neutral-100 hover:bg-neutral-200 transition-colors cursor-pointer"
						>
							<RotateCcw className="w-3 h-3" />
							<span>Clear all filters</span>
						</button>
					)}
				</div>

				{/* 排序选择 */}
				<div className="flex items-center gap-2">
					<span className="text-xs text-neutral-500 flex items-center gap-1">
						<ArrowUpDown className="w-3.5 h-3.5" /> Sort:
					</span>
					<select
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value as SortOption)}
						aria-label="Sort products"
						className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#F5F5F7] border border-neutral-200 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
					>
						<option value="featured">Featured (精选推荐)</option>
						<option value="price-asc">Price: Low to High (价格从低到高)</option>
						<option value="price-desc">Price: High to Low (价格从高到低)</option>
						<option value="name">Name: A–Z (按名称排序)</option>
					</select>
				</div>
			</div>

			{/* 商品网格 (Products Grid) */}
			{filteredProducts.length === 0 ? (
				<div className="py-20 text-center space-y-4 rounded-3xl bg-[#F5F5F7]/50 border border-dashed border-neutral-200">
					<div className="w-12 h-12 rounded-2xl bg-white mx-auto flex items-center justify-center text-neutral-400 shadow-xs">
						<SlidersHorizontal className="w-5 h-5" />
					</div>
					<div>
						<h3 className="text-base font-medium text-neutral-900">No products match this filter combination</h3>
						<p className="mt-1 text-xs text-neutral-500">
							We don't have this exact character + category combination yet. Try selecting another model or gear.
						</p>
					</div>
					<button
						type="button"
						onClick={handleResetFilters}
						className="px-4 py-2 rounded-xl text-xs font-medium bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer"
					>
						View All Products
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
					{filteredProducts.map((product) => {
						const primaryVariant = product.variants[0];
						const priceNumber = primaryVariant ? Number.parseInt(primaryVariant.price, 10) / 100 : 0;
						const originalPriceNumber = primaryVariant?.originalPrice
							? Number.parseInt(primaryVariant.originalPrice, 10) / 100
							: null;
						const primaryImage = product.images[0] || "/images/characters/whale-chan-badge.png";

						// 格式化角色标签名
						const characterObj = CHARACTERS.find((c) => c.key === product.characterKey);
						const characterLabel = characterObj ? characterObj.label.split(" ")[1] || characterObj.label : "";

						return (
							<div
								key={product.id}
								className="group flex flex-col justify-between rounded-3xl bg-white border border-neutral-200/80 hover:border-neutral-300 transition-all overflow-hidden p-3 hover:shadow-xs"
							>
								{/* 商品图片展示区 */}
								<div className="relative aspect-square w-full rounded-2xl bg-[#F5F5F7] overflow-hidden flex items-center justify-center p-6">
									{/* 左上角双标签：角色 + 品类 */}
									<div className="absolute top-2.5 left-2.5 z-10 flex flex-wrap gap-1">
										{characterLabel && (
											<span className="px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-semibold text-neutral-800 shadow-xs backdrop-blur-xs">
												{characterLabel}
											</span>
										)}
										<span className="px-2 py-0.5 rounded-md bg-neutral-900/80 text-[10px] font-medium text-white shadow-xs backdrop-blur-xs">
											{product.category}
										</span>
									</div>

									{/* 快捷加入购物车按钮 (右上角) */}
									{primaryVariant && (
										<div className="absolute top-2.5 right-2.5 z-10">
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

									{/* 商品主图 */}
									<Link href={`/product/${product.slug}`} className="relative w-full h-full flex items-center justify-center">
										<div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
											<Image
												src={primaryImage}
												alt={product.name}
												fill
												sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
												className="object-contain"
											/>
										</div>
									</Link>
								</div>

								{/* 商品信息与价格 */}
								<div className="mt-3.5 px-1.5 pb-1 space-y-2">
									<Link href={`/product/${product.slug}`}>
										<h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-1">
											{product.name}
										</h3>
									</Link>

									<p className="text-[11px] text-neutral-400 line-clamp-1 font-normal">
										{product.summary || product.tagline || product.description}
									</p>

									<div className="pt-1 flex items-baseline justify-between">
										<div className="flex items-baseline gap-2">
											<span className="text-sm font-semibold text-neutral-900">
												${priceNumber.toFixed(2)}
											</span>
											{originalPriceNumber && originalPriceNumber > priceNumber && (
												<span className="text-xs text-neutral-400 line-through">
													${originalPriceNumber.toFixed(2)}
												</span>
											)}
										</div>
										<Link
											href={`/product/${product.slug}`}
											className="text-[11px] font-medium text-neutral-500 hover:text-black transition-colors"
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
