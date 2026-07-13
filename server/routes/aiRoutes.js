import express from "express";
import protect from "../middleware/authMiddleware.js";
import { improveComplaintAI } from "../controllers/aiController.js";

const router = express.Router();

router.post("/improve", protect, improveComplaintAI);

export default router;