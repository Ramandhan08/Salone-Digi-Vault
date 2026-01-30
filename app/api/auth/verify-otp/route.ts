import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"

export async function POST(request: NextRequest) {
  try {
    const { email, code, purpose } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (typeof code !== "string" || code.length !== 6) {
      return NextResponse.json({ error: "Invalid OTP code" }, { status: 400 })
    }

    const otp = await db.getOTP(email, code)
    if (!otp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
    }

    if (purpose && otp.purpose !== purpose) {
      return NextResponse.json({ error: "OTP purpose mismatch" }, { status: 400 })
    }

    if (new Date(otp.expiresAt) < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 })
    }

    await db.verifyOTP(otp.id)

    await db.createAuditLog({
      userId: "system",
      action: "otp_verified",
      details: { email, purpose: otp.purpose },
    })

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
      email,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
