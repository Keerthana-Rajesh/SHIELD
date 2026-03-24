const express = require("express");
const router = express.Router();
const keywordController = require("../controllers/keywordController");

router.post("/add-keyword", keywordController.addKeyword);
router.get("/get-keywords/:user_id/:level", keywordController.getKeywords);
router.delete("/delete-keyword/:id", keywordController.deleteKeyword);
router.get("/keywords/:userId", keywordController.getKeywordsForVoice);

module.exports = router;
