import { type NextRequest, NextResponse } from "next/server"
import { requireAdminOrOfficer } from "@/lib/auth"
import { BlockchainService } from "@/lib/blockchain-service"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const user = await requireAdminOrOfficer(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const status = BlockchainService.getStatus()

    return NextResponse.json(status)
  } catch (error) {
    console.error("[v0] Blockchain status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
