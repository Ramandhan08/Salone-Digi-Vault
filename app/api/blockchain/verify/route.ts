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

    const { hash } = await request.json()

    if (!hash) {
      return NextResponse.json({ error: "Missing hash" }, { status: 400 })
    }

    // Verify on blockchain
    const result = await BlockchainService.verifyDocumentHash(hash)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Blockchain verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
