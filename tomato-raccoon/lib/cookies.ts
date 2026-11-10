import { cookies } from "next/headers";

export const CART_COOKIE = "yns_cart";
export type CartCookieJson = { id: string };

// 由 set 和 clear 共享：分区 Cookie 只能由携带相同属性的 Set-Cookie 标头移除。本地非 HTTPS 开发环境下 secure 必须为 false，避免浏览器拒绝写入。
const isProd = process.env.NODE_ENV === "production";
const CART_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: isProd,
	sameSite: (isProd ? "none" : "lax") as "none" | "lax",
	path: "/",
} as const;

export async function setCartCookie(cartCookieJson: CartCookieJson) {
	try {
		(await cookies()).set(CART_COOKIE, JSON.stringify(cartCookieJson), CART_COOKIE_OPTIONS);
	} catch (error) {
		console.error("Failed to set cart cookie", error);
	}
}

export async function clearCartCookie() {
	try {
		(await cookies()).delete({ name: CART_COOKIE, ...CART_COOKIE_OPTIONS });
	} catch (error) {
		console.error("Failed to clear cart cookie", error);
	}
}

/**
 * 当 API 指示该 Cookie 对应的购物车已不复存在时返回 true（已结账、已过期、店铺重新初始化）。
 * commerce-kit 会抛出一个仅包含 API 错误信息的普通 Error（无状态码），因此错误文本是唯一的判别依据。
 */
export function isCartNotFoundError(error: unknown) {
	return error instanceof Error && /cart not found/i.test(error.message);
}

/** 购物车 Cookie 值的纯解析函数 —— 独立导出以便进行单元测试。 */
export function parseCartCookie(value: string | undefined | null): CartCookieJson | null {
	if (!value) {
		return null;
	}
	try {
		const cartCookieJson: unknown = JSON.parse(value);
		if (
			!cartCookieJson ||
			typeof cartCookieJson !== "object" ||
			!("id" in cartCookieJson) ||
			typeof cartCookieJson.id !== "string"
		) {
			return null;
		}
		return cartCookieJson as CartCookieJson;
	} catch {
		return null;
	}
}

export async function getCartCookieJson(): Promise<null | CartCookieJson> {
	return parseCartCookie((await cookies()).get(CART_COOKIE)?.value);
}
