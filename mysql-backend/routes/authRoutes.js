const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/send-email-otp", authController.sendEmailOTP);
router.post("/verify-email-otp", authController.verifyEmailOTP);
router.post("/register-user", authController.registerUser);
router.get("/user/:email", authController.getUser);

module.exports = router;
