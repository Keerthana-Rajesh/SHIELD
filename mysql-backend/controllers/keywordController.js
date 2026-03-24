const db = require("../config/db");

const addKeyword = async (req, res) => {
  const { user_id, keyword_text, security_level } = req.body;
  try {
    await db.query(
      "INSERT INTO emergency_keyword (user_id, keyword_text, security_level) VALUES (?, ?, ?)",
      [user_id, keyword_text.toLowerCase(), security_level]
    );
    res.json({ message: "Keyword added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getKeywords = async (req, res) => {
  const { user_id, level } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM emergency_keyword WHERE user_id = ? AND security_level = ?",
      [user_id, level]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteKeyword = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM emergency_keyword WHERE keyword_id = ?", [id]);
    res.json({ message: "Keyword deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Formatted keywords for voice processing
const getKeywordsForVoice = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT keyword_text, security_level FROM emergency_keyword WHERE user_id = ?",
      [userId]
    );
    const lowRisk = [];
    const highRisk = [];
    rows.forEach((row) => {
      if (row.security_level === "LOW") lowRisk.push(row.keyword_text.toLowerCase());
      else highRisk.push(row.keyword_text.toLowerCase());
    });
    res.json({ lowRiskKeywords: lowRisk, highRiskKeywords: highRisk });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addKeyword,
  getKeywords,
  deleteKeyword,
  getKeywordsForVoice,
};
