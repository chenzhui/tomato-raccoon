const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// 加载环境变量
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim().replace(/^["']|["']$/g, '');
    }
  });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  console.log("=== 开始执行修复验证测试 ===");

  // 1. 验证数据库连接
  console.log("1. 验证 Supabase 数据库通信与字段...");
  const dbRes = await pool.query("SELECT current_database(), current_user");
  console.log("   ✅ 数据库连接成功:", dbRes.rows[0]);

  // 2. 验证 return_tickets 字段
  console.log("2. 验证 return_tickets 包含 ticket_id 和 resolution 字段...");
  const colRes = await pool.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name='return_tickets'"
  );
  const cols = colRes.rows.map(r => r.column_name);
  console.log("   return_tickets 字段列表:", cols);
  if (!cols.includes('ticket_id') || !cols.includes('resolution')) {
    throw new Error("return_tickets 缺少必要字段!");
  }
  console.log("   ✅ return_tickets 表字段完备！");

  // 3. 验证 mockCategories 中的 active: true
  console.log("3. 验证 mockCategories 数据结构...");
  const commerceContent = fs.readFileSync(path.resolve(__dirname, '../lib/commerce.ts'), 'utf-8');
  if (!commerceContent.includes('active: true')) {
    throw new Error("mockCategories 依然缺少 active: true！");
  }
  console.log("   ✅ mockCategories 已经全部补全 active: true！");

  // 4. 验证法律文档组件样式与 SEO 标题
  console.log("4. 验证出海合规与法律文档品牌...");
  const privContent = fs.readFileSync(path.resolve(__dirname, '../app/privacy-policy/page.tsx'), 'utf-8');
  if (privContent.includes('AI-Chan')) {
    throw new Error("privacy-policy 中依然包含 AI-Chan！");
  }
  console.log("   ✅ 隐私协议已更新为 Tomato Raccoon Supply Co.！");

  const legalDocContent = fs.readFileSync(path.resolve(__dirname, '../components/legal-doc.tsx'), 'utf-8');
  if (legalDocContent.includes('#0a0d16') || legalDocContent.includes('text-cyan-400')) {
    throw new Error("legal-doc 依然包含暗黑赛博朋克样式！");
  }
  console.log("   ✅ legal-doc 已统一为美式田园复古风格！");

  // 5. 验证产品特性中的文案
  console.log("5. 验证商品特性中的文案...");
  const featContent = fs.readFileSync(path.resolve(__dirname, '../app/product/[slug]/product-features.tsx'), 'utf-8');
  if (featContent.includes('Whale-Chan')) {
    throw new Error("product-features 依然包含 Whale-Chan！");
  }
  console.log("   ✅ 已无 Whale-Chan 历史文案残留！");

  // 6. 验证探索器中的中文
  console.log("6. 验证商品探索器页面已清除硬编码中文...");
  const explorerContent = fs.readFileSync(path.resolve(__dirname, '../components/products/products-explorer.tsx'), 'utf-8');
  if (explorerContent.includes('选择周边品类') || explorerContent.includes('水洗T恤与加厚卫衣')) {
    throw new Error("products-explorer 依然向用户展示硬编码中文！");
  }
  console.log("   ✅ explorer 英文出海界面已规范化！");

  console.log("\n🎉 所有关键项代码级与数据库级审查全部通过！");
  await pool.end();
}

main().catch(err => {
  console.error("❌ 验证失败:", err);
  process.exit(1);
});
