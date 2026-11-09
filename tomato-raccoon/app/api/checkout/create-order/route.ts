import { NextResponse } from "next/server";
import { pool, ensureDbTables } from "@/lib/db";

export async function POST(req: Request) {
	try {
		await ensureDbTables();
		const body = await req.json();

		const orderId = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		const orderNumber = `AI-${Math.floor(100000 + Math.random() * 900000)}`;
		const trackingNumber = `940011189956${Math.floor(1000000000 + Math.random() * 9000000000)}`;

		const customer = body.customer || { email: "dev@example.com", name: "Geek Buyer" };
		const shippingAddress = body.shippingAddress || {};
		const items = body.items || [];
		const subtotal = body.subtotal || 5999;
		const total = body.total || 5999;

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
		});
	} catch (err: any) {
		console.error("Failed to create order:", err);
		return NextResponse.json({ success: false, message: err.message }, { status: 500 });
	}
}
