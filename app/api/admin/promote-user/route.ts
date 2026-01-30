import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { requireAdmin, getAuthToken } from "@/lib/auth"
import { sendEventEmail } from "@/lib/email-service"

// POST /api/admin/promote-user
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("authorization")
        const token = getAuthToken(authHeader)
        const admin = await requireAdmin(token)

        if (!admin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const user = await db.getUserByEmail(email)

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        if (user.role === "admin") {
            return NextResponse.json({ error: "User is already an admin" }, { status: 400 })
        }

        // Update role
        await db.updateUser(user.id, { role: "admin" })

        // Send confirmation email
        const subject = "Admin Access Granted - Salone Digital Vault"
        const body = `
      <h1>Admin Access Granted</h1>
      <p>Dear ${user.name},</p>
      <p>You have been granted Administrator privileges on the Salone Digital Vault platform.</p>
      <p>You can now access the Admin Dashboard to manage events, users, and documents.</p>
      <p>Please log in again to see the changes.</p>
    `

        await sendEventEmail(user.email, subject, body)

        // Log
        await db.createAuditLog({
            userId: admin.id,
            action: "user_promoted",
            details: { targetUserId: user.id, targetEmail: user.email }
        })

        return NextResponse.json({ success: true, message: `User ${user.email} promoted to Admin` })

    } catch (error) {
        console.error("[PromoteUser] Error:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        )
    }
}
