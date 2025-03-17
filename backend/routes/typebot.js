const express = require("express");
const authMiddleware = require("../middleware/auth"); // Ensure user is authenticated
const Typebot = require("../schema/typebot.schema"); // Import Typebot model

const router = express.Router();

// Create a new Typebot form
router.post("/", authMiddleware, async (req, res) => {
    const { form_name } = req.body;

    if (!form_name) {
        return res.status(400).json({ message: "Form name is required" });
    }

    try {
        const newTypebot = new Typebot({ form_name });
        await newTypebot.save();
        res.status(201).json({ message: "Typebot form created successfully", typebot: newTypebot });
    } catch (error) {
        console.error("Error creating Typebot form:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
