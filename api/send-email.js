/**
 * Vercel Serverless Function — Send Contact Email
 * ================================================
 * POST /api/send-email
 *
 * Receives { name, email, message } and sends it to the
 * portfolio owner's Gmail using Nodemailer + SMTP.
 *
 * Environment variables (set in Vercel dashboard):
 *   GMAIL_USER          — christolabiyi35@gmail.com
 *   GMAIL_APP_PASSWORD  — Gmail App Password (16-char)
 */

const nodemailer = require("nodemailer");

// CORS headers for the portfolio origin
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

module.exports = async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, CORS_HEADERS);
    return res.end();
  }

  // Only accept POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Set CORS headers on the response
  Object.entries(CORS_HEADERS).forEach(([key, val]) => res.setHeader(key, val));

  // ── Validate environment ──────────────────────────────
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.error("Missing GMAIL_USER or GMAIL_APP_PASSWORD env vars");
    return res.status(500).json({ error: "Email service is not configured" });
  }

  // ── Parse & validate body ─────────────────────────────
  const { name, email, message } = req.body || {};

  const errors = [];
  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (
    !email ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    errors.push("A valid email address is required");
  }
  if (!message || typeof message !== "string" || message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  }

  if (errors.length) {
    return res.status(400).json({ error: errors.join(". ") });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();

  // ── Build email ───────────────────────────────────────
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const mailOptions = {
    from: `"Portfolio Contact" <${gmailUser}>`,
    replyTo: `"${cleanName}" <${cleanEmail}>`,
    to: gmailUser,
    subject: `Portfolio Inquiry from ${cleanName}`,
    text: [
      `New message from your portfolio contact form`,
      `${"─".repeat(48)}`,
      ``,
      `Name:    ${cleanName}`,
      `Email:   ${cleanEmail}`,
      ``,
      `Message:`,
      cleanMessage,
      ``,
      `${"─".repeat(48)}`,
      `Reply directly to this email to respond to ${cleanName}.`,
    ].join("\n"),
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f17; color: #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #00d4ff 0%, #a855f7 50%, #ec4899 100%); padding: 4px;">
          <div style="background: #111827; padding: 32px; border-radius: 10px;">
            <h2 style="margin: 0 0 8px; font-size: 20px; color: #fff;">New Portfolio Message</h2>
            <p style="margin: 0 0 24px; color: #9ca3af; font-size: 14px;">Someone reached out via your portfolio</p>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 12px; color: #6b7280; font-size: 13px; width: 70px;">Name</td>
                <td style="padding: 8px 12px; color: #e5e7eb; font-size: 14px;">${escapeHtml(cleanName)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 12px; color: #6b7280; font-size: 13px;">Email</td>
                <td style="padding: 8px 12px; color: #00d4ff; font-size: 14px;">
                  <a href="mailto:${escapeHtml(cleanEmail)}" style="color: #00d4ff; text-decoration: none;">${escapeHtml(cleanEmail)}</a>
                </td>
              </tr>
            </table>

            <div style="margin-top: 20px; padding: 20px; background: #1a2234; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
              <p style="margin: 0 0 8px; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Message</p>
              <p style="margin: 0; color: #e5e7eb; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(cleanMessage)}</p>
            </div>

            <p style="margin-top: 24px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08); color: #6b7280; font-size: 12px; text-align: center;">
              Reply directly to this email to respond to ${escapeHtml(cleanName)}
            </p>
          </div>
        </div>
      </div>
    `,
  };

  // ── Send ───────────────────────────────────────────────
  try {
    await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Email send failed:", err);
    return res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
};

/** Escape HTML entities to prevent XSS in the email template */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
