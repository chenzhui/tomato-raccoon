import { Pool } from "pg";

const connectionString =
	process.env.DATABASE_URL ||
	"postgresql://postgres:aiguide123456@111.229.139.144:5432/shop_aichan";

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

export async function ensureDbTables() {
	if (dbInitialized) return;
	try {
		const client = await pool.connect();
		try {
			await client.query(`
			CREATE TABLE IF NOT EXISTS products (
				id VARCHAR(64) PRIMARY KEY,
				slug VARCHAR(128) UNIQUE NOT NULL,
				name VARCHAR(255) NOT NULL,
				tagline VARCHAR(255),
				description TEXT,
				price INT NOT NULL,
				compare_at_price INT,
				category VARCHAR(64) NOT NULL,
				character_key VARCHAR(64) NOT NULL,
				badge_image VARCHAR(512),
				full_image VARCHAR(512),
				stock INT DEFAULT 100,
				created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
			);

			CREATE TABLE IF NOT EXISTS orders (
				id VARCHAR(64) PRIMARY KEY,
				order_number VARCHAR(64) UNIQUE NOT NULL,
				customer_email VARCHAR(255) NOT NULL,
				customer_name VARCHAR(255) NOT NULL,
				shipping_address JSONB NOT NULL,
				items JSONB NOT NULL,
				subtotal INT NOT NULL,
				discount INT DEFAULT 0,
				total INT NOT NULL,
				currency VARCHAR(8) DEFAULT 'USD',
				payment_status VARCHAR(32) DEFAULT 'paid',
				shipping_status VARCHAR(32) DEFAULT 'processing',
				tracking_number VARCHAR(128),
				printify_order_id VARCHAR(64),
				created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
			);

			CREATE TABLE IF NOT EXISTS reviews (
				id VARCHAR(64) PRIMARY KEY,
				character_key VARCHAR(64) NOT NULL,
				author_name VARCHAR(128) NOT NULL,
				author_title VARCHAR(128),
				location VARCHAR(128),
				rating INT DEFAULT 5,
				comment TEXT NOT NULL,
				verified_purchase BOOLEAN DEFAULT TRUE,
				created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
			);

			CREATE TABLE IF NOT EXISTS cart_sessions (
				id VARCHAR(64) PRIMARY KEY,
				items JSONB NOT NULL,
				updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
			);

			CREATE TABLE IF NOT EXISTS return_tickets (
				id VARCHAR(64) PRIMARY KEY,
				order_number VARCHAR(64) NOT NULL,
				customer_email VARCHAR(255) NOT NULL,
				reason VARCHAR(64) NOT NULL,
				details TEXT,
				evidence_photo_url VARCHAR(512),
				status VARCHAR(32) DEFAULT 'PENDING_REVIEW',
				created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
			);
		`);

			dbInitialized = true;
		} finally {
			client.release();
		}
	} catch (err) {
		console.warn("ensureDbTables warning (running with fallback if unavailable):", err);
	}
}
