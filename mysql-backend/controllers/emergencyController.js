const db = require("../config/db");

const startEmergency = async (req, res) => {
  const { user_id, detected_keyword, location_url } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO emergency_incidents (user_id, detected_keyword, location_url, status) VALUES (?, ?, ?, 'ACTIVE')",
      [user_id, detected_keyword || null, location_url]
    );

    res.status(201).json({
      success: true,
      emergency_id: result.insertId,
      message: "Emergency incident started",
    });
  } catch (error) {
    console.error("Error starting emergency:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const endEmergency = async (req, res) => {
  const { emergency_id } = req.body;
  try {
    await db.query(
      "UPDATE emergency_incidents SET status = 'RESOLVED', end_time = NOW() WHERE id = ?",
      [emergency_id]
    );
    res.json({ success: true, message: "Emergency incident resolved" });
  } catch (error) {
    console.error("Error ending emergency:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const storeAudio = async (req, res) => {
  const { emergency_id, audio_file_path } = req.body;
  try {
    await db.query(
      "INSERT INTO audio_record (emergency_id, audio_file_path, encryption_status) VALUES (?, ?, TRUE)",
      [emergency_id, audio_file_path]
    );
    res.status(201).json({ success: true, message: "Audio record stored" });
  } catch (error) {
    console.error("Error storing audio:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const storeVideo = async (req, res) => {
  const { emergency_id, camera_type, video_file_path } = req.body;
  try {
    await db.query(
      "INSERT INTO video_record (emergency_id, camera_type, video_file_path, encryption_status) VALUES (?, ?, ?, TRUE)",
      [emergency_id, camera_type, video_file_path]
    );
    res.status(201).json({ success: true, message: "Video record stored" });
  } catch (error) {
    console.error("Error storing video:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const storeEvidence = async (req, res) => {
  const { emergency_id, evidence_type } = req.body;
  try {
    await db.query(
      "INSERT INTO cloud_evidence (emergency_id, evidence_type, upload_time, retention_status) VALUES (?, ?, NOW(), 'ACTIVE')",
      [emergency_id, evidence_type]
    );
    res.status(201).json({ success: true, message: "Evidence logged" });
  } catch (error) {
    console.error("Error logging evidence:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logAlert = async (req, res) => {
  const { emergency_id, alert_type } = req.body;
  try {
    await db.query(
      "INSERT INTO emergency_alert (emergency_id, alert_type, alert_time, delivery_status) VALUES (?, ?, NOW(), 'SENT')",
      [emergency_id, alert_type]
    );
    res.status(201).json({ success: true, message: "Alert logged" });
  } catch (error) {
    console.error("Error logging alert:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logCall = async (req, res) => {
  const { emergency_id, call_status } = req.body;
  try {
    await db.query(
      "INSERT INTO emergency_call (emergency_id, call_time, call_status) VALUES (?, NOW(), ?)",
      [emergency_id, call_status]
    );
    res.status(201).json({ success: true, message: "Call logged" });
  } catch (error) {
    console.error("Error logging call:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  startEmergency,
  endEmergency,
  storeAudio,
  storeVideo,
  storeEvidence,
  logAlert,
  logCall
};
