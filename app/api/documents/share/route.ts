import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/mock-db"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const user = await requireAuth(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentId, expiresAt, permissions } = await request.json()

    if (!documentId || !expiresAt || !permissions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify document ownership
    const document = await db.getDocument(documentId)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    if (document.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Only allow sharing of approved documents
    if (document.verificationStatus !== "approved") {
      return NextResponse.json({ error: "Only approved documents can be shared" }, { status: 400 })
    }

    // Generate secure token
    const shareToken = crypto.randomBytes(32).toString("hex")

    // Create shared link
    const link = await db.createSharedLink({
      documentId,
      userId: user.id,
      token: shareToken,
      expiresAt: new Date(expiresAt),
      permissions,
    })

    // Audit log
    await db.createAuditLog({
      userId: user.id,
      action: "document_shared",
      details: { documentId, linkId: link.id, permissions, expiresAt },
    })

    return NextResponse.json({ success: true, link })
  } catch (error) {
    console.error("[v0] Share error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
