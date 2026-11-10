/**
 * Printify 官方 REST API 自动化履约对接模块
 * 用于在买家结账付款成功后，自动向 Printify 提交订单并由美国本土印刷厂生产发货 (USPS)
 */

const PRINTIFY_BASE_URL = 'https://api.printify.com/v1';

export interface PrintifyAddress {
	first_name: string;
	last_name: string;
	email: string;
	phone?: string;
	country: string;
	region: string; // State / Province, e.g. "VA"
	address1: string;
	address2?: string;
	city: string;
	zip: string;
}

export interface PrintifyLineItem {
	print_provider_id?: number;
	blueprint_id?: number;
	variant_id: number;
	quantity: number;
}

export interface CreateOrderPayload {
	external_id: string; // 独立站订单号, 如 "TR-982143"
	label?: string;
	line_items: PrintifyLineItem[];
	shipping_method: number; // 1 = Standard (USPS 3-5 days)
	send_shipping_notification: boolean;
	address_to: PrintifyAddress;
}

/**
 * 获取 Printify API 鉴权头
 */
function getHeaders() {
	const token = process.env.PRINTIFY_API_TOKEN;
	if (!token) {
		console.warn('[Printify API] 警告: 未配置 PRINTIFY_API_TOKEN 环境变量');
	}
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token || ''}`,
	};
}

/**
 * 获取绑定的店铺列表
 */
export async function getPrintifyShops() {
	const res = await fetch(`${PRINTIFY_BASE_URL}/shops.json`, {
		headers: getHeaders(),
		next: { revalidate: 3600 },
	});
	if (!res.ok) {
		throw new Error(`Failed to fetch Printify shops: ${res.statusText}`);
	}
	return res.json();
}

/**
 * 自动向 Printify 提交生产订单
 * @param payload 订单收件人与商品变体数据
 */
export async function createPrintifyOrder(payload: CreateOrderPayload) {
	const shopId = process.env.PRINTIFY_SHOP_ID || '29674533'; // 默认店铺 ID
	const res = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/orders.json`, {
		method: 'POST',
		headers: getHeaders(),
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		const errData = await res.json().catch(() => ({}));
		console.error('[Printify Order Failed]:', errData);
		throw new Error(`Printify order creation failed: ${JSON.stringify(errData)}`);
	}

	const data = await res.json();
	console.log(`[Printify Order Success] 订单创建成功，Printify ID: ${data.id}, 状态: ${data.status}`);
	return data;
}

/**
 * 获取指定订单的物流运单号与发货状态
 */
export async function getPrintifyOrderTracking(orderId: string) {
	const shopId = process.env.PRINTIFY_SHOP_ID || '29674533';
	const res = await fetch(`${PRINTIFY_BASE_URL}/shops/${shopId}/orders/${orderId}.json`, {
		headers: getHeaders(),
	});
	if (!res.ok) return null;
	const order = await res.json();
	return {
		status: order.status,
		trackingNumber: order.shipments?.[0]?.number || null,
		trackingUrl: order.shipments?.[0]?.url || null,
		carrier: order.shipments?.[0]?.carrier || 'USPS',
	};
}
