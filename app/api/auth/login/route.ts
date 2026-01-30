import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { createSession, verifyPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, code } = await request.json()

    if (!email || (!password && !code)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await db.getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (password) {
      const ok = await verifyPassword(password, user.passwordHash || "")
      if (!ok) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
    } else if (code) {
      const otp = await db.getOTP(email, code)
      if (!otp) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
      }
      await db.verifyOTP(otp.id)
    }

    const token = createSession(user.id, user.email)

    await db.createAuditLog({
      userId: user.id,
      action: "user_login",
      details: { email },
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
