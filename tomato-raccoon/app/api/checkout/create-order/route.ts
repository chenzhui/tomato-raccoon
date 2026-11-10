import { NextResponse } from "next/server";
import { pool, ensureDbTables } from "@/lib/db";
import { createPrintifyOrder } from "@/lib/printify";
import { getMockProducts } from "@/lib/mock-data";

export async function POST(req: Request) {
	try {
		await ensureDbTables();
		const body = await req.json();

		const orderId = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		const orderNumber = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
		let trackingNumber: string | null = null;
		let printifyOrderId: string | null = null;

		const email = body.customer?.email || body.email || "supporter@example.com";
		const name = body.customer?.name || body.customerName || "Grassroots Supporter";
		const customer = { email, name };

		const rawShipping = body.shippingAddress || {};
		const shippingAddress = {
			...rawShipping,
			name: rawShipping.name || customer.name,
			address1: rawShipping.address1 || rawShipping.line1 || "123 Main St",
			address2: rawShipping.address2 || rawShipping.line2 || "",
			line1: rawShipping.address1 || rawShipping.line1 || "123 Main St",
			line2: rawShipping.address2 || rawShipping.line2 || "",
			city: rawShipping.city || "Richmond",
			state: rawShipping.state || "VA",
			postalCode: rawShipping.postalCode || rawShipping.zip || "23219",
			zip: rawShipping.zip || rawShipping.postalCode || "23219",
			country: rawShipping.country || "US",
		};

		const rawItems = body.items || [];
		const allProducts = getMockProducts();

		// 解析真实变体对应的 Printify 商品与变体 ID
		const enrichedItems = rawItems.map((it: any) => {
			let foundProduct = null;
			let foundVariant = null;

			for (const p of allProducts) {
				const v = p.variants.find((vItem) => vItem.id === String(it.variantId || it.id));
				if (v) {
					foundProduct = p;
					foundVariant = v;
					break;
				}
			}

			return {
				id: it.id || it.variantId || "item-1",
				variantId: it.variantId || it.id,
				name: it.name || foundProduct?.name || "Tomato Raccoon Protest Gear",
				price: it.price || foundVariant?.price || 3200,
				quantity: it.quantity || 1,
				images: it.images || foundVariant?.images || foundProduct?.images || ["/images/raccoon-tomato.svg"],
				printifyProductId: it.printifyProductId || foundProduct?.printifyProductId || foundProduct?.id || "6af1e37a0d44c7beaa022065",
				printifyVariantId: it.printifyVariantId || foundVariant?.printifyVariantId || 73203,
			};
		});

		const subtotal = body.subtotal || 3200;
		const total = body.total || 3200;

		// 尝试自动向 Printify 提交生产订单
		if (process.env.PRINTIFY_API_TOKEN) {
			try {
				const names = customer.name.split(" ");
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
						address1: shippingAddress.address1,
						address2: shippingAddress.address2 || undefined,
						zip: shippingAddress.zip,
					},
					line_items: enrichedItems.map((it: any) => ({
						product_id: it.printifyProductId,
						variant_id: Number(it.printifyVariantId) || 73203,
						quantity: it.quantity || 1,
					})),
				});
				printifyOrderId = printifyOrder.id;
				console.log(`[Printify] 自动履约提交成功，Printify 订单号: ${printifyOrderId}`);
			} catch (printifyErr) {
				console.warn("[Printify] 自动推送失败 (降级为本地持久化):", printifyErr);
			}
		}

		await pool.query(
			`INSERT INTO orders (
				id, order_number, customer_email, customer_name,
				shipping_address, items, subtotal, total,
				currency, payment_status, shipping_status, tracking_number, printify_order_id
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'USD', 'paid', 'processing', $9, $10)`,
			[
				orderId,
				orderNumber,
				customer.email,
				customer.name,
				JSON.stringify(shippingAddress),
				JSON.stringify(enrichedItems),
				subtotal,
				total,
				trackingNumber,
				printifyOrderId,
			],
		);
		console.log(`[Database] Created order ${orderNumber} in PostgreSQL!`);

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
