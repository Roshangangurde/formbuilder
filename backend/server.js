import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import connectDB from "./config/db.js";
import indexRoutes from "./routes/indexRoutes.js";

dotenv.config();

// Fail fast on missing required env vars
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

// Global crash handlers
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

connectDB();

// Security headers
app.use(helmet());

// Logging
app.use(morgan(isProduction ? "combined" : "dev"));

// Response compression
app.use(compression());

// CORS
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

// Body parsing with size limit
app.use(express.json({ limit: "1mb" }));

// Strip MongoDB operators from request body/query/params
app.use(mongoSanitize());

app.use("/api/v1/", indexRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Form Builder API!");
});

// Global Express error handler
app.use((err, req, res, _next) => {
  console.error("Express error:", err);
  res.status(err.status || 500).json({ message: "Internal server error" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
