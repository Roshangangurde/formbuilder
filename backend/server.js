import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/indexRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

console.log("JWT_SECRET:", process.env.JWT_SECRET);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/", indexRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the Form Builder API!");
});

// Start Server
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
