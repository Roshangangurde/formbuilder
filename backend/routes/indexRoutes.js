import express from "express";
import userRouter from "./userRoutes.js";
import formRouter from "./formRoutes.js";
import folderRouter from "./folderRoutes.js";

const router = express.Router();


router.get("/", (req, res) => {
    res.json({ message: "Welcome!" });
});


router.use("/user", userRouter);
router.use("/forms", formRouter);
router.use("/folders", folderRouter);


router.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

router.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

export default router;
