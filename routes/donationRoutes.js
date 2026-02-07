import express from "express";
import { initiateDonation } from "../controllers/donationController.js";

const router = express.Router();

router.post("/donate", initiateDonation);

export default router;
