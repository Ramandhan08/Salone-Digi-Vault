import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const user = await requireAuth(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const documents = await db.getDocumentsByUser(user.id)

    const stats = {
      total: documents.length,
      pending: documents.filter((d) => d.verificationStatus === "submitted" || d.verificationStatus === "under_review")
        .length,
      approved: documents.filter((d) => d.verificationStatus === "approved").length,
      rejected: documents.filter((d) => d.verificationStatus === "rejected").length,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[v0] Stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
