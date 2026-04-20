import express from "express";
import rateLimit from "express-rate-limit";
import User from "../models/user.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});


router.post("/register", authLimiter, async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (typeof name !== "string" || name.trim().length > 100) {
            return res.status(400).json({ message: "Name must be under 100 characters" });
        }

        if (typeof password !== "string" || password.length < 6 || password.length > 128) {
            return res.status(400).json({ message: "Password must be 6–128 characters" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ name: name.trim(), email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


router.post("/login", authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = user.getSignedJwtToken();

        res.json({ message: "Login successful", token, userId: user._id, name: user.name, email: user.email });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/profile", authMiddleware, async (req, res) => {
    try {
      const { name, email, oldPassword, newPassword } = req.body;
  
      const user = await User.findById(req.user.id).select("+password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (name) user.name = name.trim();

      const emailRegex = /^\S+@\S+\.\S+$/;
      if (email && !emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      if (email && email !== user.email) {
        const emailTaken = await User.findOne({ email });
        if (emailTaken) {
          return res.status(400).json({ message: "Email already in use" });
        }
        user.email = email;
      }

      if (oldPassword && newPassword) {
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
          return res.status(400).json({ message: "Old password is incorrect" });
        }
        user.password = newPassword;
      }
  
      const updatedUser = await user.save();
  
      res.json({ message: "Profile updated successfully", user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email
      }});
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });


router.post("/logout", authMiddleware, (_req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
});

export default router;
