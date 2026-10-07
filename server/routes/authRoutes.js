import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  register,
  login,
  adminLogin,
  getAllUsers,
} from "../controllers/authController.js";

const router = express.Router();

// Citizen
router.post("/register", register);
router.post("/login", login);

// Admin
router.post("/admin-login", adminLogin);
router.get("/users", protect, getAllUsers);

export default router;