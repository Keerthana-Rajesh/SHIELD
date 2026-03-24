const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const emergencyController = require("../controllers/emergencyController");
const activityController = require("../controllers/activityController");
const specialFeaturesController = require("../controllers/specialFeaturesController");

// User Profile related
router.post("/profile", profileController.storeProfile);
router.post("/hardware-trigger", profileController.storeHardwareTrigger);

// Emergency Workflow related
router.post("/emergency/start", emergencyController.startEmergency);
router.put("/emergency/end", emergencyController.endEmergency);
router.post("/emergency/audio", emergencyController.storeAudio);
router.post("/emergency/video", emergencyController.storeVideo);
router.post("/emergency/evidence", emergencyController.storeEvidence);
router.post("/emergency/alert", emergencyController.logAlert);
router.post("/emergency/call", emergencyController.logCall);

// Activity logging related
router.post("/activity/log", activityController.logActivity);
router.get("/activity/latest", activityController.getActivities);
router.get("/activities/:email", activityController.getActivitiesByEmail);
router.post("/notification", activityController.logNotification);

// Special Features related
router.post("/fake-call", specialFeaturesController.triggerFakeCall);
router.post("/access-link", specialFeaturesController.createAccessLink);
router.post("/qr/trigger", specialFeaturesController.triggerQR);

module.exports = router;
