import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const section = req.body.section;

    return {
      folder: "family-harvest-media",
      resource_type:
        section === "programs-projects" ? "auto" : "image",
      allowed_formats:
        section === "programs-projects"
          ? ["jpg", "jpeg", "png", "webp", "mp4", "mov", "webm"]
          : ["jpg", "jpeg", "png", "webp"],
    };
  },
});

const fileFilter = (req, file, cb) => {
  const section = req.body.section;

  if (section === "programs-projects") {
    if (
      file.mimetype.startsWith("image") ||
      file.mimetype.startsWith("video")
    ) {
      return cb(null, true);
    }
    return cb(new Error("Only image/video allowed"));
  }

  if (file.mimetype.startsWith("image")) {
    return cb(null, true);
  }

  cb(new Error("Images only"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

export default upload;
