const db = require("../config/db");

const logActivity = async (req, res) => {
  const { emergency_id, activity_type } = req.body;
  try {
    await db.query(
      "INSERT INTO activity_log (emergency_id, activity_type, timestamp) VALUES (?, ?, NOW())",
      [emergency_id, activity_type]
    );
    res.status(201).json({ success: true, message: "Activity successfully logged" });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const logNotification = async (req, res) => {
  const { emergency_id, notification_type } = req.body;
  try {
    await db.query(
      "INSERT INTO notification (emergency_id, notification_type, sent_time) VALUES (?, ?, NOW())",
      [emergency_id, notification_type]
    );
    res.status(201).json({ success: true, message: "Notification logged" });
  } catch (error) {
    console.error("Error logging notification:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getActivities = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT log_id AS id, emergency_id, activity_type, timestamp FROM activity_log ORDER BY timestamp DESC LIMIT 20"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getActivitiesByEmail = async (req, res) => {
  const { email } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT al.log_id AS id, al.emergency_id, al.activity_type, al.timestamp FROM activity_log al " +
      "JOIN emergency_incidents ei ON al.emergency_id = ei.id " +
      "JOIN users u ON ei.user_id = u.id " +
      "WHERE u.email = ? " +
      "ORDER BY al.timestamp DESC LIMIT 20",
      [email]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching activities by email:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  logActivity,
  logNotification,
  getActivities,
  getActivitiesByEmail
};
