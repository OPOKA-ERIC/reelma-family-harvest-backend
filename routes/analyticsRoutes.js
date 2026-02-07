import express from "express";
import { getApplicationAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔐 ADMIN ONLY
router.get("/", protect, getApplicationAnalytics);

export default router;
