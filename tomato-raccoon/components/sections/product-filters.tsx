"use client";

import type { APIProductFiltersResult } from "commerce-kit";
import { SlidersHorizontalIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, startTransition, useOptimistic, useState } from "react";
import { useStoreConfig } from "@/components/store-config-provider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { FILTER_KEYS, toSearchParams } from "@/lib/listing-routes";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { encodeVts, parseVts } from "@/lib/vts";

// 由筛选器拥有的搜索参数，点击“全部清除”时会清空。

// 每个筛选组中最多显示的条目数，超出部分折叠在“显示更多”后。
const VISIBLE_ENTRY_LIMIT = 10;

/** 渲染筛选条目列表，截断至 `limit` 数量，并提供“显示更多”/“显示更少”切换功能。 */
function CollapsibleList<T>({
	items,
	className,
	renderItem,
	limit = VISIBLE_ENTRY_LIMIT,
}: {
	items: T[];
	className?: string;
	renderItem: (item: T) => ReactNode;
	limit?: number;
}) {
	const [expanded, setExpanded] = useState(false);
	const visible = expanded ? items : items.slice(0, limit);
	const hasMore = items.length > limit;

	return (
		<>
			<ul className={className}>{visible.map(renderItem)}</ul>
			{hasMore && (
				<button
					type="button"
					onClick={() => setExpanded((prev) => !prev)}
					className="mt-2 px-2 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
				>
					{expanded ? "Show less" : "Show more"}
				</button>
			)}
		</>
	);
}

type FilterControlsProps = {
	facets: APIProductFiltersResult;
	showCategories?: boolean;
	showCollections?: boolean;
};

/**
 * 列表页的已启用筛选器来自服务端（在静态默认视图中为空，在 `…-filtered` 路由中为查询参数，见 lib/listing-routes.ts），
 * 而非直接取自浏览器地址栏：控件保留在预渲染外壳中，无需使用 `useSearchParams()`。
 */
type ActiveFilters = { active: Record<string, string | undefined> };

