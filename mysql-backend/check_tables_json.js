const db = require("./config/db");

async function check() {
  try {
    const [tables] = await db.query("SHOW TABLES");
    console.log("📋 Existing tables:", JSON.stringify(tables.map(t => Object.values(t)[0])));
    
    // Check specific columns of activity_log
    try {
        const [columns] = await db.query("DESCRIBE activity_log");
        console.log("📋 Activity Log Columns:", JSON.stringify(columns.map(c => c.Field)));
    } catch(e) {
        console.log("❌ Activity Log Table missing or inaccessible");
    }
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to list tables:", err.message);
    process.exit(1);
  }
}

check();
