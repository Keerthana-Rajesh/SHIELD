const db = require("./config/db");

async function check() {
  try {
    const [tables] = await db.query("SHOW TABLES");
    const tableNames = tables.map(t => Object.values(t)[0]);
    console.log("Existing Tables:", tableNames);
    
    for (const table of tableNames) {
        try {
            const [columns] = await db.query(`DESCRIBE ${table}`);
            console.log(`Table: ${table} | Columns:`, columns.map(c => c.Field));
        } catch(e) {
            console.log(`Error checking table ${table}:`, e.message);
        }
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Failed to list tables:", err.message);
    process.exit(1);
  }
}

check();
