const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "The user is not logged in" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded payload to the request
        next();
    } catch (err) {
        console.error("Token verification error:", err);
        res.status(401).json({ message: "The user is not logged in" });
    }
};

module.exports = authMiddleware;
