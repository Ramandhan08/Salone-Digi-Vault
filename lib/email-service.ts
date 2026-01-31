import nodemailer from "nodemailer"
import crypto from "crypto"
import { envServer } from "./env"

// --- EXISTING OTP FUNCTIONS ---

export function generateOTP(): string {
  const num = crypto.randomInt(0, 1000000)
  return num.toString().padStart(6, "0")
}

export async function sendOTPEmail(email: string, code: string, purpose: string): Promise<boolean> {
  if (process.env.SMTP_ENABLED === "false" || !envServer.SMTP_EMAIL) {
    console.log(`[Email Service] SMTP disabled or missing. OTP for ${email}: ${code}`)
    return true
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: envServer.SMTP_EMAIL,
      pass: envServer.SMTP_PASSWORD,
    },
  })

  const subject = `Your ${purpose} verification code`
  const text =
    `Your verification code is ${code}. It expires in 10 minutes.` +
    ` If you did not request this, please ignore this email.`

  try {
    await transporter.sendMail({
      from: envServer.SMTP_EMAIL,
      to: email,
      subject,
      text,
    })
    return true
  } catch (error) {
    console.error("Failed to send OTP email:", error)
    return false
  }
}

// --- NEW MISSING FUNCTIONS (Required to fix build) ---

export const defaultTemplates = {
  registration: {
    subject: "Event Registration Confirmed - {{eventName}}",
    body: "Dear {{userName}},\n\nYour registration for {{eventName}} has been confirmed.\n\nRegistration Number: {{registrationNumber}}\nEvent Date: {{eventDate}}\nLocation: {{eventLocation}}\n\nPlease keep your QR code safe for check-in.\n\nThank you!"
  },
  reminder: {
    subject: "Event Reminder - {{eventName}}",
    body: "Dear {{userName}},\n\nThis is a reminder that {{eventName}} is coming up soon on {{eventDate}}.\n\nLocation: {{eventLocation}}\n\nThank you!"
  },
  cancellation: {
    subject: "Event Registration Cancelled - {{eventName}}",
    body: "Dear {{userName}},\n\nYour registration for {{eventName}} has been cancelled.\n\nThank you!"
  },
  thank_you: {
    subject: "Thank You for Attending {{eventName}}",
    body: "Dear {{userName}},\n\nThank you for attending {{eventName}}! We hope you enjoyed the event.\n\nPlease share your feedback: {{feedbackUrl}}\n\nBest regards,\nThe Team"
  },
  waitlist: {
    subject: "Spot Available for {{eventName}}",
    body: "Dear {{userName}},\n\nGood news! A spot has opened up for {{eventName}}.\n\nEvent Date: {{eventDate}}\nLocation: {{eventLocation}}\n\nYou have {{expiryHours}} hours to register: {{registrationUrl}}\n\nThank you!"
  }
};

export function processTemplate(template: string, variables: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return result;
}

export async function sendEventEmail(
  to: string, 
  subject: string, 
  html: string,
  attachments?: Array<{ filename: string; content: string; encoding: string }>
): Promise<boolean> {
  if (process.env.SMTP_ENABLED === "false" || !envServer.SMTP_EMAIL) {
    console.log(`[Email Service] SMTP disabled. Event email to ${to}: ${subject}`);
    return true;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: envServer.SMTP_EMAIL,
      pass: envServer.SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: envServer.SMTP_EMAIL,
      to,
      subject,
      html,
      attachments,
    });
    return true;
  } catch (error) {
    console.error("Failed to send event email:", error);
    return false;
  }
}