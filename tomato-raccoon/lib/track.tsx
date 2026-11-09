"use client";

// ─── Storefront 分析约定（厂商中立，保持精简） ────────────────────────────────
// 组件在此处发布电商事件；由平台提供的 storefront kit（通过 instrumentation-client.ts 注入）
// 消费该事件队列，并转发至店铺所配置的任意跟踪器（Meta Pixel 等）。特定跟踪器的
// 逻辑位于平台中，而非此仓库 —— 切勿在模板代码中添加跟踪器代码段（fbq、gtag 等）。

import { useEffect } from "react";
import { CURRENCY } from "@/lib/constants";
import { minorUnitsToMajor } from "@/lib/money";

export type TrackedVariant = {
	id: string;
	sku?: string | null;
	/** 次要货币单位，按 API 返回的格式 —— 内部进行换算。 */
	price: string;
};

type TrackedItem = {
	id: string;
	name: string;
	price: number;
	quantity?: number;
	currency: string;
};

/** 跟踪器接收到的已下单订单：按订单自身货币的主要单位计。 */
export type TrackedPurchase = {
	orderId: string;
	/** 下单的 ISO 时间戳；kit 会忽略超过 1 天的订单（即重复访问）。 */
	createdAt: string;
	currency: string;
	value: number;
	items: { id: string; name: string; price: number; quantity: number }[];
	email?: string | null;
};

type QueueItem =
	| ({ event: "ViewContent" | "AddToCart" } & TrackedItem)
	| { event: "ConsentChanged" }
	| { event: "Identify"; email: string }
	| ({ event: "Purchase" } & TrackedPurchase);

declare global {
	interface Window {
		ynsTrackQueue?: QueueItem[];
	}
}

const publish = (item: QueueItem) => {
	window.ynsTrackQueue = window.ynsTrackQueue || [];
	window.ynsTrackQueue.push(item);
	window.dispatchEvent(new Event("yns:track"));
};

/** 与商品 Feed 相同的 item id 规范：已设置时为变体 sku，否则为变体 id。 */
const trackItemId = (variant: TrackedVariant) => variant.sku || variant.id;

const toItem = (variant: TrackedVariant, name: string, quantity?: number): TrackedItem => ({
	id: trackItemId(variant),
	name,
	price: minorUnitsToMajor({ amount: variant.price, currency: CURRENCY }),
	quantity,
	currency: CURRENCY,
});

/** 发布加购事件。通过队列缓冲，因此在 kit 加载完成前调用也是安全的。 */
export const trackAddToCart = (variant: TrackedVariant, name: string, quantity: number) =>
	publish({ event: "AddToCart", ...toItem(variant, name, quantity) });

/** 通知 kit 用户许可 Cookie 已更改，以便其重新读取（无需刷新页面）。 */
export const notifyConsentChanged = () => publish({ event: "ConsentChanged" });

/** 访客提供了邮箱（订阅通讯），以便跟踪器将其与联系人进行匹配。 */
export const trackIdentify = (email: string) => publish({ event: "Identify", email });

/** 触发一次的商品浏览事件 —— 挂载在商品详情页。 */
export function TrackProductView({ variant, name }: { variant: TrackedVariant; name: string }) {
	const itemId = trackItemId(variant);
	// biome-ignore lint/correctness/useExhaustiveDependencies: 每个商品仅触发一次，而非每次渲染触发
	useEffect(() => {
		publish({ event: "ViewContent", ...toItem(variant, name) });
	}, [itemId]);
	return null;
}

/**
 * 触发一次的购买事件 —— 挂载在订单确认页。kit 会针对每个订单和浏览器向 GTM 和各个
 * Pixel 发送一次，因此刷新或后续再次访问不会重复计算销售额。
 */
export function TrackPurchase({ purchase }: { purchase: TrackedPurchase }) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: 每个订单仅触发一次，而非每次渲染触发
	useEffect(() => {
		publish({ event: "Purchase", ...purchase });
	}, [purchase.orderId]);
	return null;
}
