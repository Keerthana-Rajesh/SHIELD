const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/auth/google", authController.googleAuth);
router.post("/register-user", authController.registerUser);
router.get("/user/:email", authController.getUser);

module.exports = router;
