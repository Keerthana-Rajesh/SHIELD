const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ================================
   🔹 MySQL Connection (Pool)
================================ */

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Lumos@Root2345", // change if needed
  database: "sheild_db",
  connectionLimit: 10,
});

db.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
    connection.release();
  }
});

/* ================================
   🔹 SEND OTP
================================ */

app.post("/send-otp", (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Phone number required",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const sql =
    "INSERT INTO otp_verifications (phone, otp, created_at) VALUES (?, ?, NOW())";

  db.query(sql, [phone, otp], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Failed to store OTP",
      });
    }

    console.log(`📱 OTP for ${phone} is ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  });
});

/* ================================
   🔹 VERIFY OTP
================================ */

app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  const sql = `
    SELECT * FROM otp_verifications 
    WHERE phone = ? AND otp = ?
    AND created_at >= NOW() - INTERVAL 5 MINUTE
    ORDER BY created_at DESC 
    LIMIT 1
  `;

  db.query(sql, [phone, otp], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false });
    }

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP valid → Check if user exists
    db.query(
      "SELECT * FROM users WHERE phone = ?",
      [phone],
      (err2, userResult) => {
        if (err2) {
          return res.status(500).json({ success: false });
        }

        if (userResult.length > 0) {
          return res.json({
            success: true,
            existingUser: true,
            user: userResult[0],
          });
        } else {
          return res.json({
            success: true,
            existingUser: false,
          });
        }
      }
    );
  });
});

/* ================================
   🔹 REGISTER NEW USER
================================ */

app.post("/register-user", (req, res) => {
  const { name, age, bloodGroup, notes, password, aiEnabled, phone } = req.body;

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const sql = `
    INSERT INTO users 
    (name, age, blood_group, notes, password, ai_enabled, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, age, bloodGroup, notes, password, aiEnabled, phone],
    (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      res.json({
        success: true,
        message: "User registered successfully",
      });
    }
  );
});

/* ================================
   🔹 GET USER BY PHONE
================================ */

app.get("/user/:phone", (req, res) => {
  const { phone } = req.params;

  db.query(
    "SELECT * FROM users WHERE phone = ?",
    [phone],
    (err, results) => {
      if (err) {
        return res.status(500).json({ success: false });
      }

      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    }
  );
});

/* ================================
   🔹 UPDATE USER
================================ */

app.put("/update-user/:phone", (req, res) => {
  const { phone } = req.params;
  const { age, bloodGroup, notes, aiEnabled } = req.body;

  const sql = `
    UPDATE users 
    SET age = ?, blood_group = ?, notes = ?, ai_enabled = ?
    WHERE phone = ?
  `;

  db.query(sql, [age, bloodGroup, notes, aiEnabled, phone], (err) => {
    if (err) {
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
    });
  });
});

/* ================================
   🔹 START SERVER
================================ */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
