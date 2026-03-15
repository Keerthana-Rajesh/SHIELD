const mysql = require("mysql2");
require("dotenv").config({ path: "c:/Users/HP/Krishna/Mini Project/SHEILD/mysql-backend/.env" });

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
  
  const sql = "ALTER TABLE Trusted_Contact ADD COLUMN email VARCHAR(255) AFTER trusted_no";
  db.query(sql, (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_COLUMN_NAME') {
        console.log("Column 'email' already exists.");
      } else {
        console.error("Error altering table:", err);
      }
    } else {
      console.log("Successfully added 'email' column to Trusted_Contact table.");
    }
    db.end();
  });
});
