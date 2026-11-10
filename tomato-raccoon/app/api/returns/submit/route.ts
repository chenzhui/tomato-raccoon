import { NextResponse } from "next/server";
import { pool, ensureDbTables } from "@/lib/db";

export async function POST(req: Request) {
	try {
		await ensureDbTables();
		const body = await req.json();

		const ticketId = `RMA-${Math.floor(100000 + Math.random() * 900000)}`;
		const orderNumber = body.orderNumber || "UNKNOWN";
		const email = body.email || "support@example.com";
		const reason = body.reason || "damaged_in_transit";
		const resolution = body.resolution || "replacement";
		const details = body.details || "";
		// 支持凭证照片（若为 base64 则保留截断或占位，若为 URL 则完整存储）
		const photoRaw = body.photo || body.evidencePhotoUrl || "";
		const evidencePhotoUrl =
			photoRaw.startsWith("http")
				? photoRaw
				: photoRaw.length > 500
					? photoRaw.slice(0, 500)
					: photoRaw || null;

		// 确保在 PostgreSQL 中持久化售后工单退换货记录（return_tickets）
		await pool.query(
			`INSERT INTO return_tickets (
				id, ticket_id, order_number, customer_email, reason, resolution, details, evidence_photo_url, status
			) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending_review')`,
			[
				`ret-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
				ticketId,
				orderNumber,
				email,
				reason,
				resolution,
				details || resolution,
				evidencePhotoUrl,
			],
		);
		console.log(`[Database] Logged after-sales ticket ${ticketId} in PostgreSQL!`);

		return NextResponse.json({
			success: true,
			ticketId,
			orderNumber,
			resolution,
		});
	} catch (err: any) {
		console.error("Failed to submit return ticket:", err);
		return NextResponse.json({ success: false, message: err.message }, { status: 500 });
	}
}
