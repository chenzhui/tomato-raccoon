import { cartDisplaySubtotal, displayPrice, type TaxBehavior } from "@/lib/pricing";

export type CartLineItem = {
	quantity: number;
	/** 该行项目所续订的订阅方案；单次购买时不存在或为 null。 */
	subscriptionPlanId?: string | null;
	subscriptionPlan?: SubscriptionPlanLabel | null;
	productVariant: {
		id: string;
		price: string;
		/** price 的含税毛额对应项；在服务端返回前客户端生成的乐观行项目上不存在。 */
		priceGross?: string | null;
		images: string[];
		/** 当前变体所代表的选项值组合；对于没有多规格选项的商品为空。 */
		combinations?: { variantValue: { value: string } }[];
		product: {
			id: string;
			name: string;
			slug: string;
			images: string[];
		};
	};
};

export type Cart = {
	id: string;
	lineItems: CartLineItem[];
	// API 计算出的权威金额总计（以最小货币单位表示）。当店铺通过
	// Stripe Tax 计税时为 `null`，且会被 `cartReducer` 清除，因为客户端乐观变更
	// 会使旧总额失效 —— 参见 `withoutStaleTotals`。
	subtotal?: number | null;
	subtotalNet?: number | null;
	subtotalGross?: number | null;
	coupon?: { code: string; type: string; value: string } | null;
};

/** 顾客计税基准下的单价。API 已经为捆绑包行项目计算好价格。 */
export function getLineItemUnitPrice(item: CartLineItem, taxBehavior: TaxBehavior): bigint {
	return BigInt(displayPrice(item.productVariant, taxBehavior));
}

/**
 * 顾客应当看到的购物车小计金额：当购物车数据来自服务端时使用 API 自带的总额，
 * 否则使用本地展示单价之和（用于变更处理中的乐观更新状态）。
 */
export function getCartDisplaySubtotal(cart: Cart | null, taxBehavior: TaxBehavior): bigint {
	const fromApi = cartDisplaySubtotal(cart, taxBehavior);
	if (fromApi !== null) {
		return BigInt(Math.round(fromApi));
	}
	return (cart?.lineItems ?? []).reduce(
		(sum, item) => sum + getLineItemUnitPrice(item, taxBehavior) * BigInt(item.quantity),
		0n,
	);
}

/**
 * 丢弃服务端的金额总计。任何本地乐观变更都会使其过时，而陈旧的总额比没有总额更糟糕：
 * 丢弃后购物车会回退到累加本地展示价格，从而在变更期间保持相同的净额/毛额计价口径，
 * 避免中间发生口径突变翻转。
 */
const withoutStaleTotals = (cart: Cart): Cart => ({
	...cart,
	subtotal: null,
	subtotalNet: null,
	subtotalGross: null,
});

type SubscriptionPlanLabel = { name: string; discountPercent: number };

/** "每月 · 省 10%"。商家通常以扣费周期命名方案，因此方案名代表了扣费频次。 */
export const planLabel = (plan: SubscriptionPlanLabel) =>
	plan.discountPercent > 0 ? `${plan.name} · Save ${plan.discountPercent}%` : plan.name;

/**
 * 一个购物车行项目代表某个特定方案下的一个变体：API 会将同一变体的单次购买项和
 * 订阅项严格区分开，因此仅凭变体 ID 无法唯一确定一个行项目。
 */
export const lineKey = (variantId: string, subscriptionPlanId?: string | null) =>
	`${variantId}:${subscriptionPlanId ?? ""}`;

export const itemKey = (item: CartLineItem) => lineKey(item.productVariant.id, item.subscriptionPlanId);

/** "100 ml" 或 "燕麦 / 沐浴"：用于区分同一商品不同行项目的选项组合文本。 */
export const lineOptions = (item: CartLineItem) =>
	(item.productVariant.combinations ?? []).map(({ variantValue }) => variantValue.value).join(" / ");

export type CartAction =
	| { type: "INCREASE"; key: string }
	| { type: "DECREASE"; key: string }
	| { type: "REMOVE"; key: string }
	| { type: "ADD_ITEM"; item: CartLineItem };

// 纯函数 Reducer，仅用于提供即时的本地反馈。在每次写入变更之后，调用方都会
// 用服务端返回的最新购物车替换（syncCart）该状态 —— 纯状态替换，无需 rebase，
// 从而保证本地变更绝不会在权威购物车上被重复叠加应用。
export function cartReducer(state: Cart | null, action: CartAction): Cart | null {
	const next = applyCartAction(state, action);
	return next && next !== state ? withoutStaleTotals(next) : next;
}

function applyCartAction(state: Cart | null, action: CartAction): Cart | null {
	if (!state) {
		if (action.type === "ADD_ITEM") {
			return { id: "local", lineItems: [action.item] };
		}
		return state;
	}

	switch (action.type) {
		case "INCREASE":
			return {
				...state,
				lineItems: state.lineItems.map((item) =>
					itemKey(item) === action.key ? { ...item, quantity: item.quantity + 1 } : item,
				),
			};

		case "DECREASE":
			return {
				...state,
				lineItems: state.lineItems
					.map((item) => {
						if (itemKey(item) === action.key) {
							if (item.quantity - 1 <= 0) {
								return null;
							}
							return { ...item, quantity: item.quantity - 1 };
						}
						return item;
					})
					.filter((item): item is CartLineItem => item !== null),
			};

		case "REMOVE":
			return {
				...state,
				lineItems: state.lineItems.filter((item) => itemKey(item) !== action.key),
			};

		case "ADD_ITEM": {
			const key = itemKey(action.item);
			const existingItem = state.lineItems.find((item) => itemKey(item) === key);

			if (existingItem) {
				return {
					...state,
					lineItems: state.lineItems.map((item) =>
						itemKey(item) === key ? { ...item, quantity: item.quantity + action.item.quantity } : item,
					),
				};
			}

			return {
				...state,
				lineItems: [...state.lineItems, action.item],
			};
		}

		default:
			return state;
	}
}
