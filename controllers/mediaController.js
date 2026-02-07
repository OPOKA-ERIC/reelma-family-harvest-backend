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
      return res.status(400).json({ message: "No image uploaded" });
    }

    // 🔥 HERO IMAGE → ONLY ONE ALLOWED
    if (section === "hero") {
      const existingHero = await Media.findOne({ section: "hero" });

      if (existingHero) {
        await cloudinary.uploader.destroy(existingHero.cloudinaryId);
        await existingHero.deleteOne();
      }
    }

    const media = await Media.create({
      section,
      title,
      description,
      imageUrl: req.file.path,
      cloudinaryId: req.file.filename,
    });

    res.status(201).json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const media = await Media.find({ section }).sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    await cloudinary.uploader.destroy(media.cloudinaryId);
    await media.deleteOne();

    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
