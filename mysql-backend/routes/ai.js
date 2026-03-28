import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/analyze", async (req, res) => {
    try {
        const { text } = req.body;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    inputs: text,
                    parameters: {
                        candidate_labels: ["emergency", "normal"],
                    },
                }),
            }
        );

        const data = await response.json();

        const label = data.labels[0];
        const score = data.scores[0];

        let risk = "LOW";

        if (label === "emergency" && score > 0.7) {
            risk = "HIGH";
        }

        res.json({
            success: true,
            risk,
            confidence: score,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "AI error",
        });
    }
});

export default router;