import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: true, // ✅ REQUIRED for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // ✅ VERIFY CONNECTION (IMPORTANT)
  await transporter.verify();

  await transporter.sendMail({
    from: `"Family Harvest Foundation" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
