import { NextResponse } from "next/server"
import { SolanaService } from "@/lib/solana-service"

export async function GET() {
  try {
    const status = SolanaService.getStatus()
    return NextResponse.json(status)
  } catch (error) {
    console.error("[v0] Solana status error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
