"use client";

import { useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { itemKey, lineKey } from "@/app/cart/cart-math";
import { QuantitySelector } from "@/app/product/[slug]/quantity-selector";
import { RestockNotify } from "@/app/product/[slug]/restock-notify";
import { SubscriptionOptions, type SubscriptionPlan } from "@/app/product/[slug]/subscription-options";
import { TrustBadges } from "@/app/product/[slug]/trust-badges";
import { useSelectedVariant } from "@/app/product/[slug]/use-selected-variant";
import { VariantSelector } from "@/app/product/[slug]/variant-selector";
import { useVolumePricing, VolumePricingDisplay, type VolumeTier } from "@/app/product/[slug]/volume-pricing";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice, priceRange, type TaxBehavior } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";
import { cn } from "@/lib/utils";

// 下方每个净额价格都对应一个含税毛额；顾客看到哪一个由店铺的
// `taxBehavior` 决定（参见 lib/pricing.ts）。保留毛额为可选字段，以便兼容仅返回净额的旧版 API 负载。
type Variant = {
	id: string;
	price: string;
	priceGross?: string;
	originalPrice: string;
	originalPriceGross?: string | null;
	sku: string | null;
	images: string[];
	stock: number | null;
	/** 欧盟 Omnibus 指令：最近 30 天内的最低价格（除非店铺启用 omnibus，否则为 null）。 */
	omnibusPrice: string | null;
	omnibusPriceGross?: string | null;
	combinations: {
		variantValue: {
			id: string;
			value: string;
			colorValue: string | null;
			variantType: {
				id: string;
				type: "string" | "color";
				label: string;
			};
		};
	}[];
};

type AddToCartButtonProps = {
	variants: Variant[];
	product: {
		id: string;
		name: string;
		slug: string;
		images: string[];
	};
	summary?: string | null;
	volumePricingTiers?: VolumeTier[];
	/** 缺货时是否展示“到货提醒”流程（到货通知模块）。 */
	restockNotificationsEnabled?: boolean;
	/** 商品购买方式：可单次或按周期订阅（`optional`）、仅限订阅（`only`）或订阅盲盒（`rolling`）。 */
	subscriptionMode?: "optional" | "only" | "rolling";
	/** 可用的订阅方案列表，按展示顺序排列。 */
	plans?: SubscriptionPlan[];
};

const LOW_STOCK_THRESHOLD = 5;

function buttonLabel(
	variant: Variant | undefined,
	isOutOfStock: boolean,
	plan: SubscriptionPlan | null,
	formattedTotal: string | null,
) {
	if (!variant) return "Select options";
	if (isOutOfStock) return "Out of stock";
	if (plan) return plan.discountPercent > 0 ? `Subscribe & save ${plan.discountPercent}%` : "Subscribe";
	return formattedTotal ? `Add to Cart — ${formattedTotal}` : "Add to Cart";
}

// 主标题价格。对于已选变体展示其自身价格（打折时展示划线原价）。
// 在选中变体之前回退展示价格区间。
function headlinePrice(
	variants: Variant[],
	variant: Variant | undefined,
	taxBehavior: TaxBehavior,
	fmt: (amount: bigint) => string,
) {
	if (variant) {
		const price = BigInt(displayPrice(variant, taxBehavior));
		const listPrice = BigInt(
			displayPrice(variant, taxBehavior, "originalPrice") ?? displayPrice(variant, taxBehavior),
		);
		const onSale = listPrice > price;
		return {
			display: fmt(price),
			compareAt: onSale ? fmt(listPrice) : null,
			discountPercent: onSale ? Math.round((Number(listPrice - price) / Number(listPrice)) * 100) : null,
		};
	}

	const { min: minPrice, max: maxPrice } = priceRange(variants, taxBehavior);
	return {
		display: minPrice === maxPrice ? fmt(minPrice) : `${fmt(minPrice)} - ${fmt(maxPrice)}`,
		compareAt: null,
		discountPercent: null,
	};
}

// 库存状态。stock 为 null 表示不追踪库存（视为有货）。
function stockStatusOf(variant: Variant | undefined) {
	if (!variant) return null;
	const { stock } = variant;
	if (stock === 0) return { label: "Out of stock", tone: "out" as const };
	if (stock !== null && stock <= LOW_STOCK_THRESHOLD) {
		return { label: `Only ${stock} left in stock`, tone: "low" as const };
	}
	return { label: "In stock", tone: "in" as const };
}

