import express from "express";
import {
  submitApplication,
  getApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadApplicationFiles } from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* =======================
   PUBLIC
======================= */
router.post("/", uploadApplicationFiles, submitApplication);

/* =======================
   ADMIN
======================= */

/**
 * GET applications with:
 * ?search=John
 * ?status=pending
 * ?course=Computer Studies
 * ?page=1
 * ?limit=20
 */
router.get("/", protect, getApplications);

// ✅ Approve / Reject (with lock protection)
router.patch("/:id/status", protect, updateApplicationStatus);

export default router;
