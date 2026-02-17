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
        "gallery",
      ],
      required: true,
    },

    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    // Works for BOTH images and videos
    imageUrl: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      required: true,
    },

    // Important for rendering video later
    mediaType: {
      type: String,
      enum: ["image", "video"],
      default: "image",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Media", mediaSchema);
