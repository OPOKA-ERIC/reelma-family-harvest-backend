import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      index: true,
    },

    // ✅ EMAIL (REQUIRED + UNIQUE)
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    sex: String,
    nationality: String,
    dateOfBirth: String,

    // ✅ NATIONAL ID (BLOCK DUPLICATES)
    nationalId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    district: String,
    county: String,
    subCounty: String,
    town: String,
    parish: String,
    village: String,

    // ✅ SUPPORT MULTIPLE COURSES
    coursesApplied: {
      type: [String],
      default: [],
      index: true,
    },

    results: {
      english: String,
      mathematics: String,
      biology: String,
      chemistry: String,
      physics: String,
      geography: String,
      history: String,

      optional1: String,
      optional1Grade: String,
      optional2: String,
      optional2Grade: String,

      principal1: String,
      principal1Grade: String,
      principal2: String,
      principal2Grade: String,
      principal3: String,
      principal3Grade: String,

      subsidiary1: String,
      subsidiary1Grade: String,
      subsidiary2: String,
      subsidiary2Grade: String,
    },

    applicantPhoto: String,
    healthReport: String,

    // ✅ APPLICATION STATUS
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // 🔒 LOCK AFTER DECISION
    isLocked: {
      type: Boolean,
      default: false,
    },

    // 🧾 AUDIT TRAIL
    decision: {
      madeBy: String, // admin email or id
      madeAt: Date,
      note: String,
    },
  },
  { timestamps: true }
);

// 🔎 FAST SEARCH INDEX
applicationSchema.index({
  fullName: "text",
  email: "text",
  nationalId: "text",
});

export default mongoose.model("Application", applicationSchema);
