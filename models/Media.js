import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    section: {
  type: String,
  enum: [
    "hero",
    "home-programs",
    "home-gallery",
    "programs-projects",
    "partners",
    "gallery"
  ],
  required: true
  },

    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
