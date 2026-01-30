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

    const sharedLinks = await db.getSharedLinksByUser(user.id)

    // Enrich with document data
    const enrichedLinks = await Promise.all(
      sharedLinks.map(async (link) => {
        const document = await db.getDocument(link.documentId)
        return { ...link, document }
      }),
    )

    return NextResponse.json({ links: enrichedLinks })
  } catch (error) {
    console.error("[v0] Get shared links error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
