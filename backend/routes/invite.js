const express = require("express");
const { v4: uuidv4 } = require("uuid");
const Invite = require("../schema/invite.schema"); // Invite model
const User = require("../schema/user.schema"); // User model

const router = express.Router();

/** ✅ SEND EMAIL-BASED INVITE */
router.post("/", async (req, res) => {
    const { email, permission } = req.body;

    if (!email || !permission) {
        return res.status(400).json({ message: "Email and permission are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email is not registered" });
        }

        let invite = await Invite.findOne({ email, permission });
        if (invite) {
            return res.status(400).json({ message: `User is already invited with ${permission} access` });
        }

        // Generate a unique form ID
        const formId = uuidv4();
        const link = `${process.env.CLIENT_URL}/${permission}-form/${formId}`;

        // Save invitation in DB
        invite = new Invite({ email, permission, formId, link, invitedAt: new Date() });
        await invite.save();

        res.status(201).json({ message: `User invited successfully with ${permission} access`, link });
    } catch (error) {
        console.error("Error sending invite:", error);
        res.status(500).json({ message: "Server error" });
    }
});

/** ✅ GENERATE FORM LINK (WITHOUT EMAIL) */
router.post("/form/create", async (req, res) => {
    const { permission } = req.body;

    if (!permission || !["view", "edit"].includes(permission)) {
        return res.status(400).json({ message: "Valid permission (view/edit) is required" });
    }

    try {
        const formId = uuidv4();
        const link = `${process.env.CLIENT_URL}/${permission}-form/${formId}`;

        // No email involved, only store link and permission
        const newFormEntry = new Invite({ permission, formId, link, invitedAt: new Date() });
        await newFormEntry.save();

        res.status(201).json({ message: `Form link generated with ${permission} access`, link });
    } catch (error) {
        console.error("Error creating form link:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
