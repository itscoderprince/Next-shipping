import nodemailer from "nodemailer";
import env from "@/configs/env";

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: [465].includes(Number(env.MAIL_PORT)),
  auth: {
    user: env.MAIL_USER,
    pass: env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.warn("⚠️  Email System Warning: SMTP connection failed. Check your MAIL_USER and MAIL_PASS in .env");
    console.warn(`   Error Detail: ${error.message}`);
  } else {
    console.log("✔️  Email System: Server is ready to take our messages");
  }
});

/**
 * Reusable email sending function using Nodemailer
 *
 * @param {string} subject - Email subject line
 * @param {string|string[]} to - Recipient(s) email address
 * @param {string} html - HTML content of the email
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export const sendEmail = async (subject, to, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ecommerce" <${env.MAIL_USER}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      html,
    });

    console.log("✔️ Email sent:", info.messageId);
    return { success: true, data: info };
  } catch (error) {
    // Log helpful debugging tips for common Nodemailer errors
    console.error("❌ Nodemailer Utility Error:", error);
    
    let advice = "";
    if (error.code === 'EAUTH') {
      advice = "Check your MAIL_USER and MAIL_PASS. If using Gmail, you need an App Password.";
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      advice = "Check your MAIL_HOST and MAIL_PORT. Some networks block standard SMTP ports.";
    }
    
    if (advice) console.warn(`   💡 Tip: ${advice}`);
    
    return { success: false, error: error.message };
  }
};
