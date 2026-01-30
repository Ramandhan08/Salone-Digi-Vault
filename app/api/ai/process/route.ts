import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/mock-db"
import { AIService } from "@/lib/ai-service"

export async function POST(request: NextRequest) {
  try {
    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json({ error: "Missing document ID" }, { status: 400 })
    }

    console.log("[v0] Starting AI processing for document:", documentId)

    // Get document
    const document = await db.getDocument(documentId)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Update status to under review
    await db.updateDocument(documentId, {
      verificationStatus: "under_review",
    })

    const aiResult = await AIService.processDocument(
      document.fileUrl, // This contains the base64 data
      document.fileName,
      document.documentType,
    )

    if (!aiResult.success) {
      console.error("[v0] AI processing failed:", aiResult.error)
      await db.updateDocument(documentId, {
        verificationStatus: "rejected",
        rejectionReason: `AI processing failed: ${aiResult.error}`,
      })

      await db.createNotification({
        userId: document.userId,
        title: "Processing Failed",
        message: `We encountered an error processing your document. Please try uploading again.`,
        type: "error",
        read: false,
      })

      return NextResponse.json({
        success: false,
        error: aiResult.error,
      })
    }

    console.log("[v0] AI processing successful, extracted data:", aiResult.extractedData)

    // Cross-reference with registry
    const registryResult = await AIService.crossReferenceRegistry(document.documentType, aiResult.extractedData || {})

    console.log("[v0] Registry check complete:", registryResult)

    // Update document with AI results
    await db.updateDocument(documentId, {
      metadata: {
        ocrText: aiResult.ocrText,
        extractedData: aiResult.extractedData,
        documentTypeDetected: aiResult.documentType,
        faceMatchScore: aiResult.faceMatchScore,
        faceMatchSuccess: aiResult.faceMatchSuccess,
        tamperScore: aiResult.tamperScore,
        tamperFlags: aiResult.tamperFlags,
        processingDate: new Date(),
        registryVerified: registryResult.verified,
        registryDetails: registryResult.details,
      },
    })

    // Create notification for user
    const hasIssues = aiResult.tamperFlags && aiResult.tamperFlags.length > 0
    await db.createNotification({
      userId: document.userId,
      title: "AI Processing Complete",
      message: hasIssues
        ? "Your document has been processed. Some issues were detected and require officer review."
        : "Your document has been processed successfully and is now pending officer approval.",
      type: hasIssues ? "warning" : "success",
      read: false,
    })

    // Create audit log
    await db.createAuditLog({
      userId: document.userId,
      action: "ai_processing_complete",
      details: {
        documentId,
        aiResult,
        registryResult,
      },
    })

    console.log("[v0] AI processing completed successfully for document:", documentId)

    return NextResponse.json({
      success: true,
      aiResult,
      registryResult,
    })
  } catch (error) {
    console.error("[v0] AI processing error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}
