import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { BlockchainService } from "@/lib/blockchain-service"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const user = await requireAuth(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileData } = await request.json()

    if (!fileData) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 })
    }

    // Generate document hash
    const hash = BlockchainService.generateDocumentHash(fileData)

    return NextResponse.json({ hash })
  } catch (error) {
    console.error("[v0] Hash generation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
