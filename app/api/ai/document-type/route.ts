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

    const { fileData, fileName } = await request.json()

    if (!fileData) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 })
    }

    const documentType = await AIService.detectDocumentType(fileData, fileName || "document.pdf")

    return NextResponse.json({ documentType })
  } catch (error) {
    console.error("[v0] Document type detection error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
