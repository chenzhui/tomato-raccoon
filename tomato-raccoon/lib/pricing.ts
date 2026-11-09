/**
 * 区分税费模式的价格选择。
 *
 * 价格按未税价存储（STORED net）。API 还会为每个未税价格字段返回对应的含税孪生字段
 * （`price` → `priceGross`，`originalPrice` → `originalPriceGross` 等）。店铺的
 * `taxBehavior` 决定了买家应该看到哪一个价格：
 *
 *   shown = taxBehavior === "inclusive" ? variant.priceGross : variant.price
 *
 * 这条单一规则贯穿整个模块。此处所有函数均为纯函数：仅选择字段，绝不计算税额。
 * 当缺少对应的含税字段时（旧版 API 载荷，或 API 尚未进行含税处理的嵌套结构），
 * 会直接返回未税值，以便运行在旧版后端上的 storefront 能够降级回退，而非什么都不渲染。
 */

export type TaxBehavior = "inclusive" | "exclusive";

/** 拥有 `${field}Gross` 含税孪生字段的未税价格字段。 */
export type PriceField = "price" | "originalPrice" | "calculatedPrice" | "prePromotionPrice" | "omnibusPrice";

/** 携带（部分）未税价格字段及其对应含税孪生字段的任意对象。 */
export type PriceSource = {
	readonly [K in PriceField | `${PriceField}Gross`]?: string | null;
};

/** 保证携带有效 `price` 的价格源。 */
export type PricedVariant = PriceSource & { readonly price: string };

export type VolumePricingTier = { readonly price: string; readonly priceGross?: string | null };

/** API 返回的购物车/订单金额总计（次要货币单位，在启用 Stripe Tax 时为 `null`）。 */
export type TotalsSource = {
	readonly subtotal?: number | null;
	readonly subtotalNet?: number | null;
	readonly subtotalGross?: number | null;
};

export function displayPrice(variant: PricedVariant, taxBehavior: TaxBehavior, field?: "price"): string;
export function displayPrice(
	variant: PriceSource,
	taxBehavior: TaxBehavior,
	field: PriceField,
): string | null;
export function displayPrice(variant: PriceSource, taxBehavior: TaxBehavior, field: PriceField = "price") {
	const net = variant[field] ?? null;
	if (net === null || taxBehavior !== "inclusive") {
		return net;
	}
	return variant[`${field}Gross`] ?? net;
}

/**
 * 与 {@link displayPrice} 相同的选择逻辑，适用于不作为单一对象传递的未税/含税字段对 ——
 * 例如商品的捆绑包定价字段，孪生字段并排挂载在商品对象上
 * （`bundleFixedPriceAmount` / `bundleFixedPriceAmountGross`）。`null` 的未税价仍保持 `null`；
 * 缺失含税字段时会降级为未税价，与基于字段的辅助函数行为完全一致。
 */
export function displayAmount(
	net: string | null | undefined,
	gross: string | null | undefined,
	taxBehavior: TaxBehavior,
) {
	if (net === null || net === undefined) {
		return null;
	}
	return taxBehavior === "inclusive" ? (gross ?? net) : net;
}

/** 阶梯批量定价层级的单价，按买家应看到的计税基准呈现。 */
export function displayTierPrice(tier: VolumePricingTier, taxBehavior: TaxBehavior) {
	return taxBehavior === "inclusive" ? (tier.priceGross ?? tier.price) : tier.price;
}

/**
 * 一组变体中展示的最低价与最高价。列表为空时返回 `{ min: 0n, max: 0n }`
 * —— 负责渲染区间范围的调用方必须自行检查列表是否为空。
 */
export function priceRange(
	variants: readonly PricedVariant[],
	taxBehavior: TaxBehavior,
	field?: "price",
): { min: bigint; max: bigint };
export function priceRange(
	variants: readonly PriceSource[],
	taxBehavior: TaxBehavior,
	field: PriceField,
): { min: bigint; max: bigint };
export function priceRange(
	variants: readonly PriceSource[],
	taxBehavior: TaxBehavior,
	field: PriceField = "price",
) {
	const amounts = variants
		.map((variant) => displayPrice(variant, taxBehavior, field))
		.filter((value): value is string => value !== null)
		.map((value) => BigInt(value));

	const first = amounts[0] ?? BigInt(0);
	return amounts.reduce(
		(range, amount) => ({
			min: amount < range.min ? amount : range.min,
			max: amount > range.max ? amount : range.max,
		}),
		{ min: first, max: first },
	);
}

/**
 * 商品列表展示价格：最低变体价格；当各变体定价不同时标记 `from`（起步价），
 * 这样卡片绝不会把最便宜尺码的价格当成所有变体的统一定价。
 * `compareAt` 是该变体促销前的原价，用于划线显示；未促销时为 null。
 */
export function listingPrice(variants: readonly PricedVariant[], taxBehavior: TaxBehavior) {
	if (variants.length === 0) {
		return null;
	}
	const { min, max } = priceRange(variants, taxBehavior);
	const cheapest = variants.find((variant) => BigInt(displayPrice(variant, taxBehavior)) === min);
	const original = cheapest ? displayPrice(cheapest, taxBehavior, "originalPrice") : null;
	const compareAt = original !== null && BigInt(original) > min ? BigInt(original) : null;
	return { amount: min, from: min !== max, compareAt };
}

/**
 * 买家应看到的小计金额，取自 API 自身的总计字段（次要货币单位）。
 * 当店铺在结账时才计算税费（Stripe Tax）或购物车未携带总计字段时为 `null`
 * —— 调用方随后会降级回退至在本地对展示价格求和。
 */
export function cartDisplaySubtotal(
	cart: TotalsSource | null | undefined,
	taxBehavior: TaxBehavior,
): number | null {
	if (!cart) {
		return null;
	}
	const sided = taxBehavior === "inclusive" ? cart.subtotalGross : cart.subtotalNet;
	return sided ?? cart.subtotal ?? null;
}

type ShippingSource = {
	readonly shipping: { readonly price: string; readonly priceGross?: string | null } | null;
	readonly shippingGross?: number | null;
};

/**
 * 订单收取的配送费用，按买家应看到的计税基准呈现。订单的
 * `shippingGross` 即为实际收取金额：当达到免运费门槛或应用优惠券时为 0，
 * 即使所选运费费率仍标明其常规价格。
 */
export function orderDisplayShipping(order: ShippingSource, taxBehavior: TaxBehavior): bigint {
	const { shipping, shippingGross } = order;
	if (!shipping || shippingGross === 0) {
		return BigInt(0);
	}
	if (taxBehavior === "inclusive" && shippingGross !== null && shippingGross !== undefined) {
		return BigInt(Math.round(shippingGross));
	}
	return BigInt(displayAmount(shipping.price, shipping.priceGross, taxBehavior) ?? shipping.price);
}
