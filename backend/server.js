import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/indexRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;



connectDB();

app.use(helmet());

const allowedOrigins = [
  "https://formbuilder-orpin-one.vercel.app",
  "https://formbuilder-brown.vercel.app",
  /^http:\/\/localhost:\d+$/,
  /^https:\/\/.*\.vercel\.app$/,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(o => typeof o === "string" ? o === origin : o.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));


app.use(express.json({ limit: "1mb" }));


app.use("/api/v1/", indexRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the Form Builder API!");
});


app.listen(PORT, () => console.log(` Server running on ${PORT}`));
