import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "../models/Admin.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({
      email: "admin@familyharvest.org",
    });

    if (existing) {
      console.log("⚠️ Admin already exists");
      process.exit();
    }

    await Admin.create({
      email: "admin@familyharvest.org",
      password: "admin123",
    });

    console.log("✅ Admin created successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
