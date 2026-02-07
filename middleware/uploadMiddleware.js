import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photo") {
      cb(null, "uploads/photos");
    } else {
      cb(null, "uploads/health");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadApplicationFiles = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "healthReport", maxCount: 1 },
]);
