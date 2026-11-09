"use client";

import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { itemKey, lineKey } from "@/app/cart/cart-math";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { trackAddToCart } from "@/lib/track";

export type ChatProduct = {
	productId: string;
	name: string;
	slug: string;
	summary: string | null;
	currency: string;
	imageUrl: string | null;
	variants: Array<{
		id: string;
		sku: string | null;
		label: string;
		/** 净价，最小货币单位。 */
		price: number;
		/** 对应的含税总价；若聊天后端早于感知税费行为的定价机制则可能缺失。 */
		priceGross?: number | null;
		inStock: boolean;
		imageUrl: string | null;
	}>;
};

/** 向平台聊天路由发送的即发即弃式分析信标。 */
const reportEvent = (payload: {
	messageId: string;
	type: "card_click" | "add_to_cart";
	productId: string;
	variantId?: string;
}) => {
	void fetch("/api/chat/events", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(payload),
		keepalive: true,
	}).catch(() => undefined);
};

export function ChatProductCard({
	product,
	messageId,
	locale,
}: {
	product: ChatProduct;
	messageId: string;
	locale: string;
}) {
	const { taxBehavior } = useStoreConfig();
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();
	const [selectedVariantId, setSelectedVariantId] = useState(
		product.variants.find((variant) => variant.inStock)?.id ?? product.variants[0]?.id,
	);
	const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);
	// 聊天工具发送的是数字，而非 API 的字符串价格对 —— 将其规范化为
	// lib/pricing 支持的格式，以便将统一的显示规则保持在一处。
	const selectedPrices = selectedVariant
		? {
				price: String(selectedVariant.price),
				priceGross: selectedVariant.priceGross == null ? null : String(selectedVariant.priceGross),
			}
		: null;

	const handleAddToCart = () => {
		if (!selectedVariant) return;
		reportEvent({
			messageId,
			type: "add_to_cart",
			productId: product.productId,
			variantId: selectedVariant.id,
		});
		// 与 QuickAddButton 遵循相同的店面分析约定 —— 从聊天中加入购物车
		// 必须像其他方式一样上报给商店的跟踪器。
		trackAddToCart(
			{ id: selectedVariant.id, sku: selectedVariant.sku, price: String(selectedVariant.price) },
			product.name,
			1,
		);

		openCart();
		// 与 QuickAddButton 相同的乐观更新流程：先立即更新本地商品，然后在 transition 内
		// 用服务端购物车替换，在此期间保持结账按钮处于禁用状态。
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: 1,
				productVariant: {
					id: selectedVariant.id,
					price: String(selectedVariant.price),
					priceGross: selectedPrices?.priceGross,
					images: selectedVariant.imageUrl ? [selectedVariant.imageUrl] : [],
					product: {
						id: product.productId,
						name: product.name,
						slug: product.slug,
						images: product.imageUrl ? [product.imageUrl] : [],
					},
				},
			},
		});

		startMutation(async () => {
			const result = await addToCart(selectedVariant.id, 1);
			const line = result.cart?.lineItems.find((item) => itemKey(item) === lineKey(selectedVariant.id));
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<div className="w-44 shrink-0 snap-start overflow-hidden rounded-xl border bg-background">
			<Link
				href={`/product/${product.slug}`}
				onClick={() => reportEvent({ messageId, type: "card_click", productId: product.productId })}
			>
				<div className="relative aspect-square bg-muted/40">
					{product.imageUrl ? (
						<Image src={product.imageUrl} alt={product.name} fill sizes="176px" className="object-cover" />
					) : null}
				</div>
			</Link>
			<div className="grid gap-2 p-2.5">
				<Link
					href={`/product/${product.slug}`}
					className="line-clamp-2 text-xs font-medium leading-snug hover:underline"
					onClick={() => reportEvent({ messageId, type: "card_click", productId: product.productId })}
				>
					{product.name}
				</Link>
				{selectedPrices && (
					<div className="text-xs font-semibold tabular-nums">
						{formatMoney({
							amount: displayPrice(selectedPrices, taxBehavior),
							currency: product.currency,
							locale,
						})}
					</div>
				)}
				{product.variants.length > 1 && (
					<select
						value={selectedVariantId}
						onChange={(e) => setSelectedVariantId(e.target.value)}
						aria-label={`Choose a variant of ${product.name}`}
						className="w-full rounded-md border bg-background px-1.5 py-1 text-xs"
					>
						{product.variants.map((variant) => (
							<option key={variant.id} value={variant.id} disabled={!variant.inStock}>
								{variant.label}
								{variant.inStock ? "" : " — out of stock"}
							</option>
						))}
					</select>
				)}
				<button
					type="button"
					onClick={handleAddToCart}
					disabled={!selectedVariant?.inStock}
					className="flex cursor-pointer items-center justify-center gap-1.5 rounded-full bg-foreground px-2 py-1.5 text-xs font-medium text-background transition-opacity disabled:opacity-40"
				>
					<ShoppingBag className="h-3 w-3" />
					{selectedVariant?.inStock ? "Add to cart" : "Out of stock"}
				</button>
			</div>
		</div>
	);
}
