import express from "express";
import rateLimit from "express-rate-limit";
import Form from "../models/form.js";
import Folder from "../models/folder.js";
import User from "../models/user.js";
import { body, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const publicLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { message: "Too many requests" },
  standardHeaders: true,
  legacyHeaders: false,
});

const VALID_THEMES = ["classic", "warm", "minimal"];


// GET /forms — only returns forms owned by the authenticated user
router.get("/", authMiddleware, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
        const forms = await Form.find({ owner: req.user.id })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit);
        res.json(forms);
    } catch (err) {
        res.status(500).json({ message: "Server Error"});
    }
});


// GET /forms/:id/public — no auth required; used by the published form page
router.get("/:id/public", async (req, res) => {
    try {
        const form = await Form.findById(req.params.id).select(
            "form_name fields darkMode theme"
        );
        if (!form) return res.status(404).json({ message: "Form Not Found" });
        res.json({ form });
    } catch (err) {
        res.status(500).json({ message: "Server Error"});
    }
});


// GET /forms/:id — owner or invited user only
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: "Form Not Found" });

        const isOwner = form.owner.toString() === req.user.id;
        const isShared = form.sharedWith.some(s => s.user.toString() === req.user.id);
        if (!isOwner && !isShared) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json(form);
    } catch (err) {
        res.status(500).json({ message: "Server Error"});
    }
});


// POST /forms — create a new form; owner is always the authenticated user
router.post("/", [
    body("form_name").notEmpty().withMessage("Form name is required"),
    body("fields").isArray().withMessage("Fields must be an array")
], authMiddleware, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { form_name, fields, darkMode, theme } = req.body;
        const newForm = new Form({ form_name, fields, darkMode, theme, owner: req.user.id });
        await newForm.save();
        res.status(201).json({ message: "Form Created", formId: newForm._id, form: newForm });
    } catch (err) {
        res.status(500).json({ message: "Failed to Create Form"});
    }
});


// POST /forms/:id/increment-view — public (called when published form loads)
router.post("/:id/increment-view", publicLimiter, async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: "Form not found" });
        form.views = (form.views || 0) + 1;
        await form.save();
        res.json({ views: form.views });
    } catch (err) {
        res.status(500).json({ message: "Server error"});
    }
});

// POST /forms/:id/increment-start — public
router.post("/:id/increment-start", publicLimiter, async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: "Form not found" });
        form.starts = (form.starts || 0) + 1;
        await form.save();
        res.json({ starts: form.starts });
    } catch (err) {
        res.status(500).json({ message: "Server error"});
    }
});


// PUT /forms/:id — owner only; whitelisted fields only
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: "Form Not Found" });
        if (form.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        const { form_name, fields, darkMode, theme, folder } = req.body;
        if (form_name !== undefined) {
            if (typeof form_name !== "string" || form_name.trim().length === 0 || form_name.length > 255) {
                return res.status(400).json({ message: "form_name must be 1–255 characters" });
            }
            form.form_name = form_name.trim();
        }
        if (fields !== undefined) {
            if (!Array.isArray(fields) || fields.length > 500) {
                return res.status(400).json({ message: "fields must be an array with at most 500 items" });
            }
            form.fields = fields;
        }
        if (darkMode !== undefined) form.darkMode = darkMode;
        if (theme !== undefined) {
            if (!VALID_THEMES.includes(theme)) {
                return res.status(400).json({ message: "Invalid theme" });
            }
            form.theme = theme;
        }
        if (folder !== undefined) {
            if (folder) {
                const folderDoc = await Folder.findById(folder);
                if (!folderDoc || folderDoc.owner.toString() !== req.user.id) {
                    return res.status(403).json({ message: "Folder not found or access denied" });
                }
            }
            form.folder = folder || null;
        }

        await form.save();
        res.json({ message: "Form Updated", form });
    } catch (err) {
        res.status(500).json({ message: "Failed to Update Form"});
    }
});


// DELETE /forms/:id — owner only
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const form = await Form.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
        if (!form) return res.status(404).json({ message: "Form Not Found or Access Denied" });
        res.json({ message: "Form Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to Delete Form"});
    }
});


// POST /forms/invite — owner only
router.post("/invite", [
    body("email").isEmail().withMessage("Invalid email format"),
    body("formId").notEmpty().withMessage("Form ID is required"),
    body("role").isIn(["Edit", "View"]).withMessage("Select role Edit or View"),
], authMiddleware, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, formId, role } = req.body;

        const form = await Form.findById(formId);
        if (!form) return res.status(404).json({ message: "Form not found" });
        if (form.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Only the form owner can invite users" });
        }

        const userToInvite = await User.findOne({ email });
        if (!userToInvite) return res.status(404).json({ message: "User not found" });

        const alreadyInvited = form.sharedWith.some(u => u.user.toString() === userToInvite._id.toString());
        if (alreadyInvited) return res.status(400).json({ message: "User already invited to this form" });

        form.sharedWith.push({ user: userToInvite._id, role });
        await form.save();
        res.json({ message: "User invited successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error"});
    }
});

// GET /forms/invite/:formId — generate share link
router.get("/invite/:formId", authMiddleware, async (req, res) => {
    try {
        const { formId } = req.params;
        const inviteLink = `${process.env.FRONTEND_URL}/publish/${formId}`;
        res.json({ inviteLink });
    } catch (err) {
        res.status(500).json({ message: "Server error"});
    }
});


// POST /forms/:id/submit — public (published forms submitted by anonymous users)
router.post("/:id/submit", publicLimiter, async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: "Form not found" });

        const { responses, status } = req.body;
        if (!responses || typeof responses !== "object" || Array.isArray(responses)) {
            return res.status(400).json({ message: "Invalid submission data" });
        }

        if (Object.keys(responses).length > 500) {
            return res.status(400).json({ message: "Too many fields in submission" });
        }

        form.submissions.push({ responses, status: status || "completed" });
        await form.save();
        res.status(200).json({ message: "Form submitted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Submission failed" });
    }
});


// GET /forms/:id/responses — owner only
router.get("/:id/responses", authMiddleware, async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: "Form Not Found" });
        if (form.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }
        res.json(form.submissions || []);
    } catch (err) {
        res.status(500).json({ message: "Server Error"});
    }
});


export default router;
