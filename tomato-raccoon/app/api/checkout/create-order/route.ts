import { NextResponse } from "next/server";
import { pool, ensureDbTables } from "@/lib/db";
import { createPrintifyOrder } from "@/lib/printify";

export async function POST(req: Request) {
  try {
    await ensureDbTables();

    const body = await req.json();
    const { items, shippingAddress, subtotal, shipping, total } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, message: "Cart items are required" }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.email || !shippingAddress.address1) {
      return NextResponse.json({ success: false, message: "Valid shipping address is required" }, { status: 400 });
    }

    // 生成唯一独立站订单号
    const orderNumber = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // 尝试向 Printify 提交真实生产订单
    let printifyOrderId: string | null = null;
    try {
      if (process.env.PRINTIFY_API_TOKEN) {
        const lineItems = items
          .filter((it: any) => it.printifyVariantId)
          .map((it: any) => ({
            product_id: it.printifyProductId,
            variant_id: Number(it.printifyVariantId),
            quantity: Number(it.quantity) || 1,
          }));

        if (lineItems.length > 0) {
          const printifyRes = await createPrintifyOrder({
            external_id: orderNumber,
            label: `Tomato Raccoon: ${orderNumber}`,
            line_items: lineItems,
            shipping_method: 1, // USPS Standard
            send_shipping_notification: true,
            address_to: {
              first_name: shippingAddress.firstName || "Grassroots",
              last_name: shippingAddress.lastName || "Supporter",
              email: shippingAddress.email,
              phone: shippingAddress.phone || "8045550199",
              country: "US",
              region: shippingAddress.region || "VA",
              address1: shippingAddress.address1,
              address2: shippingAddress.address2 || "",
              city: shippingAddress.city || "Richmond",
              zip: shippingAddress.zip || "23219",
            },
          });
          printifyOrderId = printifyRes?.id || null;
        }
      }
    } catch (printifyErr) {
      console.warn("Printify order dispatch warning (order recorded locally):", printifyErr);
    }

    // 存入 Supabase 数据库
    const customerName = `${shippingAddress.firstName || ""} ${shippingAddress.lastName || ""}`.trim() || "Protest Supporter";

    try {
      await pool.query(
        `INSERT INTO orders (
          id, order_number, customer_email, customer_name,
          shipping_address, items, subtotal, shipping, total,
          currency, payment_status, shipping_status, printify_order_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          orderId,
          orderNumber,
          shippingAddress.email,
          customerName,
          JSON.stringify(shippingAddress),
          JSON.stringify(items),
          subtotal,
          shipping,
          total,
          "USD",
          "paid",
          "processing",
          printifyOrderId,
        ]
      );
    } catch (dbErr) {
      console.error("Database save error in checkout:", dbErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      printifyOrderId,
    });
  } catch (err: any) {
    console.error("Checkout route error:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
