import type { Cart } from "@/app/cart/cart-math";
import { formatMoney } from "@/lib/money";
import { cartDisplaySubtotal, type TaxBehavior } from "@/lib/pricing";

export type AppliedCoupon = { code: string; label: string };

/** API 返回的优惠券相关信息，足以明确说明被拒绝的原因。 */
export type CouponFacts = {
	startDate: string | null;
	endDate: string | null;
	maxUses: number | null;
	timesRedeemed: number;
	minProductCount: number | null;
	maxProductCount: number | null;
};

// 百分比优惠券以千分之一为单位存储：例如 "10000" 代表 10%。
const PERCENT_PRECISION = 1000;

/** 服务端购物车中的优惠券，格式化后供购物车抽屉展示（如 "LATO10", "优惠 10%"）。 */
export function appliedCouponOf(
	cart: Cart | null,
	{ currency, locale }: { currency: string; locale: string },
): AppliedCoupon | null {
	const coupon = cart?.coupon;
	if (!coupon) {
		return null;
	}
	const value = Number(coupon.value);
	if (!Number.isFinite(value)) {
		return { code: coupon.code, label: "" };
	}
	return {
		code: coupon.code,
		label:
			coupon.type === "percentage"
				? `${value / PERCENT_PRECISION}% off`
				: `${formatMoney({ amount: value, currency, locale })} off`,
	};
}

/**
 * 折扣从小计中减免的金额，由 API 自身的总额计算得出：即打折前的小计减去打折后的小计。
 * 当缺少总额数据（如使用 Stripe Tax，或本地处于乐观变更中）或未产生折扣时返回 `null`。
 */
export function cartDiscountOf(cart: Cart | null, taxBehavior: TaxBehavior): bigint | null {
	const before = cartDisplaySubtotal(cart, taxBehavior);
	const after = cart?.subtotal;
	if (before == null || after == null) {
		return null;
	}
	const discount = BigInt(Math.round(before)) - BigInt(Math.round(after));
	return discount > 0n ? discount : null;
}

/** 折扣码被拒绝的原因，面向顾客的友好提示文案；coupon 为 null 表示未找到该代码。 */
export function refusedCodeMessage(coupon: CouponFacts | null, itemCount: number, now: Date): string {
	if (!coupon) {
		return "This code doesn't exist";
	}
	if (coupon.endDate && new Date(coupon.endDate) < now) {
		return "This code has expired";
	}
	if (coupon.startDate && new Date(coupon.startDate) > now) {
		return "This code isn't active yet";
	}
	if (coupon.maxUses !== null && coupon.timesRedeemed >= coupon.maxUses) {
		return "This code has already been used up";
	}
	if (coupon.minProductCount !== null && itemCount < coupon.minProductCount) {
		return `Add at least ${coupon.minProductCount} items to your cart to use this code`;
	}
	if (coupon.maxProductCount !== null && itemCount > coupon.maxProductCount) {
		return `This code works with up to ${coupon.maxProductCount} items in your cart`;
	}
	return "This code doesn't apply to the items in your cart";
}
