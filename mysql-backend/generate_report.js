const db = require("./config/db");
const fs = require('fs');

async function check() {
  let report = "SHEILD DB REPORT\n================\n";
  try {
    const [tables] = await db.query("SHOW TABLES");
    const tableNames = tables.map(t => Object.values(t)[0]);
    
    for (const table of tableNames) {
        report += `\nTable: ${table}\n----------------\n`;
        const [columns] = await db.query(`DESCRIBE ${table}`);
        columns.forEach(c => {
            report += `- ${c.Field} (${c.Type})${c.Key === 'PRI' ? ' [PK]' : ''}${c.Extra === 'auto_increment' ? ' [AI]' : ''}\n`;
        });
    }
    
    fs.writeFileSync('db_report_fixed.txt', report);
    console.log("✅ Report saved to db_report_fixed.txt");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed:", err.message);
    process.exit(1);
  }
}

check();
