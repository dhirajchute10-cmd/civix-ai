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
  getCategoryStats,
} from "../controllers/complaintController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

router.post("/", protect, createComplaint);

router.get("/my", protect, getMyComplaints);

router.get("/stats", protect, getComplaintStats);

router.get("/recent", protect, getRecentComplaints);

router.get("/admin/all", protect, adminOnly, getAllComplaints);

router.put(
  "/admin/status/:id",
  protect,
  adminOnly,
  updateComplaintStatus
);

router.delete(
  "/admin/delete/:id",
  protect,
  adminOnly,
  adminDeleteComplaint
);

router.get(
  "/admin/stats",
  protect,
  adminOnly,
  getAdminStats
);

router.get(
  "/admin/category-stats",
  protect,
  adminOnly,
  getCategoryStats
);

router.get("/:id", protect, getComplaintById);

router.put("/:id", protect, updateComplaint);

router.delete("/:id", protect, deleteComplaint);

export default router;



