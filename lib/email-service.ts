import nodemailer from "nodemailer"
import crypto from "crypto"
import { envServer } from "./env"

export function generateOTP(): string {
  const num = crypto.randomInt(0, 1000000)
  return num.toString().padStart(6, "0")
}

export async function sendOTPEmail(email: string, code: string, purpose: string): Promise<boolean> {
  if (process.env.SMTP_ENABLED === "false") {
    console.log("[Email Service] SMTP disabled, skipping email send")
    return false
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
  } catch {
    return false
  }
}
