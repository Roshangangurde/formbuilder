const express = require("express");
const router = express.Router();
const User = require("../schema/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const { body, validationResult } = require("express-validator");


const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}


router.post(
    "/signup",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("mobile").isMobilePhone().withMessage("Valid mobile number is required"),
    ],
    async (req, res) => {
        console.log("Received signup payload:", req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

    const { name, email, password, mobile } = req.body;
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
        return res.status(400).json({ message: "User already exist" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobile,
        });
        res.status(200).json({ message: "User created" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error in creating user" });
    }
})



router.post(
    "/login",
    [
        body("email").isEmail().withMessage("Valid email is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        
        // Log the incoming request body to check its structure
        // console.log("Received login request body:", req.body);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Log the validation errors
            console.log("Validation errors:", errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                console.log("User not found");
                return res.status(400).json({ message: "Wrong username or password" });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                console.log("Incorrect password");
                return res.status(400).json({ message: "Wrong username or password" });
            }

            const payload = {
                id: user._id,
            };
            const token = jwt.sign(payload, JWT_SECRET);
            console.log("Login successful, token generated");
            res.status(200).json({ token });
        } catch (err) {
            console.error("Login error:", err);
            res.status(500).json({ message: "Server error" });
        }
    }
);

module.exports = router;

