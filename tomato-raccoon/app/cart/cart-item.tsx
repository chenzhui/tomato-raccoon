"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRef, useTransition } from "react";
import { setCartQuantity } from "@/app/cart/actions";
import { type Cart, type CartLineItem, getLineItemUnitPrice, useCart } from "@/app/cart/cart-context";
import { itemKey, lineOptions, planLabel } from "@/app/cart/cart-math";
import { useStoreConfig } from "@/components/store-config-provider";
import { formatMoney } from "@/lib/money";
import { cn, getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

type CartItemProps = {
	item: CartLineItem;
};

export function CartItem({ item }: CartItemProps) {
	const { currency, locale, taxBehavior } = useStoreConfig();
	const { dispatch, closeCart, startMutation, syncCart, reconcile } = useCart();
	const [isPending, startTransition] = useTransition();

	const { productVariant, quantity } = item;
	const { product } = productVariant;
	const options = lineOptions(item);

	const image = getProductThumbnail(productVariant.images) ?? getProductThumbnail(product.images);
	const price = getLineItemUnitPrice(item, taxBehavior);
	const lineTotal = price * BigInt(quantity);

	const targetQuantityRef = useRef<number | null>(null);
	const sendQueueRef = useRef<Promise<void>>(Promise.resolve());
	const latestCartRef = useRef<Cart | null>(null);
	const sendFailedRef = useRef(false);

	// 乐观更新 + 队列化同步：快速连续点击会合并为最新的绝对数量
	// （得益于 mode: "set" 保证操作安全），每个商品行同一时间只有一个在途请求，
	// 且每个 transition 在队列清空前都保持 pending 状态，防止界面数值闪烁回退。
	const updateQuantity = (action: Parameters<typeof dispatch>[0], target: number) => {
		// 将当前行的 pending 状态同步映射到整个购物车的 isMutating 标识上，
		// 使得在写入在途期间结账（Checkout）链接保持禁用。
		// 当本地 transition 完成时 resolve done；具体更新任务本身只执行一次。
		const { promise: done, resolve: resolveDone } = Promise.withResolvers<void>();
		startMutation(async () => {
			await done;
		});
		startTransition(async () => {
			try {
				dispatch(action);
				targetQuantityRef.current = target;
				sendQueueRef.current = sendQueueRef.current.then(async () => {
					const latest = targetQuantityRef.current;
					if (latest === null) {
						return; // 最新数值已发送
					}
					targetQuantityRef.current = null;
					const res = await setCartQuantity(productVariant.id, latest, item.subscriptionPlanId);
					// 记录服务端返回的最新购物车状态以便从中同步（绝不要调用
					// refetch —— cartGet 请求读副本可能会回退到陈旧的旧状态）。
					if (res.success && res.cart) {
						latestCartRef.current = res.cart;
					} else {
						sendFailedRef.current = true;
					}
				});
				// 清空队列，然后执行一次状态对齐（reconcile）。并发的 transition
				// 会在此汇合，因此每批操作只执行单次同步。
				let tail: Promise<void>;
				do {
					tail = sendQueueRef.current;
					await tail;
				} while (tail !== sendQueueRef.current);
				if (sendFailedRef.current) {
					sendFailedRef.current = false;
					latestCartRef.current = null;
					await reconcile();
				} else if (latestCartRef.current) {
					syncCart(latestCartRef.current);
					latestCartRef.current = null;
				}
			} finally {
				resolveDone();
			}
		});
	};

	const handleRemove = () => {
		updateQuantity({ type: "REMOVE", key: itemKey(item) }, 0);
	};

	const handleIncrement = () => {
		updateQuantity({ type: "INCREASE", key: itemKey(item) }, quantity + 1);
	};

	const handleDecrement = () => {
		if (quantity <= 1) {
			handleRemove();
			return;
		}
		updateQuantity({ type: "DECREASE", key: itemKey(item) }, quantity - 1);
	};

	return (
		<div className="flex gap-3 py-4">
			{/* 商品图片 */}
			<Link
				href={`/product/${product.slug}`}
				onClick={closeCart}
				className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="96px" />}
			</Link>

			{/* 商品详情 */}
			<div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
				<div className="flex items-start justify-between gap-2">
					<div className="min-w-0 space-y-1">
						<Link
							href={`/product/${product.slug}`}
							onClick={closeCart}
							className="text-sm font-medium leading-tight text-foreground hover:underline line-clamp-2"
						>
							{product.name}
						</Link>
						{options && <p className="text-xs text-muted-foreground">{options}</p>}
						{item.subscriptionPlan && (
							<p className="text-xs text-muted-foreground">{planLabel(item.subscriptionPlan)}</p>
						)}
					</div>
					<button
						type="button"
						onClick={handleRemove}
						disabled={isPending}
						className="shrink-0 p-1 text-muted-foreground hover:text-destructive transition-colors disabled:pointer-events-none disabled:opacity-50"
						aria-label="Remove item"
					>
						<Trash2 className="h-4 w-4" />
					</button>
				</div>

				<div className="flex items-center justify-between">
					{/* 数量控制组件 */}
					<div
						className={cn(
							"inline-flex items-center rounded-full border border-border transition-opacity",
							isPending && "opacity-70",
						)}
					>
						<button
							type="button"
							onClick={handleDecrement}
							className="shrink-0 flex h-7 w-7 items-center justify-center rounded-l-full hover:bg-secondary transition-colors"
							aria-label="Decrease quantity"
						>
							<Minus className="h-3 w-3" />
						</button>
						<span className="flex h-7 w-8 items-center justify-center text-sm tabular-nums">{quantity}</span>
						<button
							type="button"
							onClick={handleIncrement}
							className="shrink-0 flex h-7 w-7 items-center justify-center rounded-r-full hover:bg-secondary transition-colors"
							aria-label="Increase quantity"
						>
							<Plus className="h-3 w-3" />
						</button>
					</div>

					{/* 价格显示 */}
					<span className="text-sm font-semibold">
						{formatMoney({ amount: lineTotal, currency, locale })}
					</span>
				</div>
			</div>
		</div>
	);
}
