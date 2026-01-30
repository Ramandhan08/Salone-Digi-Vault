import { type NextRequest, NextResponse } from "next/server"
import { AIService } from "@/lib/ai-service"
import { requireAdminOrOfficer } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const user = await requireAdminOrOfficer(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentImage, userSelfie } = await request.json()

    if (!documentImage) {
      return NextResponse.json({ error: "Missing document image" }, { status: 400 })
    }

    const result = await AIService.verifyFace(documentImage, userSelfie)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Face verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
