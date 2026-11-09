"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { addToCart } from "@/app/cart/actions";
import { useCart } from "@/app/cart/cart-context";
import { itemKey, lineKey } from "@/app/cart/cart-math";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { trackAddToCart } from "@/lib/track";

type QuickAddButtonProps = {
	variantId: string;
	variantSku?: string | null;
	variantPrice: string;
	/** `variantPrice` 对应的含税总价，使乐观更新的购物车行项目与商店的税费行为保持一致。 */
	variantPriceGross?: string | null;
	variantImages: string[];
	product: {
		id: string;
		name: string;
		slug: string;
		images: string[];
	};
};

export function QuickAddButton({
	variantId,
	variantSku,
	variantPrice,
	variantPriceGross,
	variantImages,
	product,
}: QuickAddButtonProps) {
	const { openCart, dispatch, syncCart, reconcile, startMutation } = useCart();

	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		trackAddToCart({ id: variantId, sku: variantSku, price: variantPrice }, product.name, 1);

		openCart();

		// 在 transition 之外提供即时的本地反馈，然后使用服务端返回的购物车进行替换
		// （切勿重新获取 —— cartGet 读取的副本可能会滞后于写入）。
		// 在写入完成之前，transition 会保持结账按钮处于禁用状态。
		dispatch({
			type: "ADD_ITEM",
			item: {
				quantity: 1,
				productVariant: {
					id: variantId,
					price: variantPrice,
					priceGross: variantPriceGross,
					images: variantImages,
					product,
				},
			},
		});

		startMutation(async () => {
			// 服务端会限制在可用库存范围内并仍然返回购物车 —— 显示失败提示，
			// 而不是让乐观更新的商品静默消失。
			const result = await addToCart(variantId, 1);
			const line = result.cart?.lineItems.find((item) => itemKey(item) === lineKey(variantId));
			if (result.success && result.cart && line) {
				syncCart(result.cart);
			} else {
				await reconcile();
				toast.error("This item is out of stock");
			}
		});
	};

	return (
		<Tooltip>
			<TooltipTrigger
				delay={1000}
				onClick={handleClick}
				className="absolute bottom-3 left-3 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-background hover:scale-110 active:scale-95"
				aria-label={`Add ${product.name} to cart`}
			>
				<ShoppingBag className="h-3.5 w-3.5" />
			</TooltipTrigger>
			<TooltipContent side="top" className="text-xs">
				Add to cart
			</TooltipContent>
		</Tooltip>
	);
}
