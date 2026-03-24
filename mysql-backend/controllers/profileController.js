const db = require("../config/db");

const storeProfile = async (req, res) => {
  const { user_id, emergency_info } = req.body;
  try {
    await db.query(
      "INSERT INTO user_profile (user_id, emergency_info) VALUES (?, ?)",
      [user_id, emergency_info]
    );
    res.status(201).json({ success: true, message: "User profile updated" });
  } catch (error) {
    console.error("Error storing profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const storeHardwareTrigger = async (req, res) => {
  const { user_id, button_pattern, trigger_status } = req.body;
  try {
    await db.query(
      "INSERT INTO hardware_trigger (user_id, button_pattern, trigger_status) VALUES (?, ?, ?)",
      [user_id, button_pattern || "triple_press", trigger_status]
    );
    res.status(201).json({ success: true, message: "Hardware trigger config updated" });
  } catch (error) {
    console.error("Error storing hardware trigger:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  storeProfile,
  storeHardwareTrigger
};
