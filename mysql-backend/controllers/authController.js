const db = require("../config/db");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: "Email required" });
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    await db.query("INSERT INTO email_otps (email, otp) VALUES (?, ?)", [email, otp]);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your SHIELD OTP Code",
      text: `Your OTP code is ${otp}. It expires in 5 minutes.`,
    });
    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Missing fields" });
  try {
    const [results] = await db.query(
      "SELECT * FROM email_otps WHERE email = ? AND otp = ? AND created_at >= NOW() - INTERVAL 5 MINUTE ORDER BY created_at DESC LIMIT 1",
      [email, otp]
    );
    if (results.length === 0) return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

    const [userResult] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (userResult.length > 0) {
      return res.json({ success: true, existingUser: true, user: userResult[0] });
    } else {
      return res.json({ success: true, existingUser: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

const registerUser = async (req, res) => {
  const { name, age, bloodGroup, notes, password, aiEnabled, email } = req.body;
  if (!name || !email) return res.status(400).json({ success: false, message: "Missing required fields" });
  try {
    await db.query(
      "INSERT INTO users (name, age, blood_group, notes, password, ai_enabled, email) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, age, bloodGroup, notes, password, aiEnabled, email]
    );
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

const getUser = async (req, res) => {
  const { email } = req.params;
  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length > 0) res.json(results[0]);
    else res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

module.exports = {
  sendEmailOTP,
  verifyEmailOTP,
  registerUser,
  getUser,
};
