import { type NextRequest, NextResponse } from "next/server"
import { requireAdminOrOfficer } from "@/lib/auth"
import { db } from "@/lib/mock-db"
import { SolanaService } from "@/lib/solana-service"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const user = await requireAdminOrOfficer(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentId, action, reason } = await request.json()

    if (!documentId || !action) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const document = await db.getDocument(documentId)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    if (action === "approve") {
      const blockchainHash = SolanaService.generateDocumentHash(document.fileUrl + document.fileName)

      const blockchainResult = await SolanaService.registerDocumentHash(blockchainHash, document.userId, new Date())

      await db.updateDocument(documentId, {
        verificationStatus: "approved",
        verifiedBy: user.id,
        verifiedAt: new Date(),
        blockchainHash,
        blockchainTxHash: blockchainResult.txHash,
      })

      // Create notification
      await db.createNotification({
        userId: document.userId,
        title: "Document Approved",
        message: `Your ${document.fileName} has been approved and is now blockchain verified.`,
        type: "success",
        read: false,
      })

      // Audit log
      await db.createAuditLog({
        userId: user.id,
        action: "document_approved",
        details: { documentId, verifiedBy: user.id, blockchainTxHash: blockchainResult.txHash },
      })

      return NextResponse.json({ success: true, blockchainResult })
    } else if (action === "reject") {
      if (!reason) {
        return NextResponse.json({ error: "Rejection reason required" }, { status: 400 })
      }

      await db.updateDocument(documentId, {
        verificationStatus: "rejected",
        verifiedBy: user.id,
        verifiedAt: new Date(),
        rejectionReason: reason,
      })

      // Create notification
      await db.createNotification({
        userId: document.userId,
        title: "Document Rejected",
        message: `Your ${document.fileName} has been rejected. Reason: ${reason}`,
        type: "error",
        read: false,
      })

      // Audit log
      await db.createAuditLog({
        userId: user.id,
        action: "document_rejected",
        details: { documentId, verifiedBy: user.id, reason },
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
