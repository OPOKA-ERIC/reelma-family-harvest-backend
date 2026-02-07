import Application from "../models/Application.js";
import { sendEmail } from "../utils/sendEmail.js";

/* ================= SUBMIT APPLICATION ================= */
export const submitApplication = async (req, res) => {
  try {
    let parsedResults = null;
    let coursesApplied = [];

    /* ---------- PARSE RESULTS ---------- */
    if (req.body.results) {
      try {
        parsedResults = JSON.parse(req.body.results);
      } catch {
        parsedResults = null;
      }
    }

    /* ---------- PARSE COURSES (FIXED) ---------- */
    if (req.body.coursesApplied) {
      if (typeof req.body.coursesApplied === "string") {
        try {
          coursesApplied = JSON.parse(req.body.coursesApplied);
        } catch {
          coursesApplied = [req.body.coursesApplied];
        }
      }

      if (Array.isArray(req.body.coursesApplied)) {
        coursesApplied = req.body.coursesApplied;
      }
    }

    if (req.body["coursesApplied[]"]) {
      coursesApplied = Array.isArray(req.body["coursesApplied[]"])
        ? req.body["coursesApplied[]"]
        : [req.body["coursesApplied[]"]];
    }

    const application = new Application({
      fullName: req.body.fullName,
      email: req.body.email,
      sex: req.body.sex,
      nationality: req.body.nationality,
      dateOfBirth: req.body.dateOfBirth,
      nationalId: req.body.nationalId,
      district: req.body.district,
      county: req.body.county,
      subCounty: req.body.subCounty,
      town: req.body.town,
      parish: req.body.parish,
      village: req.body.village,

      results: parsedResults,
      coursesApplied,

      applicantPhoto: req.files?.photo?.[0]?.path || null,
      healthReport: req.files?.healthReport?.[0]?.path || null,
    });

    await application.save();

    await sendEmail({
      to: application.email,
      subject: "📩 Application Received – Family Harvest Foundation",
      html: `
        <p>Dear <strong>${application.fullName}</strong>,</p>
        <p>Thank you for applying to <strong>Family Harvest Foundation</strong>.</p>
        <p>Our team is reviewing your submission.</p>
        <br/>
        <p>Regards,<br/><strong>Family Harvest Foundation Admissions</strong></p>
      `,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Application submit error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET APPLICATIONS (ADMIN SAFE) ================= */
export const getApplications = async (req, res) => {
  try {
    const { status, search } = req.query;

    let filter = {};

    // ✅ Filter by status (pending / approved / rejected)
    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    // ✅ Search by name or email
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const applications = await Application.find(filter).sort({
      createdAt: -1,
    });

    res.json(applications);
  } catch (error) {
    console.error("Fetch applications error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= APPROVE / REJECT + EMAIL ================= */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    const subject =
      status === "approved"
        ? "🎉 Application Approved – Family Harvest Foundation"
        : "📄 Application Update – Family Harvest Foundation";

    const html =
      status === "approved"
        ? `
          <p>Dear ${application.fullName},</p>
          <p>Your application has been <strong>APPROVED</strong>.</p>
          <p>We will contact you with next steps.</p>
          <br/>
          <p>Family Harvest Foundation</p>
        `
        : `
          <p>Dear ${application.fullName},</p>
          <p>Thank you for applying.</p>
          <p>Unfortunately your application was not successful.</p>
          <br/>
          <p>Family Harvest Foundation</p>
        `;

    await sendEmail({
      to: application.email,
      subject,
      html,
    });

    res.json(application);
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
