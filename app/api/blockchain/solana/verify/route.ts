import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { SolanaService } from "@/lib/solana-service"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const user = await requireAuth(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentHash, walletPublicKey } = await request.json()

    if (!documentHash) {
      return NextResponse.json({ error: "Document hash is required" }, { status: 400 })
    }

    const result = await SolanaService.verifyDocumentHash(documentHash, walletPublicKey)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Solana verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
