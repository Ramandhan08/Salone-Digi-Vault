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

    const { fileData } = await request.json()

    if (!fileData) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 })
    }

    const result = await AIService.extractOCR(fileData)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] OCR error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
