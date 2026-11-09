"use client";

import type { APIProductGetByIdResult } from "commerce-kit";
import { CheckIcon, MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { addBundleToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { useStoreConfig } from "@/components/store-config-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import { displayAmount, displayPrice, type TaxBehavior } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Bundle = NonNullable<APIProductGetByIdResult["bundle"]>;
type Group = Bundle["groups"][number];
type GroupItem = Group["items"][number];

// 每个变体所选择的数量，按分组作用域划分
type GroupSelections = Record<string, Record<string, number>>;

// 商品上的原始捆绑包定价字段 (commerce-kit 0.50)。`discountPercentage` 已经存在于
// 规范的 `bundle` 对象上；模式 + 固定金额/减免金额数值目前暂存于商品对象上。
// 待办：将 priceMode/fixedPriceAmount/amountOffAmount（及其含税孪生字段）合并到
// `serializeBundleForApi` 中，并直接从 `product.bundle` 读取，而非读取原始字段 —— 参见 YNS-1449。
type Pricing = {
	mode: "fixed" | "percent" | "amount";
	fixedPriceAmount: string | null;
	fixedPriceAmountGross: string | null;
	amountOffAmount: string | null;
	amountOffAmountGross: string | null;
};

// 预览总价（最小货币单位），按照顾客看到的计税口径计算：对于含税店铺，
// `sum` 本身已经是含税毛额，因此固定价/减免额操作数必须与其匹配。
// 购物车返回结果具有权威性；此处同步核心计算模式，使固定价格和满减捆绑包在商详页上不直接显示所有组件的总和。
const priceTotal = (
	sum: bigint,
	pricing: Pricing,
	discountPercentage: number | null,
	taxBehavior: TaxBehavior,
): bigint => {
	if (pricing.mode === "fixed") {
		const fixed = displayAmount(pricing.fixedPriceAmount, pricing.fixedPriceAmountGross, taxBehavior);
		return fixed != null ? BigInt(fixed) : sum;
	}
	if (pricing.mode === "amount") {
		const off = BigInt(
			displayAmount(pricing.amountOffAmount, pricing.amountOffAmountGross, taxBehavior) ?? "0",
		);
		return sum > off ? sum - off : 0n;
	}
	// 百分比折扣：核心服务存储 percent × 1000，因此 pct/100 转换为 (sum × round(pct×1000)) / 100000。
	// 比例计算不需要毛额镜像 —— 按比例缩放毛额总和直接得出折后毛额总计。
	const pct = discountPercentage ?? 0;
	return pct > 0 ? sum - (sum * BigInt(Math.round(pct * 1000))) / 100_000n : sum;
};

const groupTotal = (sel: Record<string, number> | undefined) =>
	sel ? Object.values(sel).reduce((sum, q) => sum + q, 0) : 0;

const initialSelections = (groups: Group[]): GroupSelections => {
	const out: GroupSelections = {};
	for (const group of groups) {
		const inner: Record<string, number> = {};
		for (const item of group.items) {
			if (item.forced) inner[item.variantId] = item.fixedQuantity;
			else if (item.defaultSelected) inner[item.variantId] = 1;
		}
		out[group.id] = inner;
	}
	return out;
};

export function BundleBuilder({
	bundleId,
	bundle,
	pricing,
}: {
	bundleId: string;
	bundle: Bundle;
	pricing: Pricing;
}) {
	const { groups, discountPercentage } = bundle;
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { openCart, syncCart } = useCart();

	const [selections, setSelections] = useState<GroupSelections>(() => initialSelections(groups));
	const [isAdding, setIsAdding] = useState(false);

	const itemByVariant = new Map<string, GroupItem>(
		groups.flatMap((group) => group.items.map((item) => [`${group.id}:${item.variantId}`, item] as const)),
	);

	const setQuantity = (groupId: string, variantId: string, next: number) => {
		setSelections((prev) => {
			const group = { ...(prev[groupId] ?? {}) };
			if (next <= 0) delete group[variantId];
			else group[variantId] = next;
			return { ...prev, [groupId]: group };
		});
	};

	// 单选分组（严格只能选一个）：选择新项目会直接替换当前已选项目。
	const pickRadio = (group: Group, variantId: string) => {
		setSelections((prev) => ({ ...prev, [group.id]: { [variantId]: 1 } }));
	};

	// 仅用于预览 —— 最终（含税）价格以购物车返回为准。组件价格与
	// 固定价/满减定价字段均带有毛额对应项，因此含税店铺在整个过程中均能以含税价预览捆绑包。
	const originalTotal = groups
		.flatMap((group) =>
			Object.entries(selections[group.id] ?? {}).map(([variantId, quantity]) => {
				const item = quantity > 0 ? itemByVariant.get(`${group.id}:${variantId}`) : undefined;
				return item ? BigInt(displayPrice(item.variant, taxBehavior)) * BigInt(quantity) : 0n;
			}),
		)
		.reduce((sum, line) => sum + line, 0n);
	const total = priceTotal(originalTotal, pricing, discountPercentage, taxBehavior);

	const hasSavings = total < originalTotal;

	const unmetGroup = groups.find((group) => groupTotal(selections[group.id]) < group.minQuantity);
	const hasAnySelection = groups.some((group) => groupTotal(selections[group.id]) > 0);
	const canAdd = !unmetGroup && hasAnySelection;

	const handleAddToCart = async () => {
		if (unmetGroup) {
			toast.error(`Select at least ${unmetGroup.minQuantity} from ${unmetGroup.name ?? "each group"}`);
			return;
		}
		setIsAdding(true);
		try {
			const payload = groups.flatMap((group) =>
				Object.entries(selections[group.id] ?? {})
					.filter(([, quantity]) => quantity > 0)
					.map(([variantId, quantity]) => ({ variantId, groupId: group.id, quantity })),
			);
			const result = await addBundleToCart(bundleId, payload);
			if (!result.success) {
				toast.error(result.error ?? "Could not add to cart");
				return;
			}
			syncCart(result.cart);
			openCart();
			toast.success("Bundle added to cart");
		} catch (error) {
			console.error("Failed to add bundle to cart:", error);
			toast.error("Failed to add to cart");
		} finally {
			setIsAdding(false);
		}
	};

	return (
		<div className="grid gap-8">
			{groups.map((group) => {
				const inner = selections[group.id] ?? {};
				const picked = groupTotal(inner);
				const isRadio = group.maxQuantity === 1 && !group.allowDuplicates;
				const atGroupMax = group.maxQuantity != null && picked >= group.maxQuantity;
				const isForcedGroup = group.items.every((i) => i.forced);
				// “色卡分组（swatch group）”指同一商品的不同变体之间的选择（例如不同颜色）：
				// 使用其变体值标记选项，而不是重复显示商品名称。由不同独立商品组成的分组则保留各自的商品名称。
				const isSwatchGroup =
					group.items.length > 1 && new Set(group.items.map((i) => i.variant.productSlug)).size === 1;

				return (
					<section key={group.id} className="grid gap-3">
						<div className="flex items-baseline justify-between gap-3">
							<h3 className="font-semibold text-lg">
								{group.name ?? (isForcedGroup ? "Included" : "Choose your items")}
							</h3>
							{!isForcedGroup && group.maxQuantity != null && (
								<span className="shrink-0 text-muted-foreground text-sm">
									Selected {picked} of {group.maxQuantity}
								</span>
							)}
						</div>

						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
							{group.items.map((item) => {
								const qty = inner[item.variantId] ?? 0;
								const selected = qty > 0;
								const image = item.variant.images[0] ?? item.variant.productImages[0];
								const stock = item.variant.stock;
								const outOfStock = stock != null && stock <= 0;
								// 在不允许重复选购时，每个选项上限为 1 件（不同挑选）；
								// 允许重复时唯一的上限是分组总数限制。与后台编辑器规则一致。
								const itemCap = item.maxQuantity ?? (group.allowDuplicates ? Number.POSITIVE_INFINITY : 1);
								const canIncrement =
									!item.forced &&
									!outOfStock &&
									qty < itemCap &&
									(stock == null || qty < stock) &&
									!atGroupMax;
								// 变体规格值（例如 "炭黑色"）。在色卡分组中它们作为卡片标题；
								// 颜色选项还会渲染一个色卡圆点。兼容尚未返回 options 的旧版 API 部署（版本偏差防范）。
								const options = item.variant.options ?? [];
								const optionText = options.map((o) => o.value).join(" / ");
								const swatchColor = options.find((o) => o.colorValue)?.colorValue ?? null;
								const label = isSwatchGroup && optionText ? optionText : item.variant.productName;

								return (
									<div
										key={item.variantId}
										className={cn(
											"relative flex flex-col overflow-hidden rounded-xl border bg-card transition-colors",
											selected ? "border-primary ring-1 ring-primary" : "border-border",
											outOfStock && "opacity-50",
										)}
									>
										{selected && (
											<span className="absolute left-2 top-2 z-10 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
												<CheckIcon className="size-4" />
											</span>
										)}

										<button
											type="button"
											disabled={item.forced || outOfStock || (isRadio ? false : !selected && atGroupMax)}
											onClick={() => {
												if (item.forced || outOfStock) return;
												if (isRadio) pickRadio(group, item.variantId);
												else setQuantity(group.id, item.variantId, selected ? 0 : 1);
											}}
											className="flex flex-1 flex-col gap-2 p-2 text-left disabled:cursor-not-allowed"
										>
											<div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
												{image ? (
													<Image
														src={image}
														alt={label}
														width={160}
														height={160}
														className="size-full object-cover"
													/>
												) : null}
											</div>
											<span className="flex items-center gap-1.5 font-medium text-sm">
												{swatchColor && (
													<span
														aria-hidden
														className="inline-block size-3 shrink-0 rounded-full border border-border"
														style={{ backgroundColor: swatchColor }}
													/>
												)}
												<span className="line-clamp-2">{label}</span>
											</span>
											<span className="text-muted-foreground text-sm">
												{formatMoney({
													amount: BigInt(displayPrice(item.variant, taxBehavior)),
													currency,
													locale,
												})}
											</span>
											{outOfStock && <span className="text-destructive text-xs">Out of stock</span>}
											{item.forced && (
												<Badge variant="secondary" className="w-fit">
													{item.fixedQuantity > 1 ? `Included ×${item.fixedQuantity}` : "Included"}
												</Badge>
											)}
										</button>

										{!isRadio && !item.forced && selected && (
											<div className="flex items-center justify-between border-t px-2 py-1.5">
												<Button
													type="button"
													size="icon"
													variant="ghost"
													className="size-7"
													onClick={() => setQuantity(group.id, item.variantId, qty - 1)}
												>
													<MinusIcon className="size-4" />
												</Button>
												<span className="min-w-6 text-center font-medium text-sm">{qty}</span>
												<Button
													type="button"
													size="icon"
													variant="ghost"
													className="size-7"
													disabled={!canIncrement}
													onClick={() => setQuantity(group.id, item.variantId, qty + 1)}
												>
													<PlusIcon className="size-4" />
												</Button>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</section>
				);
			})}

			<div className="sticky bottom-0 flex flex-col gap-3 border-t bg-background/95 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-baseline gap-2">
					{hasSavings && (
						<span className="text-muted-foreground text-lg line-through">
							{formatMoney({ amount: originalTotal, currency, locale })}
						</span>
					)}
					<span className="font-bold text-2xl">{formatMoney({ amount: total, currency, locale })}</span>
				</div>
				<Button
					type="button"
					size="lg"
					className="rounded-4xl"
					disabled={!canAdd || isAdding}
					onClick={handleAddToCart}
				>
					{isAdding ? "Adding…" : "Add to cart"}
				</Button>
			</div>
		</div>
	);
}
