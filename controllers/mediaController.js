import Media from "../models/Media.js";
import cloudinary from "../config/cloudinary.js";

/**
 * ===============================
 * UPLOAD MEDIA
 * ===============================
 */
export const uploadMedia = async (req, res) => {
  try {
    const { section, title = "", description = "" } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No media uploaded" });
    }

    // Detect whether uploaded file is image or video
    const isVideo =
      req.file.mimetype?.startsWith("video") ||
      req.file.resource_type === "video";

    const mediaType = isVideo ? "video" : "image";

    /**
     * HERO IMAGE RULE:
     * Only one hero allowed
     */
    if (section === "hero") {
      const existingHero = await Media.findOne({ section: "hero" });

      if (existingHero) {
        await cloudinary.uploader.destroy(existingHero.cloudinaryId, {
          resource_type:
            existingHero.mediaType === "video" ? "video" : "image",
        });

        await existingHero.deleteOne();
      }
    }

    const media = await Media.create({
      section,
      title,
      description,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
      mediaType, // NEW field
    });

    res.status(201).json(media);
  } catch (err) {
    console.error("Media upload error:", err);
    res.status(500).json({ message: "Media upload failed" });
  }
};

/**
 * ===============================
 * GET MEDIA BY SECTION
 * ===============================
 */
export const getMediaBySection = async (req, res) => {
  try {
    const { section } = req.params;

    const media = await Media.find({ section })
      .sort({ createdAt: -1 });

    res.json(media || []);
  } catch (err) {
    console.error("Media fetch error:", err);
    res.status(500).json({ message: "Failed to fetch media" });
  }
};

/**
 * ===============================
 * GET GLOBAL HERO IMAGE
 * ===============================
 */
export const getHeroImage = async (req, res) => {
  try {
    const hero = await Media.findOne({ section: "hero" });

    res.json(hero || null);
  } catch (err) {
    console.error("Hero fetch error:", err);
    res.status(500).json({ message: "Failed to fetch hero image" });
  }
};

/**
 * ===============================
 * DELETE MEDIA
 * ===============================
 */
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }

    await cloudinary.uploader.destroy(media.cloudinaryId, {
      resource_type:
        media.mediaType === "video" ? "video" : "image",
    });

    await media.deleteOne();

    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error("Delete media error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
};
