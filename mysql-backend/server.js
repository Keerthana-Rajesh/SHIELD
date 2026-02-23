const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ================================
   🔹 MySQL Connection Pool
================================ */

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
   🔹 EMAIL TRANSPORTER
================================ */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================================
   🔹 SEND EMAIL OTP
================================ */

app.post("/send-email-otp", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email required",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const sql = `
    INSERT INTO email_otps (email, otp)
    VALUES (?, ?)
  `;

  db.query(sql, [email, otp], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your SHIELD OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Failed to send email",
        });
      }

      res.json({
        success: true,
        message: "OTP sent to email",
      });
    });
  });
});

/* ================================
   🔹 VERIFY EMAIL OTP
================================ */

app.post("/verify-email-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Missing fields",
    });
  }

  const sql = `
    SELECT * FROM email_otps
    WHERE email = ? AND otp = ?
    AND created_at >= NOW() - INTERVAL 5 MINUTE
    ORDER BY created_at DESC
    LIMIT 1
  `;

  db.query(sql, [email, otp], (err, results) => {
    if (err) return res.status(500).json({ success: false });

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      (err2, userResult) => {
        if (err2) return res.status(500).json({ success: false });

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
   🔹 REGISTER USER
================================ */
app.post("/register-user", (req, res) => {
  const { name, age, bloodGroup, notes, password, aiEnabled, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  const sql = `
    INSERT INTO users 
    (name, age, blood_group, notes, password, ai_enabled, email)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, age, bloodGroup, notes, password, aiEnabled, email],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false });
      }

      res.json({ success: true });
    }
  );
});
/* ================================
   🔹 GET USER (BY PHONE OR EMAIL)
================================ */
app.get("/user/:email", (req, res) => {
  const { email } = req.params;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false });

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  });
});
/* ================================
   🔹 UPDATE USER
================================ */
app.put("/update-user/:email", (req, res) => {
  const { email } = req.params;
  const { name, age, bloodGroup, notes, aiEnabled } = req.body;

  const sql = `
    UPDATE users
    SET name = ?, age = ?, blood_group = ?, notes = ?, ai_enabled = ?
    WHERE email = ?
  `;

  db.query(
    sql,
    [name, age, bloodGroup, notes, aiEnabled, email],
    (err) => {
      if (err) return res.status(500).json({ success: false });

      res.json({ success: true });
    }
  );
});
/* ================================
   🔹 ADD CONTACT
================================ */
app.post("/add-contact", async (req, res) => {
  const { email, name, relation, phone, location, notes, gender } = req.body;

  try {
    // 1️⃣ Get user id from email
    const [userRows] = await db.promise().query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = userRows[0].id;

    // 2️⃣ Insert contact using user_id
    await db.promise().query(
      `INSERT INTO contacts 
       (user_id, name, relation, phone, location, notes, gender)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, relation, phone, location, notes, gender]
    );

    res.json({ message: "Contact added successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🔹 UPDATE CONTACT
================================ */
app.post("/update-contact", (req, res) => {
  const { id, name, relation, phone, location, notes, gender } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "Contact ID required" });
  }

  const sql = `
    UPDATE contacts
    SET name = ?, relation = ?, phone = ?, location = ?, notes = ?, gender = ?
    WHERE id = ?
  `;

  db.query(sql, [name, relation, phone, location, notes, gender, id], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json({ success: true, message: "Contact updated successfully" });
  });
});

/* ================================
   🔹 GET CONTACTS BY USER EMAIL
================================ */
app.get("/contacts/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT contacts.*
       FROM contacts
       JOIN users ON contacts.user_id = users.id
       WHERE users.email = ?`,
      [email]
    );

    res.json({ contacts: rows });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
/* ================================
   🔹 DELETE CONTACT
================================ */
app.delete("/delete-contact/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM contacts WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, message: "Contact deleted" });
  });
});


app.put("/update-contact/:id", async (req, res) => {
  const { id } = req.params;
  const { name, relation, phone, location, notes, gender } = req.body;

  try {
    await db.promise().query(
      `UPDATE contacts
       SET name = ?, relation = ?, phone = ?, location = ?, notes = ?, gender = ?
       WHERE id = ?`,
      [name, relation, phone, location, notes, gender, id]
    );

    res.json({ message: "Contact updated successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   🔹 START SERVER
================================ */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
