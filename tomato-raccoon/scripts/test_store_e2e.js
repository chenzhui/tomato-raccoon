const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

function getConnectionString() {
  const envPath = path.join(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      if (line.startsWith("DATABASE_URL=")) {
        return line.substring("DATABASE_URL=".length).trim().replace(/^['"]|['"]$/g, "");
      }
    }
  }
  return "postgresql://postgres.amjncekruurutraijwic:FGclfID5sfZsV0Tq@aws-1-us-east-1.pooler.supabase.com:6543/postgres";
}

async function main() {
  console.log("Starting store E2E verification...");

  const connectionString = getConnectionString();
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 2,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 10000,
  });

  console.log("Connecting to Supabase PostgreSQL pooler...");
  const client = await pool.connect();
  console.log("✓ Connected to Supabase PostgreSQL successfully!");
  
  await client.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping INT DEFAULT 0;");
  client.release();

  // 1. Direct database insert test
  const testOrderNum = `TR-${Math.floor(100000 + Math.random() * 900000)}`;
  const orderId = `test-ord-${Date.now()}`;

  await pool.query(
    `INSERT INTO orders (
      id, order_number, customer_email, customer_name,
      shipping_address, items, subtotal, shipping, total,
      currency, payment_status, shipping_status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      orderId,
      testOrderNum,
      "supporter@test.org",
      "Hanover Supporter",
      JSON.stringify({ address1: "123 Tomato Way", city: "Richmond", region: "VA", zip: "23219" }),
      JSON.stringify([{ name: "Comfort Colors Vintage Tee", quantity: 1, price: 3200 }]),
      3200,
      499,
      3699,
      "USD",
      "paid",
      "processing",
    ]
  );
  console.log(`✓ Test order ${testOrderNum} inserted into Supabase orders table successfully`);

  // Verify lookup
  const res = await pool.query(`SELECT * FROM orders WHERE order_number = $1`, [testOrderNum]);
  if (res.rows.length === 1 && res.rows[0].order_number === testOrderNum) {
    console.log(`✓ Order lookup verified: Customer=${res.rows[0].customer_name}, Total=$${(res.rows[0].total / 100).toFixed(2)}`);
  } else {
    throw new Error("Order lookup failed in database");
  }

  // 2. Test return ticket
  const ticketId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;
  await pool.query(
    `INSERT INTO return_tickets (
      id, ticket_id, order_number, customer_email, reason, resolution, details, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      `ret-${Date.now()}`,
      ticketId,
      testOrderNum,
      "supporter@test.org",
      "print_flaw",
      "replacement",
      "E2E Automated test ticket",
      "PENDING_REVIEW",
    ]
  );
  console.log(`✓ Return ticket ${ticketId} created in Supabase return_tickets table successfully`);

  // Clean up test records
  await pool.query(`DELETE FROM orders WHERE id = $1`, [orderId]);
  await pool.query(`DELETE FROM return_tickets WHERE ticket_id = $1`, [ticketId]);
  console.log("✓ Test cleanup completed");

  await pool.end();
  console.log("🎉 All E2E Database & Supabase connection tests passed with 100% success!");
}

main().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
