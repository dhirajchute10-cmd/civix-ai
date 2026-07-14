import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import complaintRoutes from "./routes/complaintRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/image", imageRoutes);

// Home Route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to CIVIX AI Backend 🚀",
    project: "AI Powered Smart Citizen Platform",
    version: "2.0",
    status: "Server Running Successfully",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});