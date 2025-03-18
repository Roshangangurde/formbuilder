const express = require("express");
const Invite = require("../schema/invite.schema"); // Import Invite model

const router = express.Router();

// ✅ Route to check if an email exists
router.get("/check", async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const invite = await Invite.findOne({ email });

        if (!invite) {
            return res.status(404).json({ message: "Email not found" });
        }

        res.status(200).json({ message: "Email exists", invite });
    } catch (error) {
        console.error("Error checking invite:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
