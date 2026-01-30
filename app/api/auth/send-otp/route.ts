import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { generateOTP, sendOTPEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
    try {
        const { email, purpose } = await request.json()

        console.log("[OTP] Sending OTP to:", email, "for purpose:", purpose)

        // Validate input
        if (!email || !purpose) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
        }

        if (!["signup", "login", "password_reset"].includes(purpose)) {
            return NextResponse.json({ error: "Invalid purpose" }, { status: 400 })
        }

        // For signup, check if user already exists
        if (purpose === "signup") {
            const existingUser = await db.getUserByEmail(email)
            if (existingUser) {
                return NextResponse.json({ error: "Email already registered" }, { status: 400 })
            }
        }

        // For login, check if user exists
        if (purpose === "login") {
            const user = await db.getUserByEmail(email)
            if (!user) {
                return NextResponse.json({ error: "User not found" }, { status: 404 })
            }
        }

        // Generate OTP
        const code = generateOTP()
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        // Store OTP in database
        await db.createOTP({
            email,
            code,
            purpose: purpose as "signup" | "login" | "password_reset",
            expiresAt,
            verified: false,
        })

        // Send OTP email
        const emailSent = await sendOTPEmail(email, code, purpose)

        if (!emailSent) {
            console.error("[OTP] Failed to send email to:", email)
            // In development, still return success and log the OTP
            console.log("[OTP] Development mode - OTP code:", code)
            return NextResponse.json({
                success: true,
                message: "OTP generated (email service not configured)",
                devOTP: process.env.NODE_ENV === "development" ? code : undefined,
            })
        }

        console.log("[OTP] OTP sent successfully to:", email)

        return NextResponse.json({
            success: true,
            message: "OTP sent to your email",
            expiresIn: 600, // 20 minutes in seconds
        })
    } catch (error) {
        console.error("[OTP] Error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        )
    }
}
