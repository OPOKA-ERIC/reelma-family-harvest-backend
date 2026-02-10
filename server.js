import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST STAY FIRST

import express from "express";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

// ROUTES
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";

import { sendEmail } from "./utils/sendEmail.js";

const app = express();

/* ---------------- DATABASE CONNECTION ---------------- */
connectDB();

/* ---------------- CORS (FINAL PRODUCTION SAFE) ---------------- */
app.use(
  cors({
    origin: [
      "https://reelmafamilyharvest.org",
      "https://www.reelmafamilyharvest.org",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("Family Harvest Backend Running ✅");
});

/* ---------------- EMAIL TEST ---------------- */
app.get("/test-email", async (req, res) => {
  try {
    await sendEmail({
      to: "familyharvest9@gmail.com",
      subject: "✅ Email Test Successful",
      html: "<h2>Email system is working correctly</h2>",
    });
    res.send("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Email test failed:", err);
    res.status(500).send("❌ Email failed");
  }
});

/* ---------------- API ROUTES ---------------- */
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/media", mediaRoutes);

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
