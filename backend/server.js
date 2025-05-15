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

const corsOptions = {
  origin: "https://formbuilder-bay.vercel.app",  
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, 
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));
app.use(express.json());


app.use("/api/v1/", indexRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the Form Builder API!");
});


app.listen(PORT, () => console.log(` Server running on ${PORT}`));
