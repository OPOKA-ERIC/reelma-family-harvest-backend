import express from "express";
import { adminLogin } from "../controllers/adminController.js";
import {
  exportApplicationsPDF,
  exportApplicationsExcel,
} from "../controllers/exportController.js";
import { downloadProtect } from "../middleware/downloadAuth.js";

const router = express.Router();

/* ================= ADMIN LOGIN ================= */
router.post("/login", adminLogin);

/* ================= SECURED EXPORTS ================= */
router.get("/export/pdf", downloadProtect, exportApplicationsPDF);
router.get("/export/excel", downloadProtect, exportApplicationsExcel);

export default router;
