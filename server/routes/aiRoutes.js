import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  improveComplaintAI,
  chatAI,
} from "../controllers/aiController.js";

const router = express.Router();


// Chatbot
// Public so citizens can use it before login
router.post("/chat", chatAI);


// Complaint AI
// Requires login
router.post("/improve", protect, improveComplaintAI);


export default router;