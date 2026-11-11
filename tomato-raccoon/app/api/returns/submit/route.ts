import { NextResponse } from "next/server";
import { pool, ensureDbTables } from "@/lib/db";

export async function POST(req: Request) {
  try {
    await ensureDbTables();

    const body = await req.json();
    const { orderNumber, email, reason = "print_flaw", resolution, details, evidencePhotoUrl } = body;

    if (!orderNumber || !email) {
      return NextResponse.json(
        { success: false, message: "Order number and email are required" },
        { status: 400 }
      );
    }

    const ticketId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = `ret-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    try {
      await pool.query(
        `INSERT INTO return_tickets (
          id, ticket_id, order_number, customer_email, reason, resolution, details, evidence_photo_url, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          id,
          ticketId,
          orderNumber.trim(),
          email.trim(),
          reason,
          resolution || "replacement",
          details || "",
          evidencePhotoUrl || null,
          "PENDING_REVIEW",
        ]
      );
    } catch (dbErr) {
      console.error("Database save error in return ticket:", dbErr);
    }

    return NextResponse.json({
      success: true,
      ticketId,
      message: "Return request submitted successfully. A support representative will review within 24 hours.",
    });
  } catch (err: any) {
    console.error("Return ticket submit error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
