import express from "express";
import Form from "../models/form.js";
import User from "../models/user.js";
import { body, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js"; 


const router = express.Router();


router.get("/", authMiddleware,async (req, res) => {
    try {
        const { owner, page = 1, limit = 10 } = req.query;
        const query = owner ? { owner } : {}; 
        const forms = await Form.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        
        res.json(forms);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});


router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form) return res.status(404).json({ message: "Form Not Found" });
        res.json(form);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});


router.post("/", [
    body("form_name").notEmpty().withMessage("Form name is required"),
    body("fields").isArray().withMessage("Fields must be an array")
], authMiddleware, async (req, res) => {
    console.log("Received form data:", req.body);  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { form_name, fields, darkMode, owner } = req.body;
        if (!owner) {
            console.error("Missing owner in request body");
            return res.status(400).json({ message: "Owner is required" });
        }

        const newForm = new Form({ form_name, fields, darkMode, owner });
        await newForm.save();

        
        res.status(201).json({ 
            message: "Form Created", 
            formId: newForm._id,  
            form: newForm 
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to Create Form", error: err.message });
    }
});


router.post("/:id/increment-view", async (req, res) => {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).send({ message: 'Form not found' });
  
    form.views = (form.views || 0) + 1;
    await form.save();
    res.send({ views: form.views });
  });
  
  router.post("/:id/increment-start", async (req, res) => {
    try {
      const form = await Form.findById(req.params.id);
      if (!form) return res.status(404).send({ message: 'Form not found' });
  
      form.starts = (form.starts || 0) + 1;
      await form.save();
      res.send({ starts: form.starts });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });


router.put("/:id",authMiddleware, async (req, res) => {
    try {
        const updatedForm = await Form.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedForm) return res.status(404).json({ message: "Form Not Found" });
        res.json({ message: "Form Updated", form: updatedForm });
    } catch (err) {
        res.status(500).json({ message: "Failed to Update Form", error: err.message });
    }
});



router.delete("/:id",authMiddleware, async (req, res) => {
    try {
        const deletedForm = await Form.findByIdAndDelete(req.params.id);
        if (!deletedForm) return res.status(404).json({ message: "Form Not Found" });
        res.json({ message: "Form Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to Delete Form", error: err.message });
    }
});


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

        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return res.status(404).json({ message: "User not found" });
        }

        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        
        const userAlreadyInvited = form.sharedWith.some(u => u.user.toString() === userToInvite._id.toString());
        if (userAlreadyInvited) {
            return res.status(400).json({ message: "User already invited to this form" });
        }

        form.sharedWith.push({ user: userToInvite._id, role });
        await form.save();

        res.json({ message: "User invited successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/invite/:formId", authMiddleware, async (req, res) => {
    try {
        const { formId } = req.params;
        const inviteLink = `${process.env.FRONTEND_URL}/formbuilder/${formId}`;
        res.json({ inviteLink });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.post("/:id/submit", authMiddleware, async (req, res) => {
    try {
      const form = await Form.findById(req.params.id);
      if (!form) return res.status(404).json({ message: "Form not found" });
  
      const submission = req.body;
  
      if (!submission || typeof submission !== "object") {
        return res.status(400).json({ message: "Invalid submission data" });
      }
  
      form.submissions = form.submissions || [];
      form.submissions.push({
        ...submission,
        submittedAt: new Date()
      });
  
      await form.save();
      res.status(200).json({ message: "Form submitted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Submission failed", error: err.message });
    }
  });

router.get("/:id/responses", authMiddleware, async (req, res) => {
    try {
      const form = await Form.findById(req.params.id);
      console.log("form data",form)
      if (!form) return res.status(404).json({ message: "Form Not Found" });
  
      const submissions = form.submissions || [];
      res.json(submissions); 
      console.log("submissions", submissions)
    } catch (err) {
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  });


  
export default router;
