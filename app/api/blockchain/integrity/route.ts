import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { BlockchainService } from "@/lib/blockchain-service"
import { db } from "@/lib/mock-db"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const user = await requireAuth(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentId, fileData } = await request.json()

    if (!documentId || !fileData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get document
    const document = await db.getDocument(documentId)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Check ownership or admin/officer access
    if (document.userId !== user.id && user.role !== "admin" && user.role !== "officer") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check integrity
    const result = await BlockchainService.checkDocumentIntegrity(fileData, document.fileHash)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Integrity check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
