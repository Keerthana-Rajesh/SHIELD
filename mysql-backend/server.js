const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔹 MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Lumos@Root2345', // change this
  database: 'sheild_db'
});

db.connect((err) => {
  if (err) {
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL");
  }
});

// 🔹 Insert User API
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  
  db.query(sql, [name, email], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err });
    } else {
      res.json({ message: "User inserted successfully" });
    }
  });
});

// 🔹 Start Server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});

app.get('/users', (req, res) => {
  db.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err });
    } else {
      res.json({ message: "User deleted successfully" });
    }
  });
});

// 🔹 Update User
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";

  db.query(sql, [name, email, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err });
    } else {
      res.json({ message: "User updated successfully" });
    }
  });
});

// 🔹 Send OTP
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  db.query(
    "INSERT INTO otp_verifications (phone, otp) VALUES (?, ?)",
    [phone, otp],
    async (err) => {
      if (err) return res.status(500).json({ error: err });

      // TODO: Replace this with real SMS API
      console.log("OTP for", phone, "is", otp);

      res.json({ message: "OTP sent successfully" });
    }
  );
});


// 🔹 Verify OTP
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  db.query(
    "SELECT * FROM otp_verifications WHERE phone=? AND otp=? ORDER BY created_at DESC LIMIT 1",
    [phone, otp],
    (err, results) => {
      if (err) return res.status(500).json({ error: err });

      if (results.length > 0) {
        res.json({ success: true });
      } else {
        res.status(400).json({ success: false });
      }
    }
  );
});
