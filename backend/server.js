import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/indexRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

console.log("JWT_SECRET:", process.env.JWT_SECRET);



connectDB();

const allowedOrigins = [
  "https://formbuilder-orpin-one.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, 
}));


app.use(express.json());


app.use("/api/v1/", indexRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the Form Builder API!");
});


app.listen(PORT, () => console.log(` Server running on ${PORT}`));
