import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);

const allowedOrigins = (
  process.env.CLIENT_URL ||
  "http://localhost:5173,http://localhost:5174,http://localhost:5175,http://localhost:5176"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.warn(
    "⚠️ MONGODB_URI is not set. Set it in your environment before using database-backed features."
  );
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS policy: origin not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/services", serviceRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CIVIX AI Backend 🚀",
    project: "AI Powered Smart Citizen Platform",
    version: "2.0",
    status: "Server Running Successfully",
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

export default app;