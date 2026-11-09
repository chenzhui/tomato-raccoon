"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/app/cart/cart-context";
import { CartItem } from "@/app/cart/cart-item";
import { itemKey } from "@/app/cart/cart-math";
import { cartDiscountOf } from "@/app/cart/discount-code";
import { DiscountCodeField } from "@/app/cart/discount-code-field";
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
	const discount = cartDiscountOf(cart, taxBehavior);

	// `?lang=` 告诉平台顾客当前离开时的语言版本，以便独立托管的
	// 结账页面及后续环节（订单、邮件）都能使用该语言，即使该购物车是在记录语言之前创建的。
	const checkoutUrl = language ? `/checkout?lang=${encodeURIComponent(language)}` : "/checkout";

	// 满 $35 美金免邮心理战计算 (Free Shipping at $35.00)
	const FREE_SHIPPING_THRESHOLD = 3500n;
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

				{/* 满 $35 美金免运费心理战进度条 */}
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
								<DiscountCodeField />
								{discount ? (
									<div className="space-y-1">
										<div className="flex items-center justify-between text-sm text-muted-foreground">
											<span>Subtotal</span>
											<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
										</div>
										<div className="flex items-center justify-between gap-3 text-sm font-medium text-green-700">
											<span>Discount</span>
											<span className="tabular-nums">
												−{formatMoney({ amount: discount, currency, locale })}
											</span>
										</div>
									</div>
								) : null}
								<div className="flex items-center justify-between text-base">
									<span className="font-medium">{discount ? "Total" : "Subtotal"}</span>
									<span className="font-semibold">
										{formatMoney({ amount: subtotal - (discount ?? 0n), currency, locale })}
									</span>
								</div>
								{/* 在含税店铺中，税费已经包含在展示的小计中 —— 在此处若提示
								    “税费将在结账时计算”会被顾客误认为还有额外附加收费。 */}
								<p className="text-xs text-muted-foreground">
									{taxBehavior === "inclusive"
										? "Shipping calculated at checkout"
										: "Shipping and taxes calculated at checkout"}
								</p>
								{/* 此处必须保持原生 <a> 标签，绝不要用 <Link>/router.push：/checkout 被代理到
								    另一个不同的 Next.js zone (yns.store)。跨 zone 进行 RSC 客户端软导航会触发 500。
								    当购物车写入在途时禁用链接：若此时进行页面完整跳转，会在服务端完成写入前
								    加载 /checkout，从而显示空购物车。 */}
								<a
									href={checkoutUrl}
									aria-disabled={isMutating}
									tabIndex={isMutating ? -1 : undefined}
									onClick={(e) => {
										if (isMutating) {
											e.preventDefault();
										}
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
								</a>
								<button
									type="button"
									onClick={closeCart}
									className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
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
