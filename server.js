import dotenv from "dotenv";
dotenv.config();

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

/* ---------------- TRUST PROXY (Render requirement) ---------------- */
app.set("trust proxy", 1);

/* ---------------- CORS CONFIG ---------------- */
const allowedOrigins = [
  "https://reelmafamilyharvest.org",
  "https://www.reelmafamilyharvest.org",
  "https://reelma-family-harvest-frontend.onrender.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Family Harvest Backend Running ✅",
  });
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
    console.error("❌ Email test failed:", err.message);
    res.status(500).send("❌ Email failed");
  }
});

/* ---------------- API ROUTES ---------------- */
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/media", mediaRoutes);

/* ---------------- GLOBAL ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error("🔥 Server error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

/* ---------------- START SERVER ---------------- */
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ Failed to connect DB:", error.message);
    process.exit(1);
  }
};

startServer();
