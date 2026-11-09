import { NextResponse } from "next/server";
import { commerce } from "@/lib/commerce";
import { getCartCookieJson, setCartCookie } from "@/lib/cookies";

export async function POST(req: Request) {
	try {
		const body = await req.json().catch(() => ({}));
		const variantId = body.variantId || "var-bundle-5";
		const quantity = body.quantity || 1;

		const cartCookie = await getCartCookieJson();
		const cartId = cartCookie?.id || `cart-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

		await commerce.cartUpsert({
			cartId,
			variantId,
			quantity,
			mode: "add",
		});

		await setCartCookie({ id: cartId });

		return NextResponse.json({ success: true, cartId });
	} catch (error) {
		console.error("Failed to add bundle to cart:", error);
		return NextResponse.json({ success: false }, { status: 500 });
	}
}
