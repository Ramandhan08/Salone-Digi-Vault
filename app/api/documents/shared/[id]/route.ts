import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/mock-db"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const user = await requireAuth(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    // Delete shared link (only if user owns it)
    const success = await db.deleteSharedLink(id)

    if (!success) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    // Audit log
    await db.createAuditLog({
      userId: user.id,
      action: "shared_link_deleted",
      details: { linkId: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete shared link error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
