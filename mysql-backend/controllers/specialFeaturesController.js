const db = require("../config/db");

const triggerFakeCall = async (req, res) => {
  const { user_id, caller_name, trigger_method } = req.body;
  try {
    await db.query(
      "INSERT INTO fake_call (user_id, caller_name, trigger_method, created_at) VALUES (?, ?, ?, NOW())",
      [user_id, caller_name, trigger_method || 'manual_button']
    );
    res.status(201).json({ success: true, message: "Fake call entry created" });
  } catch (error) {
    console.error("Error triggering fake call:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const createAccessLink = async (req, res) => {
  const { evidence_id, access_level, expiry_time } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO access_link (evidence_id, access_level, expiry_time, created_at) VALUES (?, ?, ?, NOW())",
      [evidence_id, access_level || 'view', expiry_time]
    );
    res.status(201).json({
      success: true,
      link_id: result.insertId,
      message: "Access link generated",
    });
  } catch (error) {
    console.error("Error creating access link:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const generateQrLink = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const [users] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const qrUrl = `https://sheild-4puz.onrender.com/qr-emergency?userId=${encodeURIComponent(
      String(userId)
    )}`;

    return res.json({
      success: true,
      qrUrl,
    });
  } catch (error) {
    console.error("Error generating QR link:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// QR Trigger (Simplified logic as per prompt)
const triggerQR = async (req, res) => {
  const { token, user_id, latitude, longitude } = req.body;
  try {
    // 1. In a real scenario, validate token here.

    // 2. Create emergency incident
    const location_url = `https://maps.google.com/?q=${latitude},${longitude}`;
    const [incident] = await db.query(
      "INSERT INTO emergency_incidents (user_id, detected_keyword, location_url, status) VALUES (?, 'QR_SCAN_TRIGGER', ?, 'ACTIVE')",
      [user_id, location_url]
    );

    const emergencyId = incident.insertId;

    // 3. Log activity
    await db.query(
      "INSERT INTO activity_log (emergency_id, activity_type, timestamp) VALUES (?, 'QR_EMERGENCY_TRIGGERED', NOW())",
      [emergencyId]
    );

    res.status(201).json({
      success: true,
      emergency_id: emergencyId,
      message: "Emergency triggered via QR scan",
    });
  } catch (error) {
    console.error("Error triggering QR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  triggerFakeCall,
  createAccessLink,
  generateQrLink,
  triggerQR
};
