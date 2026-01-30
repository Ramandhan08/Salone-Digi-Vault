import { type NextRequest, NextResponse } from "next/server"
import { requireAdminOrOfficer } from "@/lib/auth"
import { db } from "@/lib/mock-db"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const user = await requireAdminOrOfficer(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const documents = await db.getAllDocuments()

    // Filter for pending review
    const pendingDocs = documents.filter(
      (d) => d.verificationStatus === "submitted" || d.verificationStatus === "under_review",
    )

    return NextResponse.json({ documents: pendingDocs })
  } catch (error) {
    console.error("[v0] Admin documents error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
