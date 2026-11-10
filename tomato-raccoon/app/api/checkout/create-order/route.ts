import { NextResponse } from "next/server";
import { pool, ensureDbTables } from "@/lib/db";
import { createPrintifyOrder } from "@/lib/printify";

export async function POST(req: Request) {
	try {
		await ensureDbTables();
		const body = await req.json();

		const orderId = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		const orderNumber = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
		let trackingNumber = `940011189956${Math.floor(1000000000 + Math.random() * 9000000000)}`;
		let printifyOrderId = null;

		const customer = body.customer || { email: "supporter@example.com", name: "Grassroots Activist" };
		const shippingAddress = body.shippingAddress || {};
		const items = body.items || [];
		const subtotal = body.subtotal || 4899;
		const total = body.total || 4899;

		// 尝试自动向 Printify 提交生产订单
		if (process.env.PRINTIFY_API_TOKEN) {
			try {
				const names = (customer.name || "Supporter").split(" ");
				const printifyOrder = await createPrintifyOrder({
					external_id: orderNumber,
					label: "Tomato Raccoon Protest Store Order",
					shipping_method: 1, // Standard Shipping (USPS)
					send_shipping_notification: true,
					address_to: {
						first_name: names[0] || "Valued",
						last_name: names.slice(1).join(" ") || "Customer",
						email: customer.email,
						phone: shippingAddress.phone || "555-0199",
						country: shippingAddress.country || "US",
						region: shippingAddress.state || "VA",
						city: shippingAddress.city || "Richmond",
						address1: shippingAddress.address1 || "123 Main St",
						zip: shippingAddress.zip || "23219",
					},
					line_items: items.map((it: any) => ({
						variant_id: it.printifyVariantId || 43210,
						quantity: it.quantity || 1,
					})),
				});
				printifyOrderId = printifyOrder.id;
				console.log(`[Printify] 自动履约提交成功，Printify 订单号: ${printifyOrderId}`);
			} catch (printifyErr) {
				console.warn("[Printify] 自动推送失败 (降级为本地持久化):", printifyErr);
			}
		}

		try {
			await pool.query(
				`INSERT INTO orders (
					id, order_number, customer_email, customer_name,
					shipping_address, items, subtotal, total,
					currency, payment_status, shipping_status, tracking_number
				) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'USD', 'paid', 'processing', $9)`,
				[
					orderId,
					orderNumber,
					customer.email,
					customer.name,
					JSON.stringify(shippingAddress),
					JSON.stringify(items),
					subtotal,
					total,
					trackingNumber,
				],
			);
			console.log(`[Database] Created order ${orderNumber} in PostgreSQL!`);
		} catch (dbErr) {
			console.error("[Database] Error inserting into orders table:", dbErr);
		}

		return NextResponse.json({
			success: true,
			orderId,
			orderNumber,
			trackingNumber,
			printifyOrderId,
		});
	} catch (err: any) {
		console.error("Failed to create order:", err);
		return NextResponse.json({ success: false, error: err.message }, { status: 500 });
	}
}
