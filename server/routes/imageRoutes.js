import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { analyzeImage } from "../controllers/imageController.js";

const router = express.Router();

router.post(
  "/analyze",
  protect,
  upload.single("image"),
  analyzeImage
);

export default router;