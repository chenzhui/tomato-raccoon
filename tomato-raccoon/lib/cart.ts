import { try_ } from "safe-try";
import { commerce } from "@/lib/commerce";
import { clearCartCookie, getCartCookieJson, isCartNotFoundError } from "@/lib/cookies";

/** 从 `yns_cart` Cookie 中读取的买家购物车，若不存在或无法读取则返回 `null`。 */
export async function readCart() {
	const cartCookie = await getCartCookieJson();

	if (!cartCookie?.id) {
		return null;
	}

	const [error, cart] = await try_(commerce.cartGet({ cartId: cartCookie.id }));
	if (error) {
		// 常见于完成结账之后（点击浏览器返回键从 bfcache 恢复页面并执行对齐校准）或购物车已过期。
		// 清除已失效的 Cookie，避免布局组件在每个请求中都重复查询它；瞬时网络故障则保留 Cookie，因为购物车可能仍存在。
		if (isCartNotFoundError(error)) {
			await clearCartCookie();
			return null;
		}
		console.error("cart: cartGet failed", { cartId: cartCookie.id, error });
		return null;
	}
	return cart;
}
