import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"
import { db } from "@/lib/mock-db"
import type { DocumentType } from "@/lib/types"
import crypto from "crypto"
import { envServer } from "@/lib/env"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "")
    const user = await requireAuth(token)

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentType, fileName, fileData, fileSize, metadata } = await request.json()

    console.log("[v0] Document upload initiated by user:", user.id, "fileName:", fileName)

    if (!documentType || !fileName || !fileData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const fileHash = crypto.createHash("sha256").update(fileData).digest("hex")

    let fileUrl = fileData

    if (envServer.SUPABASE_URL && envServer.SUPABASE_ANON_KEY) {
      try {
        const { createClient } = await import("@supabase/supabase-js")
        const supabase = createClient(envServer.SUPABASE_URL, envServer.SUPABASE_ANON_KEY)
        const bucket = envServer.SUPABASE_BUCKET || "documents"
        const path = `${user.id}/${Date.now()}_${fileName}`
        const base64 = (fileData.includes(",") ? fileData.split(",")[1] : fileData)
        const buffer = Buffer.from(base64, "base64")
        const contentType = fileName.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg"
        const { error: uploadError } = await supabase.storage.from(bucket).upload(path, buffer, { contentType })
        if (!uploadError) {
          const { data } = supabase.storage.from(bucket).getPublicUrl(path)
          if (data?.publicUrl) {
            fileUrl = data.publicUrl
          }
        }
      } catch (e) {
      }
    }

    // Create document
    const document = await db.createDocument({
      userId: user.id,
      documentType: documentType as DocumentType,
      fileName,
      fileUrl,
      fileSize,
      fileHash,
      uploadedAt: new Date(),
      verificationStatus: "submitted",
      metadata: metadata || undefined,
    })

    console.log("[v0] Document created:", document.id)

    // Create audit log
    await db.createAuditLog({
      userId: user.id,
      action: "document_uploaded",
      details: { documentId: document.id, documentType, fileName },
    })

    // Create notification
    await db.createNotification({
      userId: user.id,
      title: "Document Uploaded",
      message: `Your ${fileName} has been uploaded and is awaiting AI processing.`,
      type: "info",
      read: false,
    })

    console.log("[v0] Triggering AI processing for document:", document.id)

    // Use absolute URL for the API call
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_DEV_URL || "http://localhost:3000"

    fetch(`${baseUrl}/api/ai/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: document.id }),
    }).catch((err) => {
      console.error("[v0] Failed to trigger AI processing:", err)
    })

    try {
      const reg = await (await import("@/lib/solana-service")).SolanaService._mockSolanaRegistration(
        fileHash,
        user.id,
        new Date(),
      )
      await db.updateDocument(document.id, {
        blockchainHash: fileHash,
        blockchainTxHash: reg.txHash,
        metadata: {
          ...(document.metadata || {}),
          blockchain: {
            network: "devnet",
            txHash: reg.txHash,
            blockNumber: reg.blockNumber,
          },
        },
      })
    } catch (e) {
      console.error("[v0] Blockchain registration mock failed", e)
    }

    return NextResponse.json({ success: true, document })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
