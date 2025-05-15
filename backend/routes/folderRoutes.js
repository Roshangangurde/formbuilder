import express from "express";
import Folder from "../models/Folder.js"; 
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { name } = req.body;
        const newFolder = new Folder({ name, userId: req.user.id });
        await newFolder.save();
        console.log(newFolder);
        res.status(201).json(newFolder);
    } catch (err) {
        res.status(500).json({ error: "Failed to create folder", details: err.message });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    try {
        const folders = await Folder.find({ userId: req.query.userId }); 
        res.json(folders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching folders" });
    }
});


router.get("/:folderId", authMiddleware, async (req, res) => {
    try {
        const folder = await Folder.findById(req.params.folderId);
        if (!folder) {
            return res.status(404).json({ error: "Folder not found" });
        }
        res.json(folder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching folder" });
    }
});

router.delete("/:folderId", authMiddleware, async (req, res) => {
    try {
        const folder = await Folder.findOneAndDelete({
            _id: req.params.folderId,
            userId: req.user.id 
        });

        if (!folder) {
            return res.status(404).json({ error: "Folder not found or unauthorized" });
        }

        res.status(200).json({ message: "Folder deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error deleting folder" });
    }
});

export default router;
