"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { useStoreConfig } from "@/components/store-config-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";

export function CartSidebar() {
	const { currency, locale, language, taxBehavior } = useStoreConfig();
	const { cart, isOpen, closeCart, items, itemCount, subtotal, isMutating } = useCart();

	// 满 $50 美金免邮心理战计算 (Free Shipping at $50.00)
	const FREE_SHIPPING_THRESHOLD = 5000n;
	const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD > subtotal ? FREE_SHIPPING_THRESHOLD - subtotal : 0n;
	const progressPercent = Math.min(100, Math.round((Number(subtotal) / Number(FREE_SHIPPING_THRESHOLD)) * 100));

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
			<SheetContent className="flex flex-col data-[side=right]:w-full data-[side=right]:sm:max-w-lg p-0">
				<SheetHeader className="border-b border-border p-4 pb-3">
					<SheetTitle className="flex items-center gap-2">
						Your Cart
						{itemCount > 0 && (
							<span className="text-sm font-normal text-muted-foreground">({itemCount} items)</span>
						)}
					</SheetTitle>
					<SheetDescription className="sr-only">
						Review items in your cart and proceed to checkout.
					</SheetDescription>
				</SheetHeader>

				{/* 满 $50 美金免运费心理战进度条 */}
				{itemCount > 0 && (
					<div className="bg-[#FAF7F0] px-4 py-3 border-b border-[#E5DDD0]">
						<div className="flex items-center justify-between text-xs font-medium mb-1.5">
							{remainingForFreeShipping > 0n ? (
								<span className="text-[#1E1D1B]">
									Add <strong className="text-[#D93829] font-bold">{formatMoney({ amount: remainingForFreeShipping, currency, locale })}</strong> more for <strong className="text-[#1E3F20]">FREE US Shipping!</strong>
								</span>
							) : (
								<span className="text-[#1E3F20] font-bold flex items-center gap-1.5">
									<span>🎉</span> You've unlocked FREE US Shipping!
								</span>
							)}
							<span className="text-[11px] font-bold text-[#7C5335]">{progressPercent}%</span>
						</div>
						<div className="w-full h-2 rounded-full bg-[#E5DDD0] overflow-hidden">
							<div
								className="h-full bg-[#1E3F20] transition-all duration-500 rounded-full"
								style={{ width: `${progressPercent}%` }}
							/>
						</div>
					</div>
				)}

				{items.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
						<div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary">
							<ShoppingBag className="h-10 w-10 text-muted-foreground" />
						</div>
						<div className="text-center">
							<p className="text-lg font-medium">Your cart is empty</p>
							<p className="text-sm text-muted-foreground mt-1">Add some products to get started</p>
						</div>
						<Button variant="outline" onClick={closeCart}>
							Continue Shopping
						</Button>
					</div>
				) : (
					<>
						<ScrollArea className="flex-1 px-4">
							<div className="divide-y divide-border">
								{items.map((item) => (
									<CartItem key={itemKey(item)} item={item} />
								))}
							</div>
						</ScrollArea>

						<SheetFooter className="border-t border-border pt-4 mt-auto">
							<div className="w-full space-y-4">
								<div className="flex items-center justify-between text-base">
									<span className="font-medium">Subtotal</span>
									<span className="font-semibold">
										{formatMoney({ amount: subtotal, currency, locale })}
									</span>
								</div>
								{/* 在含税店铺中，税费已经包含在展示的小计中 —— 在此处若提示
								    “税费将在结账时计算”会被顾客误认为还有额外附加收费。 */}
								<p className="text-xs text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout"
										: "Shipping and taxes calculated at checkout"}
								</p>
								<Link
									href="/checkout"
									aria-disabled={isMutating}
									tabIndex={isMutating ? -1 : undefined}
									onClick={(e) => {
										if (isMutating) {
											e.preventDefault();
											return;
										}
										closeCart();
									}}
									className={cn(
										buttonVariants(),
										"w-full h-12 text-base font-medium",
										isMutating && "pointer-events-none opacity-60",
									)}
								>
									{isMutating ? (
										<>
											<Loader2 className="h-4 w-4 animate-spin" />
											Updating…
										</>
									) : (
										"Checkout"
									)}
								</Link>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
								>
									Continue Shopping
								</button>
							</div>
						</SheetFooter>
					</>
				)}
			</SheetContent>
		</Sheet>
	);
}
