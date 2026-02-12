import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const response = await resend.emails.send({
      from: "Family Harvest Foundation <onboarding@resend.dev>", 
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", response);
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw error;
  }
};
