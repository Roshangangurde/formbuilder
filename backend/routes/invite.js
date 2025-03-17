const express = require("express");
const authMiddleware = require("../middleware/auth");
const Workplace = require("../schema/workplace.schema"); // Workplace model
const Invite = require("../schema/invite.schema"); // Invitation model
const User = require("../schema/user.schema"); // User model

const router = express.Router();

// Invite a user by email (store in DB)
router.post("/invite", authMiddleware, async (req, res) => {
    const { email, workplaceId } = req.body;

    if (!email || !workplaceId) {
        return res.status(400).json({ message: "Email and workplace ID are required" });
    }

    try {
        // Check if user is already invited
        const existingInvite = await Invite.findOne({ email, workplaceId });
        if (existingInvite) {
            return res.status(400).json({ message: "User is already invited" });
        }

        // Store the invite in the database
        const invite = new Invite({ email, workplaceId });
        await invite.save();

        res.status(201).json({ message: "User invited successfully", invite });
    } catch (error) {
        console.error("Error inviting user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Check if logged-in user has access to a workplace
router.get("/access/:workplaceId", authMiddleware, async (req, res) => {
    const { workplaceId } = req.params;
    const userEmail = req.user.email; // Assuming authMiddleware adds `req.user`

    try {
        // Check if the user exists
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the user is invited to the workplace
        const invitation = await Invite.findOne({ email: userEmail, workplaceId });
        if (!invitation) {
            return res.status(403).json({ message: "Access denied. You are not invited." });
        }

        res.status(200).json({ message: "Access granted" });
    } catch (error) {
        console.error("Error checking access:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
