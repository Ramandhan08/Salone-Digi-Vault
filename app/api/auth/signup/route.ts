import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { createSession, hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, otpVerified } = await request.json()

    console.log("[Signup] Signup attempt for email:", email)

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Check OTP verification (required for signup)
    if (!otpVerified) {
      return NextResponse.json({ error: "Email verification required" }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await db.getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password with bcrypt
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await db.createUser({
      name,
      email,
      phone: phone || undefined,
      role: "citizen",
      passwordHash,
    })

    console.log("[Signup] User created successfully:", user.id)

    // Create session
    const token = createSession(user.id, user.email)

    // Create welcome notification
    await db.createNotification({
      userId: user.id,
      title: "Welcome to Salone Digital Vault",
      message: "Your account has been created successfully. You can now upload and manage your documents securely, and register for events.",
      type: "success",
      read: false,
    })

    // Create audit log
    await db.createAuditLog({
      userId: user.id,
      action: "user_signup",
      details: { email, name },
    })

    console.log("[Signup] Signup completed for user:", user.id)

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
    console.error("[Signup] Signup error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
