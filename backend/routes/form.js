const express = require("express");
const Form = require("../schema/form.schema");
const authMiddleware = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const router = express.Router();

const fieldTypes = [
    "text", "radio", "checkbox", "select", "number", "date",
    "phone", "email", "rating", "image", "video", "gif", "button"
];

const validateForm = [
    body("form_name").notEmpty().withMessage("Form name is required"),
    body("fields").isArray({ min: 1 }).withMessage("Fields must be a non-empty array"),
    body("fields.*.label").notEmpty().withMessage("Field label is required"),
    body("fields.*.type").isIn(fieldTypes).withMessage("Invalid field type"),
];

router.post(
    "/",
    authMiddleware,
    validateForm,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Validation errors", errors: errors.array() });
        }

        const { form_name, description, fields } = req.body;

        try {
            const form = new Form({
                form_name,
                description,
                fields, 
                user: req.user.id, 
            });
            await form.save();
            res.status(201).json({ message: "Form created successfully", form });
        } catch (err) {
            console.error("Error creating form:", err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

// View all forms for authenticated user
router.get(
    "/",
    authMiddleware,
    async (req, res) => {
        try {
            const forms = await Form.find({ user: req.user.id });
            res.status(200).json({ message: "Forms retrieved successfully", forms });
        } catch (err) {
            console.error("Error fetching forms:", err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

// Delete a form
router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {
        const { id } = req.params;

        try {
            const form = await Form.findById(id);

            if (!form) {
                return res.status(404).json({ message: "Form not found" });
            }

            if (form.user.toString() !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized to delete this form" });
            }

            await Form.findByIdAndDelete(id);
            res.status(204).end();

        } catch (err) {
            console.error("Error deleting form:", err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

// Validation rules for updating a form
const validateFormUpdate = [
    body("form_name").optional().notEmpty().withMessage("Form name is required if provided"),
    body("fields")
        .optional()
        .isArray()
        .withMessage("Fields must be an array if provided"),
    body("fields.*.label")
        .optional()
        .notEmpty()
        .withMessage("Field label is required if provided"),
    body("fields.*.type")
        .optional()
        .isIn(fieldTypes)
        .withMessage("Invalid field type"),
];

// Update a form
router.put(
    "/:id",
    authMiddleware,
    validateFormUpdate,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Validation errors", errors: errors.array() });
        }

        const { id } = req.params;
        const { form_name, description, fields } = req.body;

        try {
            const form = await Form.findOne({ _id: id, user: req.user.id });

            if (!form) {
                return res.status(404).json({ message: "Form not found or not authorized" });
            }

            if (form_name) form.form_name = form_name;
            if (description) form.description = description;
            if (fields) form.fields = fields;

            await form.save();
            res.status(200).json({ message: "Form updated successfully", form });
        } catch (err) {
            console.error("Error updating form:", err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

module.exports = router;