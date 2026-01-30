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

    return NextResponse.json({ documents })
  } catch (error) {
    console.error("[v0] List documents error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