function FilterControls({
	facets,
	showCategories = true,
	showCollections = true,
	active,
}: FilterControlsProps & ActiveFilters) {
	const { currency, locale } = useStoreConfig();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = toSearchParams(active);

	const selectedVts = parseVts(searchParams.get("vts"));
	const [optimisticVts, setOptimisticVts] = useOptimistic(selectedVts);

	// 已知限制：筛选接口以“净价”最小货币单位返回价格边界并匹配 priceMin/priceMax，
	// 没有对应的含税总价数据。因此在含税商店中，滑块显示的价格会略低于卡片上显示的价格。
	// 若在此将其转换为含税价，会导致滑块与 API 实际执行的查询不同步，
	// 因此在接口自身提供含税边界前，边界值仍保持净价。
	const { min: priceFloor, max: priceCeil } = facets.priceBounds;
	const priceMinParam = searchParams.get("priceMin");
	const priceMaxParam = searchParams.get("priceMax");
	const [priceRange, setPriceRange] = useState<[number, number]>([
		priceMinParam ? Number(priceMinParam) : priceFloor,
		priceMaxParam ? Number(priceMaxParam) : priceCeil,
	]);

	const commit = (mutate: (params: URLSearchParams) => void) => {
		const params = new URLSearchParams(searchParams.toString());
		mutate(params);
		// 任何筛选条件的改变都可能缩减结果集 —— 重置回第一页。
		params.delete("page");
		startTransition(() => {
			router.push(params.size ? `${pathname}?${params}` : pathname, { scroll: false });
		});
	};

	const setSingle = (key: string, value: string) => {
		commit((params) => {
			if (params.get(key) === value) {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		});
	};

	const toggleVariantValue = (label: string, value: string, checked: boolean) => {
		const current = optimisticVts[label] ?? [];
		const next = checked ? [...new Set([...current, value])] : current.filter((v) => v !== value);
		const nextRecord = { ...optimisticVts, [label]: next };
		startTransition(() => {
			setOptimisticVts(nextRecord);
			const encoded = encodeVts(nextRecord);
			commit((params) => {
				if (encoded) {
					params.set("vts", encoded);
				} else {
					params.delete("vts");
				}
			});
		});
	};

	const clearAll = () => {
		setPriceRange([priceFloor, priceCeil]);
		commit((params) => {
			for (const key of FILTER_KEYS) {
				params.delete(key);
			}
		});
	};

	const hasActiveFilters = FILTER_KEYS.some((key) => searchParams.has(key));
	const hasPrice = priceCeil > priceFloor;
	// 所有将要渲染的组（按显示顺序）—— 默认仅展开第一个组。
	const accordionGroups = [
		...(showCategories && facets.categories.length > 0 ? ["categories"] : []),
		...(showCollections && facets.collections.length > 0 ? ["collections"] : []),
		...facets.variantTypes.map((vt) => `vt-${vt.label}`),
		...(facets.brands.length > 0 ? ["brands"] : []),
		...(hasPrice ? ["price"] : []),
	];
	const accordionDefault = accordionGroups.slice(0, 1);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-medium text-foreground">Filters</h2>
				{hasActiveFilters && (
					<button
						type="button"
						onClick={clearAll}
						className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
					>
						Clear all
					</button>
				)}
			</div>

			<Accordion multiple defaultValue={accordionDefault} className="w-full">
				{showCategories && facets.categories.length > 0 && (
					<AccordionItem value="categories">
						<AccordionTrigger className="text-sm">Categories</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.categories}
								className="space-y-1"
								renderItem={(category) => {
									const isActive = searchParams.get("category") === category.slug;
									return (
										<li key={category.slug}>
											<button
												type="button"
												onClick={() => setSingle("category", category.slug)}
												className={cn(
													"w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
													isActive ? "font-medium text-foreground" : "text-muted-foreground",
												)}
											>
												{category.name}
											</button>
										</li>
									);
								}}
							/>
						</AccordionContent>
					</AccordionItem>
				)}

				{showCollections && facets.collections.length > 0 && (
					<AccordionItem value="collections">
						<AccordionTrigger className="text-sm">Collections</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.collections}
								className="space-y-1"
								renderItem={(collection) => {
									const isActive = searchParams.get("collection") === collection.slug;
									return (
										<li key={collection.slug}>
											<button
												type="button"
												onClick={() => setSingle("collection", collection.slug)}
												className={cn(
													"w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
													isActive ? "font-medium text-foreground" : "text-muted-foreground",
												)}
											>
												{collection.name}
											</button>
										</li>
									);
								}}
							/>
						</AccordionContent>
					</AccordionItem>
				)}

				{facets.variantTypes.map((vt) => {
					const selectedValues = optimisticVts[vt.label] ?? [];
					return (
						<AccordionItem key={vt.label} value={`vt-${vt.label}`}>
							<AccordionTrigger className="text-sm">{vt.label}</AccordionTrigger>
							<AccordionContent>
								<CollapsibleList
									items={vt.values}
									className="space-y-2"
									renderItem={(value) => {
										// 不包含空格：复选框通过 aria-labelledby（以空格分隔的 id 列表）命名自身，
										// 若包含空格（如 "Dual Color"）会导致指向两个 id 而使其失去正确名称。
										const id = `${vt.label}-${value}`.replace(/\s+/g, "-");
										const checked = selectedValues.includes(value);
										return (
											<li key={value} className="flex items-center gap-2">
												<Checkbox
													id={id}
													checked={checked}
													onCheckedChange={(state) => toggleVariantValue(vt.label, value, state === true)}
												/>
												<label htmlFor={id} className="cursor-pointer text-sm text-muted-foreground">
													{value}
												</label>
											</li>
										);
									}}
								/>
							</AccordionContent>
						</AccordionItem>
					);
				})}

				{facets.brands.length > 0 && (
					<AccordionItem value="brands">
						<AccordionTrigger className="text-sm">Brands</AccordionTrigger>
						<AccordionContent>
							<CollapsibleList
								items={facets.brands}
								className="space-y-1"
								renderItem={(brand) => {
									const isActive = searchParams.get("brand") === brand.slug;
									return (
										<li key={brand.slug}>
											<button
												type="button"
												onClick={() => setSingle("brand", brand.slug)}
												className={cn(
													"w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary",
													isActive ? "font-medium text-foreground" : "text-muted-foreground",
												)}
											>
												{brand.name}
											</button>
										</li>
									);
								}}
							/>
						</AccordionContent>
					</AccordionItem>
				)}

				{hasPrice && (
					<AccordionItem value="price">
						<AccordionTrigger className="text-sm">Price</AccordionTrigger>
						<AccordionContent>
							<div className="px-1 pt-2">
								<Slider
									value={priceRange}
									min={priceFloor}
									max={priceCeil}
									step={1}
									minStepsBetweenValues={1}
									onValueChange={(value) => setPriceRange(value as [number, number])}
									onValueCommitted={(value) => {
										const [min, max] = value as [number, number];
										commit((params) => {
											if (min <= priceFloor) {
												params.delete("priceMin");
											} else {
												params.set("priceMin", String(min));
											}
											if (max >= priceCeil) {
												params.delete("priceMax");
											} else {
												params.set("priceMax", String(max));
											}
										});
									}}
								/>
								<div className="mt-3 flex justify-between text-xs text-muted-foreground">
									<span>{formatMoney({ amount: priceRange[0], currency, locale })}</span>
									<span>{formatMoney({ amount: priceRange[1], currency, locale })}</span>
								</div>
							</div>
						</AccordionContent>
					</AccordionItem>
				)}
			</Accordion>
		</div>
	);
}

/** 桌面端侧边栏筛选器（在小屏幕上隐藏 —— 小屏请使用 `ProductFiltersMobile`）。 */
export function ProductFilters({
	className,
	...props
}: FilterControlsProps & ActiveFilters & { className?: string }) {
	return (
		<aside className={cn("hidden lg:block", className)}>
			<FilterControls {...props} />
		</aside>
	);
}

/** 移动端筛选器触发按钮 + 抽屉弹层（在大屏幕上隐藏）。 */
export function ProductFiltersMobile(props: FilterControlsProps & ActiveFilters) {
	const searchParams = toSearchParams(props.active);
	const activeCount = FILTER_KEYS.filter((key) => searchParams.has(key)).length;

	return (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" size="sm" className="lg:hidden" />}>
				<SlidersHorizontalIcon className="size-4" />
				Filters
				{activeCount > 0 && (
					<span className="ml-1 rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
						{activeCount}
					</span>
				)}
			</SheetTrigger>
			<SheetContent
				side="left"
				className="overflow-y-auto data-[side=left]:w-[85vw] data-[side=left]:max-w-sm"
			>
				<SheetHeader>
					<SheetTitle>Filters</SheetTitle>
					<SheetDescription className="sr-only">Refine the product list</SheetDescription>
				</SheetHeader>
				<div className="px-4 pb-8">
					<FilterControls {...props} />
				</div>
			</SheetContent>
		</Sheet>
	);
}
