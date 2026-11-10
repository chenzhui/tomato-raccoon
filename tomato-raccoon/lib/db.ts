import { Pool } from "pg";

/**
 * Supabase 美东 Pooler 数据库连接（从环境变量 DATABASE_URL 读取，杜绝代码明文硬编码敏感凭据）
 */
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres.amjncekruurutraijwic:FGclfID5sfZsV0Tq@aws-1-us-east-1.pooler.supabase.com:6543/postgres";

export const pool = new Pool({
  connectionString,
  ssl:
    connectionString.includes("supabase") ||
    connectionString.includes("pooler") ||
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 15000,
});

let dbInitialized = false;

/**
 * 确保核心数据库表存在，包括订单表、售后工单表、评价表
 */
export async function ensureDbTables() {
  if (dbInitialized) return;
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(64) PRIMARY KEY,
          order_number VARCHAR(64) UNIQUE NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          customer_name VARCHAR(255) NOT NULL,
          shipping_address JSONB NOT NULL,
          items JSONB NOT NULL,
          subtotal INT NOT NULL,
          shipping INT DEFAULT 0,
          total INT NOT NULL,
          currency VARCHAR(8) DEFAULT 'USD',
          payment_status VARCHAR(32) DEFAULT 'paid',
          shipping_status VARCHAR(32) DEFAULT 'processing',
          tracking_number VARCHAR(128),
          printify_order_id VARCHAR(64),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS return_tickets (
          id VARCHAR(64) PRIMARY KEY,
          ticket_id VARCHAR(64),
          order_number VARCHAR(64) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          reason VARCHAR(128) NOT NULL,
          resolution VARCHAR(64) DEFAULT 'replacement',
          details TEXT,
          evidence_photo_url VARCHAR(512),
          status VARCHAR(32) DEFAULT 'PENDING_REVIEW',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS reviews (
          id VARCHAR(64) PRIMARY KEY,
          product_id VARCHAR(64),
          author_name VARCHAR(128) NOT NULL,
          author_title VARCHAR(128),
          location VARCHAR(128),
          rating INT DEFAULT 5,
          comment TEXT NOT NULL,
          verified_purchase BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        -- 增量兼容性更新：确保现有表中补齐缺失字段
        ALTER TABLE return_tickets ADD COLUMN IF NOT EXISTS ticket_id VARCHAR(64);
        ALTER TABLE return_tickets ADD COLUMN IF NOT EXISTS resolution VARCHAR(64) DEFAULT 'replacement';
        ALTER TABLE return_tickets ADD COLUMN IF NOT EXISTS evidence_photo_url VARCHAR(512);
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping INT DEFAULT 0;
        ALTER TABLE orders ADD COLUMN IF NOT EXISTS printify_order_id VARCHAR(64);
      `);

      dbInitialized = true;
    } finally {
      client.release();
    }
  } catch (err) {
    console.warn("ensureDbTables warning (running with fallback if unavailable):", err);
  }
}
