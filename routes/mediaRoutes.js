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
 * section can be:
 * hero | programs | gallery | projects | partners
 */
router.post("/", upload.single("image"), uploadMedia);

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
