import express from "express";
import Folder from "../models/folder.js";
import Form from "../models/form.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /folders — create folder for authenticated user
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || !name.trim()) {
            return res.status(400).json({ error: "Folder name is required" });
        }
        const newFolder = new Folder({ name: name.trim(), userId: req.user.id });
        await newFolder.save();
        res.status(201).json(newFolder);
    } catch (err) {
        res.status(500).json({ error: "Failed to create folder", details: err.message });
    }
});

// GET /folders — only folders owned by the authenticated user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const folders = await Folder.find({ userId: req.user.id });
        res.json(folders);
    } catch (err) {
        res.status(500).json({ error: "Error fetching folders" });
    }
});

// GET /folders/:folderId — owner only, includes forms in this folder
router.get("/:folderId", authMiddleware, async (req, res) => {
    try {
        const folder = await Folder.findOne({ _id: req.params.folderId, userId: req.user.id });
        if (!folder) return res.status(404).json({ error: "Folder not found" });

        const forms = await Form.find({ folder: folder._id, owner: req.user.id })
            .select("form_name views starts submissions createdAt")
            .sort({ createdAt: -1 });

        res.json({ ...folder.toObject(), forms });
    } catch (err) {
        res.status(500).json({ error: "Error fetching folder" });
    }
});

// DELETE /folders/:folderId — owner only
router.delete("/:folderId", authMiddleware, async (req, res) => {
    try {
        const folder = await Folder.findOneAndDelete({ _id: req.params.folderId, userId: req.user.id });
        if (!folder) return res.status(404).json({ error: "Folder not found or unauthorized" });
        res.status(200).json({ message: "Folder deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting folder" });
    }
});

export default router;
