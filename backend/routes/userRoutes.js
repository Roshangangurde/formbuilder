import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/register", async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        console.log("name",name,"email", email,"password",password,"confirmPassword",confirmPassword)
       
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }


        const newUser = new User({ name, email, password});
        console.log("user",newUser);
        await newUser.save();
        
        res.status(201).json({ message: "User registered successfully" });
       
    } catch (err) {
        console.error("Error in registration:", err.message);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(" Login request received:", { email, password });

        const user = await User.findOne({ email }).select("+password");
        console.log("user ", user);
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        console.log("🔍 User found:", user);

        const isMatch = await user.comparePassword(password);
        console.log("isMatch" , isMatch);
        if (!isMatch) {
            console.log("Password mismatch!");
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = user.getSignedJwtToken();

        res.json({ message: "Login successful", token, userId: user._id });

    } catch (err) {
        console.error(" Server error:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.put("/profile", authMiddleware, async (req, res) => {
    try {
      const { name, email, oldPassword, newPassword } = req.body;
  
      const user = await User.findById(req.user.userId).select("+password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (name) user.name = name;
      if (email) user.email = email;
  
      if (oldPassword && newPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
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


router.post("/logout", authMiddleware, (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
});

export default router;