export function AddToCartButton({
	variants,
	product,
	summary,
	volumePricingTiers = [],
	restockNotificationsEnabled = false,
	subscriptionMode = "optional",
	plans = [],
}: AddToCartButtonProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const [quantity, setQuantity] = useState(1);
	const { items, openCart, dispatch, syncCart, reconcile, startMutation } = useCart();

	const selectedVariant = useSelectedVariant(variants);

	// 仅限订阅的商品默认选择其首个方案。滚动盲盒（每个周期
	// 更换内容）所需功能超出了本面板范围，因此不在此处销售。
	const allowOneTime = subscriptionMode === "optional";
	const [planId, setPlanId] = useState<string | null>(allowOneTime ? null : (plans[0]?.id ?? null));
	const plan = plans.find(({ id }) => id === planId) ?? null;
	const purchasable = allowOneTime || (subscriptionMode === "only" && plan !== null);

	// stock === null 表示该变体不追踪库存（无限制）
	const isOutOfStock = selectedVariant?.stock === 0;
	const maxQuantity = selectedVariant?.stock ?? 99;
	const effectiveQuantity = isOutOfStock ? 1 : Math.min(quantity, maxQuantity);

	const { resolvedTiers, volumePrice } = useVolumePricing(
		volumePricingTiers,
		selectedVariant?.id,
		effectiveQuantity,
		taxBehavior,
	);

	const unitPrice = volumePrice ?? (selectedVariant ? displayPrice(selectedVariant, taxBehavior) : null);
	const totalPrice = unitPrice ? BigInt(unitPrice) * BigInt(effectiveQuantity) : null;

	const fmt = (amount: bigint) => formatMoney({ amount, currency, locale });
	const buttonText = buttonLabel(selectedVariant, isOutOfStock, plan, totalPrice ? fmt(totalPrice) : null);
	const priceInfo = headlinePrice(variants, selectedVariant, taxBehavior, fmt);

	// 欧盟 Omnibus 指令：当变体打折时，显示过去 30 天内记录的最低价格。
	const lowestPrice =
		selectedVariant && priceInfo.compareAt
			? displayPrice(selectedVariant, taxBehavior, "omnibusPrice")
			: null;
	const omnibusPrice = lowestPrice ? fmt(BigInt(lowestPrice)) : null;

	const stockStatus = stockStatusOf(selectedVariant);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedVariant || isOutOfStock) return;

		const variantId = selectedVariant.id;
		const addedQuantity = effectiveQuantity;
		const previousQuantity =
			items.find((item) => itemKey(item) === lineKey(variantId, planId))?.quantity ?? 0;

		trackAddToCart(selectedVariant, product.name, addedQuantity);

		openCart();
		setQuantity(1);

		// 在 transition 外部提供即时的本地乐观反馈，随后使用
		// 服务端返回的最新购物车进行替换（REPLACE，绝不重新拉取 —— cartGet 会读取读副本，存在写入延迟）。
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: addedQuantity,
				subscriptionPlanId: planId,
				subscriptionPlan: plan,
				productVariant: {
					id: variantId,
					price: selectedVariant.price,
					// 附带含税毛额，使乐观行项目与服务端返回的购物车渲染在相同的计税口径下 —— 避免在写入期间发生净额/毛额突变。
					priceGross: selectedVariant.priceGross,
					images: selectedVariant.images,
					// 立即在此列出变体选项，无需等待服务端响应后再显示。
					combinations: selectedVariant.combinations,
					product,
				},
			},
		});

		startMutation(async () => {
			// 服务端会将行项目数量限制在可用库存范围内，并返回
			// 更新后的购物车 —— 直接从返回的权威购物车同步；仅在请求失败时对齐（reconcile）。
			const result = await addToCart(variantId, addedQuantity, planId);
			const line = result.cart?.lineItems.find((item) => itemKey(item) === lineKey(variantId, planId));
			if (result.success && result.cart && line) {
				syncCart(result.cart);
				if (line.quantity < previousQuantity + addedQuantity) {
					toast.warning(`Only ${line.quantity} in stock — quantity adjusted`);
				}
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div className="space-y-8">
			{summary && <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{summary}</p>}

			{/* 价格与促销信息 */}
			<div className="space-y-2">
				<div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
					<span className="text-3xl font-semibold tracking-tight">{priceInfo.display}</span>
					{priceInfo.compareAt && (
						<span className="text-lg text-muted-foreground line-through">{priceInfo.compareAt}</span>
					)}
					{priceInfo.discountPercent ? (
						<span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
							Save {priceInfo.discountPercent}%
						</span>
					) : null}
				</div>

				{omnibusPrice && (
					<p className="text-xs text-muted-foreground">Lowest price in the last 30 days: {omnibusPrice}</p>
				)}

				{/* SKU 与库存可用性 */}
				{selectedVariant?.sku && (
					<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
						<span className="text-muted-foreground">
							SKU: <span className="font-medium text-foreground">{selectedVariant.sku}</span>
						</span>
					</div>
				)}
			</div>

			{variants.length > 1 && <VariantSelector variants={variants} />}

			{purchasable ? (
				<>
					{plans.length > 0 && (
						<SubscriptionOptions
							plans={plans}
							value={planId}
							onChange={setPlanId}
							allowOneTime={allowOneTime}
						/>
					)}

					<QuantitySelector
						quantity={effectiveQuantity}
						onQuantityChange={setQuantity}
						max={Math.max(1, Math.min(99, maxQuantity))}
						disabled={isOutOfStock}
					/>

					<VolumePricingDisplay
						tiers={resolvedTiers}
						quantity={effectiveQuantity}
						volumePrice={volumePrice}
					/>

					{isOutOfStock && restockNotificationsEnabled && selectedVariant ? (
						<RestockNotify productVariantId={selectedVariant.id} productName={product.name} />
					) : (
						<form onSubmit={handleSubmit}>
							<button
								type="submit"
								disabled={!selectedVariant || isOutOfStock}
								className="w-full h-14 bg-foreground text-background py-4 px-8 rounded-full text-base font-medium tracking-wide hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{buttonText}
							</button>
						</form>
					)}
				</>
			) : (
				<p className="text-sm text-muted-foreground">This subscription isn't available right now.</p>
			)}

			<TrustBadges />
		</div>
	);
}
