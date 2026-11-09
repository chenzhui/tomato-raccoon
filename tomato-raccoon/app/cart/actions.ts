"use server";

import { try_ } from "safe-try";
import { refusedCodeMessage } from "@/app/cart/discount-code";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";
import { getStoreConfig } from "@/lib/store-config";

export async function addToCart(variantId: string, quantity = 1, subscriptionPlanId?: string | null) {
	const [cartCookie, { language }] = await Promise.all([getCartCookieJson(), getStoreConfig()]);
	// 顾客当前所处的语言版本：平台会将其记录在购物车上，以便结账流程、
	// 订单详情及其邮件通知都使用对应语言。若店铺从未设置默认语言则忽略。
	const locale = language ?? undefined;

	// yns_cart cookie 记录的 cartId 可能在服务端已失效
	// （已过期、店铺重新初始化、旧会话等）。此时 cartUpsert 会抛出 "Cart not found"；
	// 尝试以全新购物车（FRESH cart）重试一次，确保加入购物车操作始终成功。此处不调用 revalidatePath ——
	// 客户端直接依据本 action 返回的购物车数据进行同步（调用 cartGet 可能会命中读副本，
	// 从而返回写入前的旧购物车状态，导致刚添加的商品项丢失）。
	let [error, cart] = await try_(
		commerce.cartUpsert({ cartId: cartCookie?.id, variantId, quantity, subscriptionPlanId, locale }),
	);
	if (error) {
		[error, cart] = await try_(commerce.cartUpsert({ variantId, quantity, subscriptionPlanId, locale }));
		if (error) {
			console.error("cart: addToCart failed after fresh-cart retry", {
				variantId,
				quantity,
				subscriptionPlanId,
				error,
			});
			return { success: false, cart: null };
		}
	}

	if (!cart) {
		return { success: false, cart: null };
	}

	if (cart.id !== cartCookie?.id) {
		await setCartCookie({ id: cart.id });
	}

	return { success: true, cart };
}

export async function addBundleToCart(
	bundleId: string,
	selections: Array<{ variantId: string; groupId: string; quantity: number }>,
) {
	const [cartCookie, { currency, language }] = await Promise.all([getCartCookieJson(), getStoreConfig()]);

	const [error, cart] = await try_(
		commerce.cartAddBundle({
			cartId: cartCookie?.id,
			bundleId,
			selections,
			currency,
			locale: language ?? undefined,
		}),
	);

	if (error) {
		// SDK 在 4xx 错误时会抛出异常；此处提取出可读的错误消息。更精细的分组校验
		// 已在捆绑包构建器客户端处理 —— 这里作为服务端的兜底保障。
		console.error("cart: addBundleToCart failed", { bundleId, error });
		const message = error instanceof Error ? error.message : "Could not add bundle to cart";
		return { success: false as const, error: message };
	}

	if (!cart) {
		return { success: false as const, error: "Could not add bundle to cart" };
	}

	if (cart.id !== cartCookie?.id) {
		await setCartCookie({ id: cart.id });
	}

	return { success: true as const, cart };
}

// 设置某个商品行项目的绝对数量：某订阅方案下的变体，或无订阅方案时的单次购买项。
export async function setCartQuantity(
	variantId: string,
	quantity: number,
	subscriptionPlanId?: string | null,
) {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return { success: false, cart: null };
	}

	// mode 为 "set" 时会以原子操作覆盖该行项目的数量；传入 0 则删除该项
	const [error, cart] = await try_(
		commerce.cartUpsert({
			cartId: cartCookie.id,
			variantId,
			quantity: Math.max(quantity, 0),
			subscriptionPlanId,
			mode: "set",
		}),
	);
	if (error) {
		console.error("cart: setCartQuantity failed", {
			cartId: cartCookie.id,
			variantId,
			quantity,
			subscriptionPlanId,
			error,
		});
		return { success: false, cart: null };
	}
	return { success: true, cart };
}

const REMOVE_CODE_FAILED = "Couldn't remove the code. Try again.";

export async function applyDiscountCode(rawCode: string, itemCount: number) {
	const code = rawCode.trim();
	const cartCookie = await getCartCookieJson();
	if (!code || !cartCookie?.id) {
		return { success: false as const, error: "Add something to your cart first" };
	}

	const [error, cart] = await try_(commerce.cartCouponApply({ cartId: cartCookie.id, code }));
	if (!error) {
		return { success: true as const, cart };
	}

	// SDK 仅返回宽泛的 "Coupon cannot be applied"，因此读取优惠券详情以说明具体原因。
	const [couponError, coupon] = await try_(commerce.couponGet({ idOrCode: code }));
	if (couponError) {
		console.error("cart: applyDiscountCode failed", { cartId: cartCookie.id, error, couponError });
		return { success: false as const, error: "Couldn't apply the code. Try again." };
	}
	return { success: false as const, error: refusedCodeMessage(coupon, itemCount, new Date()) };
}

export async function removeDiscountCode() {
	const cartCookie = await getCartCookieJson();
	if (!cartCookie?.id) {
		return { success: false as const, error: REMOVE_CODE_FAILED };
	}

	const [error] = await try_(commerce.cartCouponRemove({ cartId: cartCookie.id }));
	if (error) {
		console.error("cart: removeDiscountCode failed", { cartId: cartCookie.id, error });
		return { success: false as const, error: REMOVE_CODE_FAILED };
	}
	// 移除优惠券的接口仅返回 `{ ok }`；但购物车侧边栏抽屉需要重新计价后的最新购物车。
	const [, cart] = await try_(commerce.cartGet({ cartId: cartCookie.id }));
	return { success: true as const, cart };
}
