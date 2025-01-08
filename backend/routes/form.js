const express = require("express");
const Form = require("../schema/form.schema");
const authMiddleware = require("../middleware/auth");
const { body, validationResult } = require("express-validator");

const router = express.Router();


const validateForm = [
    body("form_name").notEmpty().withMessage("Form name is required"),
    body("fields").isArray({ min: 1 }).withMessage("Fields must be a non-empty array"),
    body("fields.*.label").notEmpty().withMessage("Field label is required"),
    body("fields.*.type").isIn(['text', 'radio', 'checkbox', 'select', 'number', 'date']).withMessage("Invalid field type"),
];

router.post(
    "/form",
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

//view all forms
router.get(
    "/forms", // Route for retrieving all forms of the authenticated user
    authMiddleware, // Ensure the user is authenticated
    async (req, res) => {
        try {
            // Fetch all forms created by the authenticated user
            const forms = await Form.find({ user: req.user.id });

            // Respond with the list of forms
            res.status(200).json({ message: "Forms retrieved successfully", forms });
        } catch (err) {
            console.error("Error fetching forms:", err);
            res.status(500).json({ message: "Server error" });
        }
    }
);


router.delete(
    "/form/:id", // Accept the form ID as a URL parameter
    authMiddleware, // Ensure the user is authenticated
    async (req, res) => {
        const { id } = req.params;

        try {
            // Find the form by ID
            const form = await Form.findById(id);

            if (!form) {
                return res.status(404).json({ message: "Form not found" });
            }

            // Check if the authenticated user is the owner of the form
            if (form.user.toString() !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized to delete this form" });
            }

            // Delete the form
            await Form.findByIdAndDelete(id);
            res.status(200).json({ message: "Form deleted successfully" });
        } catch (err) {
            console.error("Error deleting form:", err);
            res.status(500).json({ message: "Server error" });
        }
    }
);


// Validation rules for editing a form
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
        .isIn(["text", "radio", "checkbox", "select", "number", "date"])
        .withMessage("Invalid field type"),
];

// PUT route to update a form
router.put(
    "/form/:id",
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
            // Find the form by ID and ensure it belongs to the authenticated user
            const form = await Form.findOne({ _id: id, user: req.user.id });

            if (!form) {
                return res.status(404).json({ message: "Form not found or not authorized" });
            }

            // Update fields if provided
            if (form_name) form.form_name = form_name;
            if (description) form.description = description;
            if (fields) form.fields = fields;

            // Save updated form
            await form.save();
            res.status(200).json({ message: "Form updated successfully", form });
        } catch (err) {
            console.error("Error updating form:", err);
            res.status(500).json({ message: "Server error" });
        }
    }
);




module.exports = router;
