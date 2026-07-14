import express from "express";

import {
  createComplaint,
  getMyComplaints,
  getComplaintStats,
  getComplaintById,
  getRecentComplaints,
  updateComplaint,
  deleteComplaint,
  getAllComplaints,
  updateComplaintStatus,
  adminDeleteComplaint,
  getAdminStats,
} from "../controllers/complaintController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createComplaint);

router.get("/my", protect, getMyComplaints);

router.get("/stats", protect, getComplaintStats);

router.get("/recent", protect, getRecentComplaints);

router.get("/admin/all", protect, getAllComplaints);

router.put("/admin/status/:id", protect, updateComplaintStatus);

router.delete("/admin/delete/:id", protect, adminDeleteComplaint);

router.get("/admin/stats", protect, getAdminStats);

router.get("/:id", protect, getComplaintById);

// ⭐ New Route
router.put("/:id", protect, updateComplaint);

router.delete("/:id", protect, deleteComplaint);

export default router;



