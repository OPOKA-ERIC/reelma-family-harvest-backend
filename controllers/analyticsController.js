import Application from "../models/Application.js";

export const getApplicationAnalytics = async (req, res) => {
  try {
    /* ===== TOTALS ===== */
    const total = await Application.countDocuments();
    const approved = await Application.countDocuments({ status: "approved" });
    const rejected = await Application.countDocuments({ status: "rejected" });
    const pending = await Application.countDocuments({ status: "pending" });

    /* ===== APPLICATIONS PER COURSE ===== */
    const perCourse = await Application.aggregate([
      { $unwind: "$coursesApplied" },
      {
        $group: {
          _id: "$coursesApplied",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    /* ===== APPLICATIONS PER DAY ===== */
    const perDay = await Application.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totals: {
        total,
        approved,
        rejected,
        pending,
      },
      perCourse,
      perDay,
    });
  } catch (error) {
    console.error("❌ Analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
