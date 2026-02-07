import Application from "../models/Application.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

// ==================== PDF EXPORT ====================
export const exportApplicationsPDF = async (req, res) => {
  try {
    const applications = await Application.find().sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=applications.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Family Harvest Foundation – Applications", { align: "center" });
    doc.moveDown();

    applications.forEach((app, i) => {
      doc
        .fontSize(11)
        .text(`${i + 1}. ${app.fullName}`)
        .text(`   Email: ${app.email}`)
        .text(`   Courses: ${app.coursesApplied?.join(", ") || "N/A"}`)
        .text(`   Status: ${app.status}`)
        .moveDown(0.8);
    });

    doc.end();
  } catch (err) {
    console.error("PDF export error:", err);
    res.status(500).send("Failed to generate PDF");
  }
};

// ==================== EXCEL EXPORT ====================
export const exportApplicationsExcel = async (req, res) => {
  try {
    const applications = await Application.find();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Applications");

    sheet.columns = [
      { header: "Full Name", key: "fullName", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Courses", key: "courses", width: 30 },
      { header: "Status", key: "status", width: 15 },
      { header: "Date", key: "date", width: 20 },
    ];

    applications.forEach((a) => {
      sheet.addRow({
        fullName: a.fullName,
        email: a.email,
        courses: a.coursesApplied?.join(", "),
        status: a.status,
        date: new Date(a.createdAt).toLocaleDateString(),
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applications.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Excel export error:", err);
    res.status(500).send("Failed to generate Excel");
  }
};
