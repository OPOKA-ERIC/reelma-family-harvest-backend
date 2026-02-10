import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST BE FIRST — DO NOT MOVE

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";

// ROUTES
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";

import { sendEmail } from "./utils/sendEmail.js";

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(
  cors({
    origin: [
      "https://reelmafamilyharvest.org",
      "https://www.reelmafamilyharvest.org",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ---------------- DATABASE ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.send("Family Harvest Backend Running");
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

console.log("RAW PORT VALUE:", process.env.PORT);

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
