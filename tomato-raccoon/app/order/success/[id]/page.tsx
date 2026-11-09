import type { APIOrderGetByIdResult } from "commerce-kit";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { commerce } from "@/lib/commerce";
import { formatMoney, minorUnitsToMajor } from "@/lib/money";
import { cartDisplaySubtotal, displayPrice, orderDisplayShipping } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { TrackPurchase } from "@/lib/track";
import { getProductThumbnail } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

export const metadata: Metadata = {
	title: "Order Confirmed",
	robots: { index: false, follow: false },
};

function OrderSkeleton() {
	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			<div className="text-center mb-10 flex flex-col items-center">
				<Skeleton className="h-16 w-16 rounded-full" />
				<Skeleton className="mt-4 h-8 w-72" />
				<Skeleton className="mt-3 h-4 w-52" />
			</div>
			<Skeleton className="h-64 rounded-lg" />
		</div>
	);
}

// 在页面顶部直接 await params 会阻塞静态外壳 —— 页面
// 保持同步外壳结构，订单详情在 Suspense 内部以流式传输。订单
// 查询保持不缓存，因此确认页面始终反映最新状态。
export default function OrderSuccessPage(props: { params: Promise<{ id: string }> }) {
	return (
		<Suspense fallback={<OrderSkeleton />}>
			<OrderDetails params={props.params} />
		</Suspense>
	);
}

const OrderDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const order = await commerce.orderGet({ id });

	if (!order) {
		notFound();
	}

	const { lineItems, shippingAddress, shipping, customer } = order.orderData;
	const courses = order.courses ?? [];

	// 订单自身的金额总计具有权威性 —— 即为向顾客收取的实际金额，
	// 且已根据店铺计税方式计算为净额或毛额。仅当订单创建早于总计字段
	// （或店铺通过 Stripe Tax 计税）时，才回退到逐行累加。
	const apiSubtotal = cartDisplaySubtotal(order.orderData, taxBehavior);
	const subtotal =
		apiSubtotal !== null
			? BigInt(Math.round(apiSubtotal))
			: lineItems.reduce(
					(acc, item) => acc + BigInt(displayPrice(item.productVariant, taxBehavior)) * BigInt(item.quantity),
					BigInt(0),
				);

	const shippingCost = orderDisplayShipping(order.orderData, taxBehavior);

	// 含税店铺的商品价格已经包含税费，因此在此声明税额而非再次相加。
	const includedTax =
		taxBehavior === "inclusive" && order.orderData.totalTax
			? BigInt(Math.round(order.orderData.totalTax))
			: null;

	// 仅未税（exclusive）店铺会在展示价格之上额外加税；含税店铺
	// 的税费已经包含在小计中。
	const taxAmount =
		taxBehavior === "exclusive" && order.orderData.totalTax
			? BigInt(Math.round(order.orderData.totalTax))
			: null;

	const apiTotal = order.orderData.total;
	const total =
		apiTotal !== null && apiTotal !== undefined
			? BigInt(Math.round(apiTotal))
			: subtotal + shippingCost + (taxAmount ?? BigInt(0));

	return (
		<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
			{order.status !== "cancelled" && (
				<TrackPurchase
					purchase={{
						orderId: order.id,
						createdAt: order.createdAt,
						currency,
						value: minorUnitsToMajor({ amount: total, currency }),
						// 含税单价和 `sku || variant id`，与商品 feed 及广告漏斗保持一致。
						items: lineItems.map((item) => ({
							id: item.productVariant.sku || item.productVariant.id,
							name: item.productVariant.product.name,
							price: minorUnitsToMajor({
								amount: displayPrice(item.productVariant, "inclusive"),
								currency,
							}),
							quantity: item.quantity,
						})),
						email: customer?.email,
					}}
				/>
			)}
			{/* 支付成功页面头部 */}
			<div className="text-center mb-10">
				<div className="flex justify-center mb-4">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
						<CheckCircle className="h-8 w-8 text-green-600" />
					</div>
				</div>
				<h1 className="text-3xl font-semibold tracking-tight">Thank you for your order!</h1>
				<p className="text-muted-foreground mt-2">Order #{order.lookup} has been confirmed</p>
				{customer?.email && (
					<p className="text-sm text-muted-foreground mt-1">
						A confirmation email will be sent to {customer.email}
					</p>
				)}
			</div>

			{/* 课程交付（静默：仅当订单包含课程权限时展示）。
			    旧版本平台不会下发该字段，因此运行时可能不存在。 */}
			{courses.length > 0 && (
				<div className="mb-10 rounded-lg border border-border p-6 text-center">
					<h2 className="font-medium">
						{courses.length === 1 ? "Your course is ready" : "Your courses are ready"}
					</h2>
					<p className="text-sm text-muted-foreground mt-1">
						Sign in to your account with {customer?.email ?? "the email you ordered with"} to open it.
					</p>
					<div className="mt-4 flex flex-wrap justify-center gap-2">
						{courses.map((course) => (
							<a key={course.url} href={course.url} className={buttonVariants()}>
								{courses.length === 1 ? "Go to course" : course.title}
							</a>
						))}
					</div>
				</div>
			)}

			{/* 订单商品清单 */}
			<div className="border border-border rounded-lg overflow-hidden">
				<div className="bg-secondary/50 px-6 py-4 border-b border-border">
					<h2 className="font-medium">Order Items</h2>
				</div>
				<div className="divide-y divide-border">
					{lineItems.map((item) => (
						<OrderItem key={item.id} item={item} />
					))}
				</div>

				{/* 费用明细汇总 */}
				<div className="bg-secondary/30 px-6 py-4 space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Subtotal</span>
						<span>{formatMoney({ amount: subtotal, currency, locale })}</span>
					</div>
					{shipping && (
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Shipping ({shipping.name})</span>
							<span>{formatMoney({ amount: shippingCost, currency, locale })}</span>
						</div>
					)}
					{taxAmount !== null && (
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Tax</span>
							<span>{formatMoney({ amount: taxAmount, currency, locale })}</span>
						</div>
					)}
					{includedTax !== null && (
						<div className="flex items-center justify-between text-sm">
							<span className="text-muted-foreground">Includes tax</span>
							<span>{formatMoney({ amount: includedTax, currency, locale })}</span>
						</div>
					)}
					<div className="flex items-center justify-between font-semibold pt-2 border-t border-border">
						<span>Total</span>
						<span>{formatMoney({ amount: total, currency, locale })}</span>
					</div>
				</div>
			</div>

			{/* 配送地址 */}
			{shippingAddress && (
				<div className="border border-border rounded-lg overflow-hidden mt-6">
					<div className="bg-secondary/50 px-6 py-4 border-b border-border">
						<h2 className="font-medium">Shipping Address</h2>
					</div>
					<div className="px-6 py-4 text-sm text-muted-foreground">
						{shippingAddress.name && <p className="text-foreground font-medium">{shippingAddress.name}</p>}
						{shippingAddress.line1 && <p>{shippingAddress.line1}</p>}
						{shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
						<p>
							{[shippingAddress.city, shippingAddress.state, shippingAddress.postalCode]
								.filter(Boolean)
								.join(", ")}
						</p>
						{shippingAddress.country && <p>{shippingAddress.country}</p>}
					</div>
				</div>
			)}

			{/* 继续购物按钮 */}
			<div className="mt-8 text-center">
				<Link href="/" className={buttonVariants()}>
					Continue Shopping
				</Link>
			</div>
		</div>
	);
};

