const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

router.post("/add-contact", contactController.addContact);
router.get("/contacts/:email", contactController.getContacts);
router.put("/update-contact/:id", contactController.updateContact);
router.delete("/delete-contact/:id", contactController.deleteContact);

// Trusted_Contact routes
router.post("/addTrustedContact", contactController.addTrustedContact);
router.get("/getTrustedContacts/:user_id", contactController.getTrustedContacts);
router.post("/updateTrustedContact", contactController.updateTrustedContact);

module.exports = router;
