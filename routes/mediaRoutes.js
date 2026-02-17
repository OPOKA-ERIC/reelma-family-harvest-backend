import express from "express";
import upload from "../middleware/uploadMedia.js";
import {
  uploadMedia,
  getMediaBySection,
  getHeroImage,
  deleteMedia,
} from "../controllers/mediaController.js";
import protectAdmin from "../middleware/protectAdmin.js";

const router = express.Router();

/**
 * ===============================
 * UPLOAD MEDIA (ADMIN)
 * ===============================
 * Supports BOTH images and videos
 * Field name stays "image" to avoid
 * breaking existing frontend uploads.
 */
router.post(
  "/",
  protectAdmin,
  upload.single("image"),
  uploadMedia
);

/**
 * ===============================
 * GET GLOBAL HERO IMAGE (PUBLIC)
 * ===============================
 */
router.get("/hero", getHeroImage);

/**
 * ===============================
 * GET MEDIA BY SECTION (PUBLIC)
 * ===============================
 */
router.get("/:section", getMediaBySection);

/**
 * ===============================
 * DELETE MEDIA (ADMIN)
 * ===============================
 */
router.delete("/:id", protectAdmin, deleteMedia);

export default router;