// 直接引用 API 类型而非重新声明：行项目的变体携带了含税毛额对应项
// （`priceGross`、`calculatedPriceGross` 等），`displayPrice` 会从中进行挑选。
type OrderLineItem = APIOrderGetByIdResult["orderData"]["lineItems"][number];

async function OrderItem({ item }: { item: OrderLineItem }) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const { productVariant, quantity } = item;
	const { product } = productVariant;

	const image = getProductThumbnail(productVariant.images) ?? getProductThumbnail(product.images);
	const price = BigInt(displayPrice(productVariant, taxBehavior));
	const lineTotal = price * BigInt(quantity);

	return (
		<div className="flex gap-4 p-6">
			{/* 商品图片 */}
			<Link
				href={`/product/${product.slug}`}
				className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-secondary"
			>
				{image && <YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="80px" />}
			</Link>

			{/* 商品详情 */}
			<div className="flex min-w-0 flex-1 flex-col justify-between">
				<div>
					<Link
						href={`/product/${product.slug}`}
						className="text-sm font-medium leading-tight text-foreground hover:underline line-clamp-2"
					>
						{product.name}
					</Link>
					<p className="text-sm text-muted-foreground mt-1">Qty: {quantity}</p>
				</div>
				<p className="text-sm font-semibold">{formatMoney({ amount: lineTotal, currency, locale })}</p>
			</div>
		</div>
	);
}
