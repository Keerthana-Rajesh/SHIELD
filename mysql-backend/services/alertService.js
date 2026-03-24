const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmergencyEmail = async (recipients, location, userId, keyword, risk_level) => {
  const timestamp = new Date().toLocaleString();
  let subject = "Low Risk Alert – SHIELD Safety Notification";
  let body = `A low-risk keyword was detected.\n\nUser ID: ${userId}\nDetected Keyword: ${keyword || 'Low-Risk Detected'}\nTime: ${timestamp}\n\nLive Location:\n${location}\n\nThis is only a precautionary alert.`;

  if (risk_level === 'HIGH') {
    subject = "EMERGENCY ALERT – Possible danger detected";
    body = `A high-risk keyword was detected from the SHIELD safety app.\n\nUser ID: ${userId}\nDetected Keyword: ${keyword}\nTime: ${timestamp}\n\nLive Location:\n${location}\n\nPlease contact the user immediately. Calling contacts now.`;
  }

  return transporter.sendMail({
    from: `"SHIELD Guardian" <${process.env.EMAIL_USER}>`,
    to: recipients,
    subject: subject,
    text: body,
  });
};

const sendSafeEmail = async (recipients, userName) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipients,
    subject: "✅ SHIELD ALERT CANCELLED",
    text: `${userName} is SAFE now. Please ignore the previous emergency alert.`,
  });
};

module.exports = {
  sendEmergencyEmail,
  sendSafeEmail
};
