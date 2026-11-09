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

		// 确保 PostgreSQL 中存在售后工单退换货表（return_tickets）
		try {
			await pool.query(`
				CREATE TABLE IF NOT EXISTS return_tickets (
					id VARCHAR(64) PRIMARY KEY,
					ticket_id VARCHAR(64) UNIQUE NOT NULL,
					order_number VARCHAR(64) NOT NULL,
					customer_email VARCHAR(255) NOT NULL,
					reason VARCHAR(128) NOT NULL,
					resolution VARCHAR(64) NOT NULL,
					details TEXT,
					status VARCHAR(32) DEFAULT 'open',
					created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
				);
			`);

			await pool.query(
				`INSERT INTO return_tickets (
					id, ticket_id, order_number, customer_email, reason, resolution, details, status
				) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending_review')`,
				[
					`ret-${Date.now()}`,
					ticketId,
					orderNumber,
					email,
					reason,
					resolution,
					details,
				],
			);
			console.log(`[Database] Logged after-sales ticket ${ticketId} in PostgreSQL!`);
		} catch (dbErr) {
			console.error("[Database] Error writing to return_tickets:", dbErr);
		}

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
